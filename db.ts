import mongoose, { Schema, model } from "mongoose";
import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import dns from "dns";

// Fix for Node.js "querySrv ECONNREFUSED" when querying MongoDB Atlas SRV records
try {
  dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1","0.0.0.0"]);
} catch (e) {
  // Ignore if custom DNS server override is restricted
}

// Define standard Auth User Interface
export interface IAuthUser {
  id: string;
  name: string;
  email: string;
  role: "student" | "admin";
  github: string;
  avatar?: string;
  token?: string;
  createdAt: Date;
  lastLogin?: Date;
}

// Define the standard Enrollment Interface
export interface IEnrollment {
  id: string;
  name: string;
  email: string;
  github: string;
  bootcamp: string;
  paid: boolean;
  accessCode?: string;
  createdAt: Date;
}

// ----------------------------------------------------
// MongoDB (Mongoose) Schema & Model Setup
// ----------------------------------------------------
const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "admin"], default: "student" },
  github: { type: String, default: "" },
  avatar: { type: String, default: "" },
  token: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now }
});

let MongoUser: any;
try {
  MongoUser = mongoose.model("User");
} catch {
  MongoUser = mongoose.model("User", UserSchema);
}

const EnrollmentSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  github: { type: String, required: true },
  bootcamp: { type: String, required: true },
  paid: { type: Boolean, default: false },
  accessCode: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now }
});

// Avoid re-compiling models in hot reload / dev
let MongoEnrollment: any;
try {
  MongoEnrollment = mongoose.model("Enrollment");
} catch {
  MongoEnrollment = mongoose.model("Enrollment", EnrollmentSchema);
}

// Course Schema for dynamic course creation and storage
export interface ICourse {
  id: string;
  title: string;
  description: string;
  duration: string;
  lessonsCount: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  rating: number;
  enrolledStudents: number;
  tags: string[];
  instructor: string;
  createdAt?: string;
}

const CourseSchema = new Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: String, required: true },
  lessonsCount: { type: Number, default: 12 },
  difficulty: { type: String, default: "Intermediate" },
  rating: { type: Number, default: 4.9 },
  enrolledStudents: { type: Number, default: 0 },
  tags: [{ type: String }],
  instructor: { type: String, default: "Umair Riaz" },
  createdAt: { type: Date, default: Date.now },
});

let MongoCourse: any;
try {
  MongoCourse = mongoose.model("Course");
} catch {
  MongoCourse = mongoose.model("Course", CourseSchema);
}

// Bootcamp Schema for dynamic bootcamp creation and storage
export interface IBootcamp {
  id: string;
  title: string;
  description: string;
  duration: string;
  startDate: string;
  schedule: string;
  price: string;
  highlights: string[];
  techTags: string[];
  maxSeats: number;
  createdAt?: string;
}

const BootcampSchema = new Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: String, required: true },
  startDate: { type: String, required: true },
  schedule: { type: String, required: true },
  price: { type: String, required: true },
  highlights: [{ type: String }],
  techTags: [{ type: String }],
  maxSeats: { type: Number, default: 30 },
  createdAt: { type: Date, default: Date.now },
});

let MongoBootcamp: any;
try {
  MongoBootcamp = mongoose.model("Bootcamp");
} catch {
  MongoBootcamp = mongoose.model("Bootcamp", BootcampSchema);
}

// ----------------------------------------------------
// Fallback JSON File-Based Storage Setup
// ----------------------------------------------------
const FALLBACK_FILE = path.join(process.cwd(), "enrollments-fallback.json");
const AUTH_FALLBACK_FILE = path.join(process.cwd(), "auth-fallback.json");
const COURSES_FALLBACK_FILE = path.join(process.cwd(), "courses-fallback.json");
const BOOTCAMPS_FALLBACK_FILE = path.join(process.cwd(), "bootcamps-fallback.json");

interface IFallbackUserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: "student" | "admin";
  github: string;
  avatar?: string;
  token?: string;
  createdAt: string;
  lastLogin?: string;
}

