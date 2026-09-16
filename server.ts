import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import {
  connectDB,
  enrollStudent,
  getAllEnrollments,
  updateEnrollment,
  getEnrollmentByEmail,
  isMongoConfigured,
  registerAuthUser,
  loginAuthUser,
  getAuthUserByToken,
  getAllAuthUsers,
  getDbStatusInfo,
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getAllBootcamps,
  getBootcampById,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp
} from "./db";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", isMongo: isMongoConfigured() });
  });

  // Establish connection to MongoDB or local fallback
  await connectDB();

  // Shared Gemini client setup
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // ----------------------------------------------------
  // AUTHENTICATION ENDPOINTS (STORED IN MONGODB)
  // ----------------------------------------------------

  // Register new account (Student or Instructor)
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { name, email, password, github, role } = req.body;
      if (!name || !email || !password) {
        return res.status(400).json({ error: "Name, email, and password are required." });
      }

      if (password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters long." });
      }

      const result = await registerAuthUser({ name, email, password, github, role });
      res.status(201).json({
        success: true,
        user: result.user,
        token: result.token,
        isMongo: isMongoConfigured()
      });
    } catch (error: any) {
      console.error("Registration Error:", error);
      res.status(400).json({ error: error.message || "Failed to register user." });
    }
  });

  // Login account
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required." });
      }

      const result = await loginAuthUser({ email, password });
      res.json({
        success: true,
        user: result.user,
        token: result.token,
        isMongo: isMongoConfigured()
      });
    } catch (error: any) {
      console.error("Login Error:", error);
      res.status(401).json({ error: error.message || "Invalid credentials." });
    }
  });

  // Get current authenticated user session
  app.get("/api/auth/me", async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.startsWith("Bearer ")
        ? authHeader.substring(7)
        : (req.headers["x-auth-token"] as string);

      if (!token) {
        return res.status(401).json({ error: "No active auth token provided." });
      }

      const user = await getAuthUserByToken(token);
      if (!user) {
        return res.status(401).json({ error: "Session expired or invalid token." });
      }

      res.json({ success: true, user, isMongo: isMongoConfigured() });
    } catch (error: any) {
      console.error("Auth me check error:", error);
      res.status(500).json({ error: "Error verifying authentication status." });
    }
  });

  // Logout session
  app.post("/api/auth/logout", (_req, res) => {
    res.json({ success: true, message: "Logged out successfully." });
  });

  // ----------------------------------------------------
  // STUDENT ENROLLMENT & ACCESS STATUS ENDPOINTS
  // ----------------------------------------------------

  // Submit enrollment application / reserve spot
  app.post("/api/enroll", async (req, res) => {
    try {
      const { name, email, github, bootcamp } = req.body;
      if (!name || !email || !github || !bootcamp) {
        return res.status(400).json({ error: "All fields are required (name, email, github, bootcamp)." });
      }

      const enrollment = await enrollStudent({ name, email, github, bootcamp });
      res.json({ success: true, enrollment });
    } catch (error: any) {
      console.error("Enrollment API Error:", error);
      res.status(500).json({ error: error.message || "Could not complete application process." });
    }
  });

  // Check enrollment/payment status & retrieve course access code
  app.post("/api/enrollment/status", async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: "Email address is required." });
      }

      const enrollment = await getEnrollmentByEmail(email);
      if (!enrollment) {
        return res.status(404).json({ error: "No reservation found for this email address. Please apply first." });
      }

      res.json({ success: true, enrollment });
    } catch (error: any) {
      console.error("Status Check API Error:", error);
      res.status(500).json({ error: error.message || "An error occurred fetching status." });
    }
  });

  // ----------------------------------------------------
  // LEAD INSTRUCTOR ADMIN PANEL ENDPOINTS
  // ----------------------------------------------------

  // Admin Middleware to authenticate password OR admin token from MongoDB
  const requireAdmin = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    const providedPassword = req.headers["x-admin-password"];

    // Check direct password header
    if (providedPassword && providedPassword === adminPassword) {
      return next();
    }

    // Also allow bearer token from MongoDB authenticated admin
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.substring(7)
      : (req.headers["x-auth-token"] as string);

    if (token) {
      const user = await getAuthUserByToken(token);
      if (user && (user.role === "admin" || user.email === "umair@dotblockers.com")) {
        return next();
      }
    }

    return res.status(401).json({ error: "Unauthorized access. Correct instructor credentials required." });
  };

  // Login verification endpoint
  app.post("/api/admin/login", (req, res) => {
    const { password } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

    if (!password) {
      return res.status(400).json({ error: "Password is required." });
    }

    if (password === adminPassword) {
      return res.json({ success: true, isMongo: isMongoConfigured() });
    } else {
      return res.status(401).json({ error: "Invalid instructor password." });
    }
  });

  // DB Connection Status & Diagnostics
  app.get("/api/db/status", (req, res) => {
    res.json({ success: true, ...getDbStatusInfo() });
  });

  // DB Reconnect trigger
  app.post("/api/db/reconnect", async (req, res) => {
    try {
      const connected = await connectDB();
      res.json({ success: true, connected, ...getDbStatusInfo() });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to reconnect to MongoDB Atlas." });
    }
  });

  // Fetch all applicants (Protected)
  app.get("/api/admin/enrollments", requireAdmin, async (req, res) => {
    try {
      const enrollments = await getAllEnrollments();
      res.json({ success: true, enrollments });
    } catch (error: any) {
      console.error("Admin Fetch Error:", error);
      res.status(500).json({ error: error.message || "Failed to fetch student data." });
    }
  });

  // Update payment status & provide/update course access code (Protected)
  app.put("/api/admin/enrollments/:id", requireAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const { paid, accessCode } = req.body;

      if (paid === undefined) {
        return res.status(400).json({ error: "Payment status 'paid' boolean is required." });
      }

      const updated = await updateEnrollment(id, { paid, accessCode });
      if (!updated) {
        return res.status(404).json({ error: "Enrollment record not found." });
      }

      res.json({ success: true, enrollment: updated });
    } catch (error: any) {
      console.error("Admin Update Error:", error);
      res.status(500).json({ error: error.message || "Failed to update record." });
    }
  });

  // Fetch all registered auth users from MongoDB (Protected)
  app.get("/api/admin/users", requireAdmin, async (req, res) => {
    try {
      const users = await getAllAuthUsers();
      res.json({ success: true, users });
    } catch (error: any) {
      console.error("Admin Users Fetch Error:", error);
      res.status(500).json({ error: error.message || "Failed to fetch users." });
    }
  });

  // ----------------------------------------------------
  // GEMINI AI INTEGRATION
  // ----------------------------------------------------
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      if (!message) {
        return res.status(400).json({ error: "Message is required." });
      }

      // Initialize chat with system instruction
      const chat = ai.chats.create({
        model: "gemini-3.5-flash",
        config: {
          systemInstruction: `You are an expert AI Tutor and Blockchain Engineer at Decentralized University.
You are assisting students who are learning Next.js 15 (App Router, Server Components), Solidity Smart Contracts, and Web3 frontend integration (ethers.js, wagmi).
Your founder and expert instructor is Umair Riaz, a renowned Blockchain Developer and Next.js instructor.
Keep your tone encouraging, technical yet accessible, and educational.
Whenever providing code, make sure to write clean, complete, modern TypeScript snippets with proper comments.
Be helpful, precise, and teach students best practices such as mobile responsiveness, state management, and smart contract security.`,
        },
        history: history || [],
      });

      const result = await chat.sendMessage({ message });
      res.json({ response: result.text });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: error.message || "An error occurred with Gemini AI." });
    }
  });

  // ----------------------------------------------------
  // COURSES MANAGEMENT API (PUBLIC & ADMIN)
  // ----------------------------------------------------
  app.get("/api/courses", async (_req, res) => {
    try {
      const courses = await getAllCourses();
      res.json({ success: true, courses, isMongo: isMongoConfigured() });
    } catch (error: any) {
      console.error("Fetch Courses Error:", error);
      res.status(500).json({ error: "Failed to load courses." });
    }
  });

  app.get("/api/courses/:id", async (req, res) => {
    try {
      const course = await getCourseById(req.params.id);
      if (!course) {
        return res.status(404).json({ error: "Course not found." });
      }
      res.json({ success: true, course });
    } catch (error: any) {
      console.error("Fetch Course Error:", error);
      res.status(500).json({ error: "Failed to load course details." });
    }
  });

  app.post("/api/courses", requireAdmin, async (req, res) => {
    try {
      const { title, description, duration, lessonsCount, difficulty, rating, enrolledStudents, tags, instructor } = req.body;
      if (!title || !description) {
        return res.status(400).json({ error: "Course title and description are required." });
      }
      const newCourse = await createCourse({
        title,
        description,
        duration: duration || "12 Hours",
        lessonsCount: Number(lessonsCount) || 16,
        difficulty: difficulty || "Intermediate",
        rating: Number(rating) || 4.9,
        enrolledStudents: Number(enrolledStudents) || 0,
        tags: tags || ["Next.js 15", "Web3"],
        instructor: instructor || "Umair Riaz",
      });
      res.status(201).json({ success: true, course: newCourse });
    } catch (error: any) {
      console.error("Create Course Error:", error);
      res.status(500).json({ error: error.message || "Failed to create course." });
    }
  });

  app.put("/api/courses/:id", requireAdmin, async (req, res) => {
    try {
      const updated = await updateCourse(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ error: "Course not found." });
      }
      res.json({ success: true, course: updated });
    } catch (error: any) {
      console.error("Update Course Error:", error);
      res.status(500).json({ error: error.message || "Failed to update course." });
    }
  });

  app.delete("/api/courses/:id", requireAdmin, async (req, res) => {
    try {
      await deleteCourse(req.params.id);
      res.json({ success: true, message: "Course deleted successfully." });
    } catch (error: any) {
      console.error("Delete Course Error:", error);
      res.status(500).json({ error: error.message || "Failed to delete course." });
    }
  });

  // ----------------------------------------------------
  // BOOTCAMPS MANAGEMENT API (PUBLIC & ADMIN)
  // ----------------------------------------------------
  app.get("/api/bootcamps", async (_req, res) => {
    try {
      const bootcamps = await getAllBootcamps();
      res.json({ success: true, bootcamps, isMongo: isMongoConfigured() });
    } catch (error: any) {
      console.error("Fetch Bootcamps Error:", error);
      res.status(500).json({ error: "Failed to load bootcamps." });
    }
  });

  app.get("/api/bootcamps/:id", async (req, res) => {
    try {
      const bootcamp = await getBootcampById(req.params.id);
      if (!bootcamp) {
        return res.status(404).json({ error: "Bootcamp not found." });
      }
      res.json({ success: true, bootcamp });
    } catch (error: any) {
      console.error("Fetch Bootcamp Error:", error);
      res.status(500).json({ error: "Failed to load bootcamp details." });
    }
  });

  app.post("/api/bootcamps", requireAdmin, async (req, res) => {
    try {
      const { title, description, duration, startDate, schedule, price, highlights, techTags, maxSeats } = req.body;
      if (!title || !description) {
        return res.status(400).json({ error: "Bootcamp title and description are required." });
      }
      const newBootcamp = await createBootcamp({
        title,
        description,
        duration: duration || "8 Weeks",
        startDate: startDate || "Upcoming Cohort",
        schedule: schedule || "Tue, Thu (6 PM - 8 PM UTC)",
        price: price || "$1,200",
        highlights: highlights || ["1-on-1 Mentoring with Umair Riaz", "Capstone Smart Contract Audit"],
        techTags: techTags || ["Next.js", "Solidity", "Web3"],
        maxSeats: Number(maxSeats) || 25,
      });
      res.status(201).json({ success: true, bootcamp: newBootcamp });
    } catch (error: any) {
      console.error("Create Bootcamp Error:", error);
      res.status(500).json({ error: error.message || "Failed to create bootcamp." });
    }
  });

  app.put("/api/bootcamps/:id", requireAdmin, async (req, res) => {
    try {
      const updated = await updateBootcamp(req.params.id, req.body);
      if (!updated) {
        return res.status(404).json({ error: "Bootcamp not found." });
      }
      res.json({ success: true, bootcamp: updated });
    } catch (error: any) {
      console.error("Update Bootcamp Error:", error);
      res.status(500).json({ error: error.message || "Failed to update bootcamp." });
    }
  });

  app.delete("/api/bootcamps/:id", requireAdmin, async (req, res) => {
    try {
      await deleteBootcamp(req.params.id);
      res.json({ success: true, message: "Bootcamp deleted successfully." });
    } catch (error: any) {
      console.error("Delete Bootcamp Error:", error);
      res.status(500).json({ error: error.message || "Failed to delete bootcamp." });
    }
  });

  // ----------------------------------------------------
  // SEO ENDPOINTS: SITEMAP & ROBOTS
  // ----------------------------------------------------
  app.get("/robots.txt", (req, res) => {
    const host = req.get("host") || "localhost:3000";
    const protocol = req.protocol || "http";
    const robotsContent = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

Sitemap: ${protocol}://${host}/sitemap.xml
`;
    res.type("text/plain").send(robotsContent);
  });

  app.get("/sitemap.xml", async (req, res) => {
    try {
      const host = req.get("host") || "localhost:3000";
      const protocol = req.protocol || "http";
      const baseUrl = `${protocol}://${host}`;
      const now = new Date().toISOString().split("T")[0];

      const courses = await getAllCourses();
      const bootcamps = await getAllBootcamps();

      const staticRoutes = [
        { path: "", priority: "1.0", changefreq: "weekly" },
        { path: "/courses", priority: "0.9", changefreq: "weekly" },
        { path: "/bootcamps", priority: "0.9", changefreq: "weekly" },
        { path: "/video-lessons", priority: "0.8", changefreq: "weekly" },
        { path: "/instructor", priority: "0.8", changefreq: "monthly" },
        { path: "/blogs", priority: "0.8", changefreq: "weekly" },
        { path: "/access-status", priority: "0.7", changefreq: "monthly" },
        { path: "/login", priority: "0.6", changefreq: "monthly" },
        { path: "/register", priority: "0.7", changefreq: "monthly" },
      ];

      let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
      xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

      staticRoutes.forEach((route) => {
        xml += `  <url>\n`;
        xml += `    <loc>${baseUrl}${route.path}</loc>\n`;
        xml += `    <lastmod>${now}</lastmod>\n`;
        xml += `    <changefreq>${route.changefreq}</changefreq>\n`;
        xml += `    <priority>${route.priority}</priority>\n`;
        xml += `  </url>\n`;
      });

      courses.forEach((c) => {
        xml += `  <url>\n`;
        xml += `    <loc>${baseUrl}/courses/${c.id}</loc>\n`;
        xml += `    <lastmod>${now}</lastmod>\n`;
        xml += `    <changefreq>weekly</changefreq>\n`;
        xml += `    <priority>0.85</priority>\n`;
        xml += `  </url>\n`;
      });

      bootcamps.forEach((b) => {
        xml += `  <url>\n`;
        xml += `    <loc>${baseUrl}/bootcamps/${b.id}</loc>\n`;
        xml += `    <lastmod>${now}</lastmod>\n`;
        xml += `    <changefreq>weekly</changefreq>\n`;
        xml += `    <priority>0.85</priority>\n`;
        xml += `  </url>\n`;
      });

      xml += `</urlset>`;

      res.type("application/xml").send(xml);
    } catch (e: any) {
      console.error("Sitemap generation error:", e);
      res.status(500).send("Error generating sitemap");
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
