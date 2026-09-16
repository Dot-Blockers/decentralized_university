import React, { useState, useEffect } from "react";
import Navigation from "./components/Navigation";
import Hero from "./components/Hero";
import CoursesList from "./components/CoursesList";
import BootcampsList from "./components/BootcampsList";
import InstructorProfile from "./components/InstructorProfile";
import VideoCenter from "./components/VideoCenter";
import BlogsList from "./components/BlogsList";
import Footer from "./components/Footer";
import CheckAccess from "./components/CheckAccess";
import AdminPortal from "./components/AdminPortal";
import AuthModal from "./components/AuthModal";

// SEO & Routing
import { useRouter } from "./router";
import { SEOHead } from "./components/SEOHead";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AccessStatusPage from "./pages/AccessStatusPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import BootcampDetailPage from "./pages/BootcampDetailPage";
import BlogDetailPage from "./pages/BlogDetailPage";

import { useAppDispatch, useAppSelector } from "./store";
import { checkAuthSession, setVerifiedAdmin } from "./store/slices/authSlice";

import { coursesData, bootcampsData, blogsData, videoLessonsData } from "./data";
import { Course, Bootcamp } from "./types";
import { BookOpen, User, Sparkles, Mail, CheckCircle2, AlertCircle } from "lucide-react";