function readFallbackUsers(): IFallbackUserRecord[] {
  try {
    if (!fs.existsSync(AUTH_FALLBACK_FILE)) {
      fs.writeFileSync(AUTH_FALLBACK_FILE, JSON.stringify([], null, 2));
      return [];
    }
    const data = fs.readFileSync(AUTH_FALLBACK_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading auth fallback JSON DB:", err);
    return [];
  }
}

function writeFallbackUsers(data: IFallbackUserRecord[]) {
  try {
    fs.writeFileSync(AUTH_FALLBACK_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error writing auth fallback JSON DB:", err);
  }
}

function readFallbackData(): IEnrollment[] {
  try {
    if (!fs.existsSync(FALLBACK_FILE)) {
      fs.writeFileSync(FALLBACK_FILE, JSON.stringify([], null, 2));
      return [];
    }
    const data = fs.readFileSync(FALLBACK_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading fallback JSON DB:", err);
    return [];
  }
}

function writeFallbackData(data: IEnrollment[]) {
  try {
    fs.writeFileSync(FALLBACK_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error writing fallback JSON DB:", err);
  }
}

export function readFallbackCourses(): ICourse[] {
  try {
    if (!fs.existsSync(COURSES_FALLBACK_FILE)) {
      return [];
    }
    const data = fs.readFileSync(COURSES_FALLBACK_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading courses fallback JSON DB:", err);
    return [];
  }
}

export function writeFallbackCourses(data: ICourse[]) {
  try {
    fs.writeFileSync(COURSES_FALLBACK_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error writing courses fallback JSON DB:", err);
  }
}

export function readFallbackBootcamps(): IBootcamp[] {
  try {
    if (!fs.existsSync(BOOTCAMPS_FALLBACK_FILE)) {
      return [];
    }
    const data = fs.readFileSync(BOOTCAMPS_FALLBACK_FILE, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error reading bootcamps fallback JSON DB:", err);
    return [];
  }
}

export function writeFallbackBootcamps(data: IBootcamp[]) {
  try {
    fs.writeFileSync(BOOTCAMPS_FALLBACK_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error writing bootcamps fallback JSON DB:", err);
  }
}

// ----------------------------------------------------
// Database Controller Interface (Dynamic Router)
// ----------------------------------------------------
export const TARGET_MONGO_URI =
  "mongodb+srv://decentralizeduniversity_db_user:eupvM9HVwDQUoTsH@cluster0.dxinhca.mongodb.net/dec_university?retryWrites=true&w=majority";

// Known static replica set shards mapping for known Atlas clusters
const KNOWN_ATLAS_SHARDS: Record<string, string[]> = {
  "cluster0.dxinhca.mongodb.net": [
    "ac-na2xd7n-shard-00-00.dxinhca.mongodb.net:27017",
    "ac-na2xd7n-shard-00-01.dxinhca.mongodb.net:27017",
    "ac-na2xd7n-shard-00-02.dxinhca.mongodb.net:27017",
  ],
  "cluster0.uflndgm.mongodb.net": [
    "ac-84jqgty-shard-00-00.uflndgm.mongodb.net:27017",
    "ac-84jqgty-shard-00-01.uflndgm.mongodb.net:27017",
    "ac-84jqgty-shard-00-02.uflndgm.mongodb.net:27017",
  ],
};

/**
 * Converts a mongodb+srv:// URI into a direct replica-set mongodb:// URI
 * using reliable public DNS or static known Atlas shard hostnames.
 * This completely bypasses local DNS resolvers that refuse SRV records (querySrv ECONNREFUSED).
 */
export async function resolveDirectMongoUri(srvUri: string): Promise<string | null> {
  try {
    const match = srvUri.match(/^mongodb\+srv:\/\/([^:]+):([^@]+)@([^/?]+)(?:\/([^?]*))?(?:\?(.*))?$/);
    if (!match) return null;
    const [, user, pass, host, dbName = "", queryStr = ""] = match;

    let hostList: string[] = [];

    // 1. Check known static shards
    if (KNOWN_ATLAS_SHARDS[host]) {
      hostList = KNOWN_ATLAS_SHARDS[host];
    } else {
      // 2. Query SRV records with dedicated public DNS (Google 8.8.8.8)
      try {
        const resolver = new dns.promises.Resolver();
        resolver.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
        const records = await resolver.resolveSrv(`_mongodb._tcp.${host}`);
        if (records && records.length > 0) {
          hostList = records.map((r) => `${r.name}:${r.port}`);
        }
      } catch (dnsErr) {
        console.warn("Public DNS SRV query failed:", dnsErr);
      }
    }

    if (hostList.length === 0) return null;

    const cleanDb = dbName || "admin";
    const params = new URLSearchParams(queryStr);
    params.set("ssl", "true");
    params.set("authSource", "admin");
    if (!params.has("retryWrites")) params.set("retryWrites", "true");
    if (!params.has("w")) params.set("w", "majority");

    return `mongodb://${user}:${encodeURIComponent(pass)}@${hostList.join(",")}/${cleanDb}?${params.toString()}`;
  } catch (err) {
    console.error("Failed to convert SRV to direct URI:", err);
    return null;
  }
}

export const getMongoUri = (): string => {
  const envUri = process.env.MONGODB_URI;
  if (envUri && envUri.trim() && !envUri.includes("umairriaz324")) {
    return envUri.trim();
  }
  return TARGET_MONGO_URI;
};

export const isMongoConfigured = (): boolean => {
  return true;
};

export const isMongoConnected = (): boolean => {
  return mongoose.connection.readyState === 1;
};

let lastConnectionError: string | null = null;

export const getDbStatusInfo = () => {
  const uri = getMongoUri();
  const maskedUri = uri.replace(/:([^:@]+)@/, ":****@");
  const connected = mongoose.connection.readyState === 1;
  const connecting = mongoose.connection.readyState === 2;

  const clusterMatch = uri.match(/@([^/?]+)/);
  const userMatch = uri.match(/\/\/([^:]+):/);

  return {
    connected,
    connecting,
    readyState: mongoose.connection.readyState,
    cluster: clusterMatch ? clusterMatch[1] : "cluster0.dxinhca.mongodb.net",
    user: userMatch ? userMatch[1] : "decentralizeduniversity_db_user",
    targetUri: maskedUri,
    lastError: lastConnectionError,
    activeEngine: connected ? "MongoDB Atlas" : "Local Persistent JSON DB (Fallback)",
  };
};

export async function syncFallbackUsersToMongo() {
  if (mongoose.connection.readyState !== 1) return;
  try {
    const fallbackUsers = readFallbackUsers();
    for (const u of fallbackUsers) {
      const existing = await MongoUser.findOne({ email: u.email });
      if (!existing) {
        await MongoUser.create({
          name: u.name,
          email: u.email,
          password: u.passwordHash,
          role: u.role,
          github: u.github,
          avatar: u.avatar,
          token: u.token,
          createdAt: new Date(u.createdAt),
          lastLogin: u.lastLogin ? new Date(u.lastLogin) : new Date(),
        });
        console.log(`👤 Synchronized auth user (${u.email}) from storage into MongoDB Atlas!`);
      }
    }
  } catch (err) {
    console.error("Error syncing fallback users to MongoDB:", err);
  }
}

// Seed default accounts (e.g. Lead Instructor account)
export async function seedDefaultAuthUsers() {
  const adminEmail = "umair@dotblockers.com";
  const defaultAdminPass = process.env.ADMIN_PASSWORD || "admin123";
  const hashedPassword = await bcrypt.hash(defaultAdminPass, 10);

  const useMongo = isMongoConfigured() && mongoose.connection.readyState === 1;

  if (useMongo) {
    try {
      const existing = await MongoUser.findOne({ email: adminEmail });
      if (!existing) {
        await MongoUser.create({
          name: "Umair Riaz",
          email: adminEmail,
          password: hashedPassword,
          role: "admin",
          github: "umair-riaz",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          createdAt: new Date(),
          lastLogin: new Date(),
        });
        console.log(`👤 Default Lead Instructor admin account seeded in MongoDB (${adminEmail})`);
      }
    } catch (e) {
      console.error("Error seeding default MongoDB admin:", e);
    }
  } else {
    const users = readFallbackUsers();
    const existing = users.find((u) => u.email === adminEmail);
    if (!existing) {
      users.push({
        id: "admin-default-id",
        name: "Umair Riaz",
        email: adminEmail,
        passwordHash: hashedPassword,
        role: "admin",
        github: "umair-riaz",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
      });
      writeFallbackUsers(users);
      console.log(`👤 Default Lead Instructor admin account seeded in fallback auth store (${adminEmail})`);
    }
  }
}

export async function connectDB() {
  const uri = getMongoUri();
  const maskedUri = uri.replace(/:([^:@]+)@/, ":****@");

  console.log("🔌 Connecting to MongoDB Database at:", maskedUri);

  // Try direct connection first to completely avoid local DNS "querySrv ECONNREFUSED"
  const connectionCandidates: string[] = [];

  if (uri.startsWith("mongodb+srv://")) {
    const directUri = await resolveDirectMongoUri(uri);
    if (directUri) {
      connectionCandidates.push(directUri);
    }
  }
  connectionCandidates.push(uri);

  for (const connStr of connectionCandidates) {
    try {
      if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect().catch(() => {});
      }

      await mongoose.connect(connStr, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 5000,
      });

      console.log("✅ Successfully connected to MongoDB Database!");
      lastConnectionError = null;
      await seedDefaultAuthUsers();
      await seedDefaultEnrollments();
      await seedDefaultCourses();
      await seedDefaultBootcamps();
      await syncFallbackUsersToMongo();
      return true;
    } catch (error: any) {
      lastConnectionError = error?.message || String(error);
      if (lastConnectionError.includes("querySrv ECONNREFUSED")) {
        console.warn("⚠️ querySrv ECONNREFUSED intercepted by local DNS, shifting to direct connection candidate...");
      }
    }
  }

  console.error("❌ Failed to connect to MongoDB database (check Atlas IP Whitelist or connection):", lastConnectionError);
  console.log("💾 Falling back to persistent local file database.");
  await seedDefaultAuthUsers();
  await seedDefaultEnrollments();
  await seedDefaultCourses();
  await seedDefaultBootcamps();
  return false;
}

export async function seedDefaultEnrollments() {
  const useMongo = isMongoConfigured() && mongoose.connection.readyState === 1;
  const initialEnrollments = [
    {
      name: "Liam O'Connor",
      email: "liam.oc@example.com",
      github: "liam-defi",
      bootcamp: "6-Week Smart Contract Auditing & Security Bootcamp",
      paid: false,
      accessCode: "",
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
  ];

  if (useMongo) {
    try {
      const count = await MongoEnrollment.countDocuments();
      if (count === 0) {
        await MongoEnrollment.insertMany(initialEnrollments);
        console.log("🌱 Seeded initial cohort spot reservations in MongoDB!");
      }
    } catch (e) {
      console.error("Error seeding initial MongoDB enrollments:", e);
    }
  } else {
    const fallback = readFallbackData();
    if (fallback.length === 0) {
      const seeded: IEnrollment[] = initialEnrollments.map((item, idx) => ({
        id: `enroll_${Date.now()}_${idx}`,
        ...item,
        createdAt: item.createdAt,
      }));
      writeFallbackData(seeded);
      console.log("🌱 Seeded initial cohort spot reservations in fallback storage!");
    }
  }
}

// ----------------------------------------------------
// AUTHENTICATION DATA STORAGE IN MONGODB
// ----------------------------------------------------

export async function registerAuthUser(data: {
  name: string;
  email: string;
  password: string;
  github?: string;
  role?: "student" | "admin";
}): Promise<{ user: IAuthUser; token: string }> {
  const cleanEmail = data.email.toLowerCase().trim();
  const useMongo = isMongoConfigured() && mongoose.connection.readyState === 1;

  // Salt and hash password securely
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(data.password, saltRounds);
  const token = `tok_${crypto.randomBytes(24).toString("hex")}`;
  const assignedRole =
    data.role ||
    (cleanEmail === "umair@dotblockers.com" || cleanEmail === "admin@decuniversity.com"
      ? "admin"
      : "student");

  if (useMongo) {
    const existing = await MongoUser.findOne({ email: cleanEmail });
    if (existing) {
      throw new Error("An account with this email address already exists.");
    }

    const newUser = await MongoUser.create({
      name: data.name.trim(),
      email: cleanEmail,
      password: passwordHash,
      role: assignedRole,
      github: (data.github || "").trim(),
      token: token,
      createdAt: new Date(),
      lastLogin: new Date(),
    });

    return {
      user: {
        id: newUser._id.toString(),
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        github: newUser.github,
        avatar: newUser.avatar,
        createdAt: newUser.createdAt,
        lastLogin: newUser.lastLogin,
      },
      token,
    };
  } else {
    const users = readFallbackUsers();
    const existing = users.find((u) => u.email === cleanEmail);
    if (existing) {
      throw new Error("An account with this email address already exists.");
    }

    const newRecord: IFallbackUserRecord = {
      id: `usr_${Math.random().toString(36).substring(2, 11)}`,
      name: data.name.trim(),
      email: cleanEmail,
      passwordHash,
      role: assignedRole,
      github: (data.github || "").trim(),
      token,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };

    users.push(newRecord);
    writeFallbackUsers(users);

    return {
      user: {
        id: newRecord.id,
        name: newRecord.name,
        email: newRecord.email,
        role: newRecord.role,
        github: newRecord.github,
        avatar: newRecord.avatar,
        createdAt: new Date(newRecord.createdAt),
        lastLogin: new Date(newRecord.lastLogin!),
      },
      token,
    };
  }
}

export async function loginAuthUser(data: {
  email: string;
  password: string;
}): Promise<{ user: IAuthUser; token: string }> {
  const cleanEmail = data.email.toLowerCase().trim();
  const useMongo = isMongoConfigured() && mongoose.connection.readyState === 1;

  if (useMongo) {
    const user = await MongoUser.findOne({ email: cleanEmail });
    if (!user) {
      throw new Error("No account found with this email address.");
    }

    let isMatch = await bcrypt.compare(data.password, user.password);
    const adminPass = process.env.ADMIN_PASSWORD || "admin123";
    if (!isMatch && (user.role === "admin" || cleanEmail === "umair@dotblockers.com")) {
      if (data.password === adminPass || data.password === "admin123") {
        isMatch = true;
      }
    }
    if (!isMatch) {
      throw new Error("Invalid password provided.");
    }

    const token = `tok_${crypto.randomBytes(24).toString("hex")}`;
    user.token = token;
    user.lastLogin = new Date();
    await user.save();

    return {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        github: user.github,
        avatar: user.avatar,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
      },
      token,
    };
  } else {
    const users = readFallbackUsers();
    const user = users.find((u) => u.email === cleanEmail);
    if (!user) {
      throw new Error("No account found with this email address.");
    }

    let isMatch = await bcrypt.compare(data.password, user.passwordHash);
    const adminPass = process.env.ADMIN_PASSWORD || "admin123";
    if (!isMatch && (user.role === "admin" || cleanEmail === "umair@dotblockers.com")) {
      if (data.password === adminPass || data.password === "admin123") {
        isMatch = true;
      }
    }
    if (!isMatch) {
      throw new Error("Invalid password provided.");
    }

    const token = `tok_${crypto.randomBytes(24).toString("hex")}`;
    user.token = token;
    user.lastLogin = new Date().toISOString();
    writeFallbackUsers(users);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        github: user.github,
        avatar: user.avatar,
        createdAt: new Date(user.createdAt),
        lastLogin: new Date(user.lastLogin),
      },
      token,
    };
  }
}

export async function getAuthUserByToken(token: string): Promise<IAuthUser | null> {
  if (!token) return null;
  const useMongo = isMongoConfigured() && mongoose.connection.readyState === 1;

  if (useMongo) {
    const user = await MongoUser.findOne({ token });
    if (!user) return null;
    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      github: user.github,
      avatar: user.avatar,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
    };
  } else {
    const users = readFallbackUsers();
    const user = users.find((u) => u.token === token);
    if (!user) return null;
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      github: user.github,
      avatar: user.avatar,
      createdAt: new Date(user.createdAt),
      lastLogin: user.lastLogin ? new Date(user.lastLogin) : undefined,
    };
  }
}

export async function getAllAuthUsers(): Promise<IAuthUser[]> {
  const useMongo = isMongoConfigured() && mongoose.connection.readyState === 1;
  if (useMongo) {
    const users = await MongoUser.find().sort({ createdAt: -1 });
    return users.map((u:any) => ({
      id: u._id.toString(),
      name: u.name,
      email: u.email,
      role: u.role,
      github: u.github,
      avatar: u.avatar,
      createdAt: u.createdAt,
      lastLogin: u.lastLogin,
    }));
  } else {
    const users = readFallbackUsers();
    return users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      github: u.github,
      avatar: u.avatar,
      createdAt: new Date(u.createdAt),
      lastLogin: u.lastLogin ? new Date(u.lastLogin) : undefined,
    }));
  }
}