export default function App() {
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { path, params, navigate } = useRouter();

  const [activeTab, setActiveTab] = useState<string>("courses");
  const [courses, setCourses] = useState<Course[]>(coursesData);
  const [bootcamps, setBootcamps] = useState<Bootcamp[]>(bootcampsData);
  const [showAdminTab, setShowAdminTab] = useState<boolean>(() => {
    return sessionStorage.getItem("showAdminTab") === "true";
  });

  // Verify auth session from stored token in MongoDB on load
  useEffect(() => {
    dispatch(checkAuthSession());
  }, [dispatch]);

  // Fetch live courses and bootcamps from API
  useEffect(() => {
    fetch("/api/courses")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.courses && data.courses.length > 0) {
          setCourses(data.courses);
        }
      })
      .catch(() => { });

    fetch("/api/bootcamps")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.bootcamps && data.bootcamps.length > 0) {
          setBootcamps(data.bootcamps);
        }
      })
      .catch(() => { });
  }, []);

  // Sync activeTab state from URL path
  useEffect(() => {
    if (path === "/" || path === "/courses" || path.startsWith("/courses/")) {
      setActiveTab("courses");
    } else if (path === "/bootcamps" || path.startsWith("/bootcamps/")) {
      setActiveTab("bootcamps");
    } else if (path.startsWith("/video-lessons") || path.startsWith("/lessons")) {
      setActiveTab("video-lessons");
    } else if (path.startsWith("/instructor")) {
      setActiveTab("instructor");
    } else if (path === "/blogs" || path.startsWith("/blogs/")) {
      setActiveTab("blogs");
    } else if (path.startsWith("/access-status") || path.startsWith("/check-access")) {
      setActiveTab("check-access");
    } else if (path.startsWith("/admin")) {
      setActiveTab("admin-portal");
    } else if (path === "/login" || path === "/register") {
      setActiveTab("");
    }
  }, [path]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    const routeMap: Record<string, string> = {
      courses: "/courses",
      bootcamps: "/bootcamps",
      "video-lessons": "/video-lessons",
      instructor: "/instructor",
      blogs: "/blogs",
      "check-access": "/access-status",
      "admin-portal": "/admin",
    };
    if (routeMap[tab]) {
      navigate(routeMap[tab]);
    }
  };

  const isAdmin =
    user?.role === "admin" ||
    user?.email === "umair@dotblockers.com" ||
    user?.email === "admin@decuniversity.com" ||
    showAdminTab;

  const handleAdminVerified = (verified: boolean) => {
    setShowAdminTab(verified);
    if (verified) {
      sessionStorage.setItem("showAdminTab", "true");
      dispatch(setVerifiedAdmin(true));
    } else {
      sessionStorage.removeItem("showAdminTab");
    }
  };

  // Reservation modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [targetBootcamp, setTargetBootcamp] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentGithub, setStudentGithub] = useState("");
  const [enrollSubmitted, setEnrollSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleOpenEnrollModal = (bootcampTitle: string) => {
    setTargetBootcamp(bootcampTitle);
    setSubmitError(null);
    if (user) {
      if (!studentName) setStudentName(user.name || "");
      if (!studentEmail) setStudentEmail(user.email || "");
      if (!studentGithub && user.github) setStudentGithub(user.github);
    }
    setModalOpen(true);
  };

  const handleEnrollSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName || !studentEmail || !studentGithub) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const res = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: studentName,
          email: studentEmail.trim(),
          github: studentGithub.trim(),
          bootcamp: targetBootcamp
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setEnrollSubmitted(true);
        setTimeout(() => {
          setModalOpen(false);
          setEnrollSubmitted(false);
          setStudentName("");
          setStudentEmail("");
          setStudentGithub("");
        }, 5000);
      } else {
        setSubmitError(data.error || "Failed to reserve spot.");
      }
    } catch (err) {
      console.error(err);
      setSubmitError("Network connectivity issue. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Route-based Page Renderer
  const renderRouteContent = () => {
    // Dynamic Route: Course Detail (/courses/:id)
    if (path === "/courses") {
      return (
        <CoursesList
          courses={courses}
          onSelectCourse={handleOpenEnrollModal}
        />
      );
    }
    if (path.startsWith("/courses/") && params.id) {
      return (
        <CourseDetailPage
          courseId={params.id}
          courses={courses}
          onEnroll={(title) => handleOpenEnrollModal(title)}
        />
      );
    }
    // console.log("App Render - path:", path, "params:", params, "activeTab:", activeTab, "isAdmin:", isAdmin);
    // Dynamic Route: Bootcamp Detail (/bootcamps/:id)
    if (path.startsWith("/bootcamps/") && params.id) {
      return (
        <BootcampDetailPage
          bootcampId={params.id}
          bootcamps={bootcamps}
          onApply={handleOpenEnrollModal}
        />
      );
    }

    // Dynamic Route: Blog Article Detail (/blogs/:id)
    if (path.startsWith("/blogs/") && params.id) {
      return (
        <BlogDetailPage
          blogId={params.id}
          blogs={blogsData}
        />
      );
    }

    // Dedicated Page: Login (/login)
    if (path === "/login") {
      return <LoginPage />;
    }

    // Dedicated Page: Register (/register)
    if (path === "/register") {
      return <RegisterPage />;
    }

    // Dedicated Page: Access Status & Key Verification (/access-status or /check-access)
    if (path === "/access-status" || path === "/check-access") {
      return <AccessStatusPage />;
    }

    // Dedicated Page: Admin Portal (/admin)
    if (path === "/admin") {
      return (
        <div className="animate-in fade-in duration-300">
          <AdminPortal />
        </div>
      );
    }

    // Dedicated Page: Bootcamps (/bootcamps)
    if (path === "/bootcamps") {
      return (
        <div className="animate-in fade-in duration-300">
          <BootcampsList
            bootcamps={bootcamps}
            onApply={handleOpenEnrollModal}
          />
        </div>
      );
    }

    // Dedicated Page: Video Lessons & Interactive Lab (/video-lessons or /lessons)
    if (path === "/video-lessons" || path === "/lessons") {
      return (
        <div className="animate-in fade-in duration-300">
          <VideoCenter lessons={videoLessonsData} />
        </div>
      );
    }

    // Dedicated Page: Instructor Profile (/instructor)
    if (path === "/instructor") {
      return (
        <div className="animate-in fade-in duration-300">
          <InstructorProfile />
        </div>
      );
    }

    // Dedicated Page: Tech Deep-Dives / Blogs (/blogs)
    if (path === "/blogs") {
      return (
        <div className="animate-in fade-in duration-300">
          <BlogsList blogs={blogsData} />
        </div>
      );
    }

    // Default / Homepage (/ or /courses)
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <Hero
          onExploreCourses={() => {
            const element = document.getElementById("courses-section");
            element?.scrollIntoView({ behavior: "smooth" });
          }}
          onExploreBootcamps={() => navigate("/bootcamps")}
        />
        <CoursesList
          courses={courses}
          onSelectCourse={(courseId) => {
            navigate("/courses/" + courseId);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white" id="app-root">
      {/* Dynamic SEO Meta Tags Manager */}
      <SEOHead />

      {/* Dynamic Header & Responsive Menu */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        showAdminTab={isAdmin}
      />

      {/* Main Active Tab Port Area */}
      <main className="flex-grow">
        {renderRouteContent()}
      </main>

      {/* Footer Nav Links */}
      <Footer onNavigate={handleTabChange} />

      {/* Redux-controlled Auth Modal (MongoDB User Login & Register) */}
      <AuthModal />

      {/* Premium Active Modal: Spot Reservation Application */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true" id="enroll-modal">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">

            {/* Dark Backdrop Overlay */}
            <div
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
              aria-hidden="true"
              onClick={() => setModalOpen(false)}
            />

            {/* Trick browser into centering modal */}
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>

            {/* Modal Body Container */}
            <div className="relative inline-block align-bottom bg-white rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-slate-100 p-6 sm:p-8 animate-in zoom-in-95 duration-200">

              {enrollSubmitted ? (
                <div className="text-center py-8 space-y-4">
                  <div className="h-16 w-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-emerald-500 shadow-md">
                    <CheckCircle2 className="h-10 w-10 animate-bounce" />
                  </div>
                  <h3 className="font-display font-extrabold text-2xl text-slate-900">Application Submitted!</h3>
                  <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed">
                    Thank you, <strong className="text-slate-900">{studentName}</strong>. We have saved your spot reservation for <strong className="text-slate-900">{targetBootcamp}</strong>. Umair Riaz will review your GitHub and contact you shortly.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Header Title */}
                  <div className="flex items-start space-x-3.5">
                    <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                      <Sparkles className="h-5.5 w-5.5" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-display font-bold text-xl text-slate-900" id="modal-title">
                        Apply to {targetBootcamp}
                      </h3>
                      <p className="text-slate-500 text-xs sm:text-sm mt-0.5">
                        Please provide your GitHub and contact details to apply.
                      </p>
                    </div>
                  </div>

                  {/* Form fields */}
                  <form onSubmit={handleEnrollSubmit} className="space-y-4 text-left" id="enroll-form">
                    {/* Name input */}
                    <div>
                      <label htmlFor="student-name" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="student-name"
                        required
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        placeholder="e.g., Alex Developer"
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:border-blue-600 focus:bg-white focus:outline-none transition-all"
                      />
                    </div>

                    {/* Email input */}
                    <div>
                      <label htmlFor="student-email" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="student-email"
                        required
                        value={studentEmail}
                        onChange={(e) => setStudentEmail(e.target.value)}
                        placeholder="e.g., alex@blockchain.io"
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:border-blue-600 focus:bg-white focus:outline-none transition-all"
                      />
                    </div>

                    {/* GitHub input */}
                    <div>
                      <label htmlFor="student-github" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                        GitHub Username
                      </label>
                      <input
                        type="text"
                        id="student-github"
                        required
                        value={studentGithub}
                        onChange={(e) => setStudentGithub(e.target.value)}
                        placeholder="e.g., github_username"
                        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:border-blue-600 focus:bg-white focus:outline-none transition-all"
                      />
                    </div>

                    {submitError && (
                      <p className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-100 p-3 rounded-xl flex items-center space-x-2">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span>{submitError}</span>
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setModalOpen(false)}
                        className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-bold py-3 px-4 rounded-xl transition-all cursor-pointer text-center"
                        disabled={isSubmitting}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white text-sm font-bold py-3 px-4 rounded-xl shadow-md transition-all cursor-pointer text-center"
                      >
                        {isSubmitting ? "Submitting..." : "Submit Application"}
                      </button>
                    </div>
                  </form>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