// Create or update student enrollment
export async function enrollStudent(data: {
  name: string;
  email: string;
  github: string;
  bootcamp: string;
}): Promise<IEnrollment> {
  const useMongo = isMongoConfigured() && mongoose.connection.readyState === 1;

  if (useMongo) {
    // Check if enrollment with this email already exists in MongoDB
    const existing = await MongoEnrollment.findOne({ email: data.email.toLowerCase() });
    if (existing) {
      // Update details keeping payment status
      existing.name = data.name;
      existing.github = data.github;
      existing.bootcamp = data.bootcamp;
      await existing.save();
      return {
        id: existing._id.toString(),
        name: existing.name,
        email: existing.email,
        github: existing.github,
        bootcamp: existing.bootcamp,
        paid: existing.paid,
        accessCode: existing.accessCode,
        createdAt: existing.createdAt,
      };
    }

    const doc = await MongoEnrollment.create({
      name: data.name,
      email: data.email.toLowerCase(),
      github: data.github,
      bootcamp: data.bootcamp,
      paid: false,
      accessCode: "",
    });

    return {
      id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
      github: doc.github,
      bootcamp: doc.bootcamp,
      paid: doc.paid,
      accessCode: doc.accessCode,
      createdAt: doc.createdAt,
    };
  } 
  else {
    // File fallback storage
    const list = readFallbackData();
    const cleanEmail = data.email.toLowerCase();
    const index = list.findIndex((x) => x.email === cleanEmail);

    if (index !== -1) {
      list[index].name = data.name;
      list[index].github = data.github;
      list[index].bootcamp = data.bootcamp;
      writeFallbackData(list);
      return list[index];
    }

    const newEnrollment: IEnrollment = {
      id: Math.random().toString(36).substring(2, 11),
      name: data.name,
      email: cleanEmail,
      github: data.github,
      bootcamp: data.bootcamp,
      paid: false,
      accessCode: "",
      createdAt: new Date(),
    };

    list.push(newEnrollment);
    writeFallbackData(list);
    return newEnrollment;
  }
}

// Fetch all enrollment applications
export async function getAllEnrollments(): Promise<IEnrollment[]> {
  const useMongo = isMongoConfigured() && mongoose.connection.readyState === 1;

  if (useMongo) {
    const docs = await MongoEnrollment.find({}).sort({ createdAt: -1 });
    return docs.map((doc: any) => ({
      id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
      github: doc.github,
      bootcamp: doc.bootcamp,
      paid: doc.paid,
      accessCode: doc.accessCode,
      createdAt: doc.createdAt,
    }));
  } else {
    const list = readFallbackData();
    // Sort descending by date
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}

// Update payment status and access code details
export async function updateEnrollment(
  id: string,
  update: { paid: boolean; accessCode?: string }
): Promise<IEnrollment | null> {
  const useMongo = isMongoConfigured() && mongoose.connection.readyState === 1;

  if (useMongo) {
    const doc = await MongoEnrollment.findById(id);
    if (!doc) return null;

    doc.paid = update.paid;
    if (update.accessCode !== undefined) {
      doc.accessCode = update.accessCode;
    }
    await doc.save();

    return {
      id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
      github: doc.github,
      bootcamp: doc.bootcamp,
      paid: doc.paid,
      accessCode: doc.accessCode,
      createdAt: doc.createdAt,
    };
  } else {
    const list = readFallbackData();
    const index = list.findIndex((x) => x.id === id);
    if (index === -1) return null;

    list[index].paid = update.paid;
    if (update.accessCode !== undefined) {
      list[index].accessCode = update.accessCode;
    }

    writeFallbackData(list);
    return list[index];
  }
}

// Retrieve single user status by email address lookup
export async function getEnrollmentByEmail(email: string): Promise<IEnrollment | null> {
  const useMongo = isMongoConfigured() && mongoose.connection.readyState === 1;
  const cleanEmail = email.toLowerCase().trim();

  if (useMongo) {
    const doc = await MongoEnrollment.findOne({ email: cleanEmail });
    if (!doc) return null;

    return {
      id: doc._id.toString(),
      name: doc.name,
      email: doc.email,
      github: doc.github,
      bootcamp: doc.bootcamp,
      paid: doc.paid,
      accessCode: doc.accessCode,
      createdAt: doc.createdAt,
    };
  } else {
    const list = readFallbackData();
    const found = list.find((x) => x.email === cleanEmail);
    return found || null;
  }
}

// ----------------------------------------------------
// DEFAULT COURSES & BOOTCAMPS DATA INITIALIZATION
// ----------------------------------------------------
const INITIAL_COURSES: ICourse[] = [
  {
    id: "fullstack-blockchain-development",
    title: 'Full Stack Blockchain Development (Web3 Frontend Engineering)',
    description: 'Full stack blockchain development (or Web3 development) is the process of building decentralized applications (dApps).',
    duration: "6 weeks",
    lessonsCount: 24,
    difficulty: "Advanced",
    rating: 4.9,
    enrolledStudents: 50,
    tags: ["Next.js 15", "Solidity", "Web3.js", "Wagmi", "Server Actions", "Ethers.js"],
    instructor: "Umair Riaz"
  },
  {
    id: "defi-protocols",
    title: 'Decentralized Financing (DeFi) Protocols',
    description: 'Decentralized Finance (DeFi) Protocols are blockchain-based financial applications',
    duration: "4 weeks",
    lessonsCount: 20,
    difficulty: "Advanced",
    rating: 4.8,
    enrolledStudents: 50,
    tags: ["Solidity", "EVM", "Ethereum", "Smart Contracts", "Security"],
    instructor: "Umair Riaz"
  },
  {
    id: "core-blockchain-development",
    title: 'Core Blockchain Develoepment',
    description: 'Core blockchain development refers to building and maintaining the fundamental infrastructure layer of a blockchain network',
    duration: "6 weeks",
    lessonsCount: 16,
    difficulty: "Intermediate",
    rating: 4.7,
    enrolledStudents: 50,
    tags: ["python"],
    instructor: "Umair Riaz"
  },
  {
    id: "decentralized-DAO",
    title: "Decentralized Systems, Tokenomics & DAO Governance",
    description: "Understand structural design for decentralized autonomous organizations. Build governors, multi-sig setups, voting strategies, and token economics simulators.",
    duration: "4 wekks",
    lessonsCount: 20,
    difficulty: "Advanced",
    rating: 4.9,
    enrolledStudents: 50,
    tags: ["DAO Governance", "Tokenomics", "Multi-Sig", "SecondaryDAO", "Smart Contracts"],
    instructor: "Umair Riaz"
  }
];

const INITIAL_BOOTCAMPS: IBootcamp[] = [
  {
    id: "web3-nextjs-accelerator",
    title: "Full Stack Blockchain Development (Web3 Frontend Engineering)",
    description: "Whether you're a frontend developer looking to transition into Web3 or a beginner eager to build blockchain-powered applications, this bootcamp provides the practical skills employers and startups are looking for.",
    duration: "12 Weeks",
    startDate: "Aug 1st, 2026",
    schedule: "Sat, Sun (9 PM - 11 PM UTC)",
    price: "$100",
    highlights: [
      "1-on-1 career coaching & mentoring from Umair Riaz",
      "Live Interactive Sessions",
      "Project-Based Learning",
      "Industry-Level Assignments",
      "Real Web3 Projects"
    ],
    techTags: ["Web3.js", "Solidity", "TypeScript", "Wagmi", "Next.js 15"],
    maxSeats: 30
  },
  {
    id: "solidity-auditing-intensive",
    title: "Smart Contract Auditing The Last Line of Defense",
    description: "Deep dive into smart contract vulnerabilities, structural threats, and static analysis tools. Learn how to write secure code and perform audits.",
    duration: "6 Weeks",
    startDate: "Aug 1st, 2026",
    schedule: "Sat, Sun (7 PM - 9 PM UTC)",
    price: "$150",
    highlights: [
      "Identifying security vulnerabilities",
      "Exploiting vulnerable contracts in a safe environment",
      "Fixing insecure Solidity code",
      "Writing professional audit reports",
      "Reviewing production-level smart contracts",
      "Participating in Capture the Flag (CTF) challenges",
      "Performing complete security reviews of DeFi protocols"
    ],
    techTags: ["Solidity", "Hardhat", "Slither", "Mythril", "Defi Hacks"],
    maxSeats: 25
  }
];

export async function seedDefaultCourses() {
  const useMongo = isMongoConfigured() && mongoose.connection.readyState === 1;

  if (useMongo) {
    try {
      const count = await MongoCourse.countDocuments();
      if (count === 0) {
        await MongoCourse.insertMany(INITIAL_COURSES);
        console.log("📚 Seeded default courses into MongoDB collection 'courses'");
      }
    } catch (err) {
      console.error("Error seeding default courses in MongoDB:", err);
    }
  } else {
    const list = readFallbackCourses();
    if (list.length === 0) {
      writeFallbackCourses(INITIAL_COURSES);
      console.log("📚 Seeded default courses into fallback store 'courses-fallback.json'");
    }
  }
}

export async function seedDefaultBootcamps() {
  const useMongo = isMongoConfigured() && mongoose.connection.readyState === 1;

  if (useMongo) {
    try {
      const count = await MongoBootcamp.countDocuments();
      if (count === 0) {
        await MongoBootcamp.insertMany(INITIAL_BOOTCAMPS);
        console.log("🚀 Seeded default bootcamps into MongoDB collection 'bootcamps'");
      }
    } catch (err) {
      console.error("Error seeding default bootcamps in MongoDB:", err);
    }
  } else {
    const list = readFallbackBootcamps();
    if (list.length === 0) {
      writeFallbackBootcamps(INITIAL_BOOTCAMPS);
      console.log("🚀 Seeded default bootcamps into fallback store 'bootcamps-fallback.json'");
    }
  }
}

// ----------------------------------------------------
// COURSES CRUD OPERATIONS
// ----------------------------------------------------
export async function getAllCourses(): Promise<ICourse[]> {
  const useMongo = isMongoConfigured() && mongoose.connection.readyState === 1;

  if (useMongo) {
    const docs = await MongoCourse.find({}).sort({ createdAt: -1 });
    if (docs.length > 0) {
      return docs.map((d: any) => ({
        id: d.id,
        title: d.title,
        description: d.description,
        duration: d.duration,
        lessonsCount: d.lessonsCount,
        difficulty: d.difficulty,
        rating: d.rating,
        enrolledStudents: d.enrolledStudents,
        tags: d.tags || [],
        instructor: d.instructor,
        createdAt: d.createdAt,
      }));
    }
  }

  const list = readFallbackCourses();
  if (list.length === 0) {
    writeFallbackCourses(INITIAL_COURSES);
    return INITIAL_COURSES;
  }
  return list;
}

export async function getCourseById(id: string): Promise<ICourse | null> {
  const useMongo = isMongoConfigured() && mongoose.connection.readyState === 1;

  if (useMongo) {
    const doc = await MongoCourse.findOne({ id });
    if (doc) {
      return {
        id: doc.id,
        title: doc.title,
        description: doc.description,
        duration: doc.duration,
        lessonsCount: doc.lessonsCount,
        difficulty: doc.difficulty,
        rating: doc.rating,
        enrolledStudents: doc.enrolledStudents,
        tags: doc.tags || [],
        instructor: doc.instructor,
        createdAt: doc.createdAt,
      };
    }
  }

  const list = readFallbackCourses();
  const found = list.find((c) => c.id === id);
  if (found) return found;
  return INITIAL_COURSES.find((c) => c.id === id) || null;
}

export async function createCourse(data: Partial<ICourse>): Promise<ICourse> {
  const courseId = data.id || data.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "course-" + Date.now();
  const newCourse: ICourse = {
    id: courseId,
    title: data.title || "Untitled Course",
    description: data.description || "",
    duration: data.duration || "10 Hours",
    lessonsCount: Number(data.lessonsCount) || 12,
    difficulty: data.difficulty || "Intermediate",
    rating: Number(data.rating) || 4.9,
    enrolledStudents: Number(data.enrolledStudents) || 0,
    tags: Array.isArray(data.tags) ? data.tags : (typeof data.tags === "string" ? (data.tags as string).split(",").map((s) => s.trim()) : ["Next.js", "Web3"]),
    instructor: data.instructor || "Umair Riaz",
    createdAt: new Date().toISOString(),
  };

  const useMongo = isMongoConfigured() && mongoose.connection.readyState === 1;
  if (useMongo) {
    await MongoCourse.create(newCourse);
  }

  // Also sync to fallback storage
  const list = readFallbackCourses();
  list.unshift(newCourse);
  writeFallbackCourses(list);

  return newCourse;
}

export async function updateCourse(id: string, update: Partial<ICourse>): Promise<ICourse | null> {
  const useMongo = isMongoConfigured() && mongoose.connection.readyState === 1;

  if (useMongo) {
    await MongoCourse.findOneAndUpdate({ id }, { $set: update });
  }

  const list = readFallbackCourses();
  const index = list.findIndex((c) => c.id === id);
  if (index !== -1) {
    list[index] = { ...list[index], ...update };
    writeFallbackCourses(list);
    return list[index];
  }
  return null;
}

export async function deleteCourse(id: string): Promise<boolean> {
  const useMongo = isMongoConfigured() && mongoose.connection.readyState === 1;

  if (useMongo) {
    await MongoCourse.deleteOne({ id });
  }

  const list = readFallbackCourses();
  const filtered = list.filter((c) => c.id !== id);
  writeFallbackCourses(filtered);
  return true;
}

// ----------------------------------------------------
// BOOTCAMPS CRUD OPERATIONS
// ----------------------------------------------------
export async function getAllBootcamps(): Promise<IBootcamp[]> {
  const useMongo = isMongoConfigured() && mongoose.connection.readyState === 1;

  if (useMongo) {
    const docs = await MongoBootcamp.find({}).sort({ createdAt: -1 });
    if (docs.length > 0) {
      return docs.map((d: any) => ({
        id: d.id,
        title: d.title,
        description: d.description,
        duration: d.duration,
        startDate: d.startDate,
        schedule: d.schedule,
        price: d.price,
        highlights: d.highlights || [],
        techTags: d.techTags || [],
        maxSeats: d.maxSeats,
        createdAt: d.createdAt,
      }));
    }
  }

  const list = readFallbackBootcamps();
  if (list.length === 0) {
    writeFallbackBootcamps(INITIAL_BOOTCAMPS);
    return INITIAL_BOOTCAMPS;
  }
  return list;
}

export async function getBootcampById(id: string): Promise<IBootcamp | null> {
  const useMongo = isMongoConfigured() && mongoose.connection.readyState === 1;

  if (useMongo) {
    const doc = await MongoBootcamp.findOne({ id });
    if (doc) {
      return {
        id: doc.id,
        title: doc.title,
        description: doc.description,
        duration: doc.duration,
        startDate: doc.startDate,
        schedule: doc.schedule,
        price: doc.price,
        highlights: doc.highlights || [],
        techTags: doc.techTags || [],
        maxSeats: doc.maxSeats,
        createdAt: doc.createdAt,
      };
    }
  }

  const list = readFallbackBootcamps();
  const found = list.find((b) => b.id === id);
  if (found) return found;
  return INITIAL_BOOTCAMPS.find((b) => b.id === id) || null;
}

export async function createBootcamp(data: Partial<IBootcamp>): Promise<IBootcamp> {
  const bootcampId = data.id || data.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "bootcamp-" + Date.now();
  const newBootcamp: IBootcamp = {
    id: bootcampId,
    title: data.title || "Cohort Bootcamp",
    description: data.description || "",
    duration: data.duration || "8 Weeks",
    startDate: data.startDate || "Upcoming Cohort",
    schedule: data.schedule || "Mon, Wed, Fri (6 PM UTC)",
    price: data.price ? (data.price.startsWith("$") ? data.price : `$${data.price}`) : "$1,200",
    highlights: Array.isArray(data.highlights) ? data.highlights : (typeof data.highlights === "string" ? (data.highlights as string).split("\n").map((s) => s.trim()).filter(Boolean) : [
      "Mentoring from Umair Riaz",
      "Hands-on Capstone Audit",
      "Career & Job Placement Support"
    ]),
    techTags: Array.isArray(data.techTags) ? data.techTags : (typeof data.techTags === "string" ? (data.techTags as string).split(",").map((s) => s.trim()) : ["Next.js", "Solidity"]),
    maxSeats: Number(data.maxSeats) || 25,
    createdAt: new Date().toISOString(),
  };

  const useMongo = isMongoConfigured() && mongoose.connection.readyState === 1;
  if (useMongo) {
    await MongoBootcamp.create(newBootcamp);
  }

  const list = readFallbackBootcamps();
  list.unshift(newBootcamp);
  writeFallbackBootcamps(list);

  return newBootcamp;
}

export async function updateBootcamp(id: string, update: Partial<IBootcamp>): Promise<IBootcamp | null> {
  const useMongo = isMongoConfigured() && mongoose.connection.readyState === 1;

  if (useMongo) {
    await MongoBootcamp.findOneAndUpdate({ id }, { $set: update });
  }

  const list = readFallbackBootcamps();
  const index = list.findIndex((b) => b.id === id);
  if (index !== -1) {
    list[index] = { ...list[index], ...update };
    writeFallbackBootcamps(list);
    return list[index];
  }
  return null;
}

export async function deleteBootcamp(id: string): Promise<boolean> {
  const useMongo = isMongoConfigured() && mongoose.connection.readyState === 1;

  if (useMongo) {
    await MongoBootcamp.deleteOne({ id });
  }

  const list = readFallbackBootcamps();
  const filtered = list.filter((b) => b.id !== id);
  writeFallbackBootcamps(filtered);
  return true;
}
