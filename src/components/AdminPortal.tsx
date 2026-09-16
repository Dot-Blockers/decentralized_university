import React, { useState, useEffect } from "react";
import {
  Shield,
  Key,
  Users,
  CheckCircle,
  Clock,
  RefreshCw,
  Search,
  Check,
  X,
  CreditCard,
  Settings,
  Sparkles,
  AlertCircle,
  UserCheck,
  Database,
  Lock,
  Calendar,
  BookOpen,
  GraduationCap,
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "../store";
import { setVerifiedAdmin } from "../store/slices/authSlice";
import AdminEnrollmentCharts from "./AdminEnrollmentCharts";
import AdminCourseManager from "./AdminCourseManager";
import AdminBootcampManager from "./AdminBootcampManager";

export default function AdminPortal() {
  const dispatch = useAppDispatch();
  const { user, token } = useAppSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState<"enrollments" | "users" | "courses" | "bootcamps">("enrollments");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isMongo, setIsMongo] = useState(false);

  // Enrollment data state
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [registeredUsers, setRegisteredUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    paid: 0,
    unpaid: 0,
    registeredCount: 0,
  });

  // Access Code inline states
  const [inlineCodes, setInlineCodes] = useState<{ [id: string]: string }>({});

  // Live MongoDB Status
  const [dbStatus, setDbStatus] = useState<{
    connected: boolean;
    connecting?: boolean;
    cluster: string;
    user: string;
    targetUri: string;
    lastError: string | null;
    activeEngine: string;
  } | null>(null);
  const [reconnecting, setReconnecting] = useState(false);
  const [reconnectMessage, setReconnectMessage] = useState<string | null>(null);

  const isReduxAdmin =
    user?.role === "admin" ||
    user?.email === "umair@dotblockers.com" ||
    user?.email === "admin@decuniversity.com";

  const fetchDbStatus = async () => {
    try {
      const res = await fetch("/api/db/status");
      if (res.ok) {
        const data = await res.json();
        setDbStatus(data);
        setIsMongo(data.connected);
      }
    } catch (e) {
      console.error("Failed to fetch DB status:", e);
    }
  };

  const handleReconnectDb = async () => {
    setReconnecting(true);
    setReconnectMessage(null);
    try {
      const res = await fetch("/api/db/reconnect", { method: "POST" });
      const data = await res.json();
      setDbStatus(data);
      setIsMongo(data.connected);
      if (data.connected) {
        setReconnectMessage("✅ Successfully connected to MongoDB Atlas! Auth records synchronized.");
        fetchData(password, token);
      } else {
        setReconnectMessage(
          "⚠️ MongoDB Atlas is not accepting connections yet. In Atlas, go to Network Access -> Add IP Address -> Allow Access from Anywhere (0.0.0.0/0), then click Reconnect."
        );
      }
    } catch (err: any) {
      setReconnectMessage(`❌ Reconnect error: ${err.message}`);
    } finally {
      setReconnecting(false);
    }
  };

  useEffect(() => {
    fetchDbStatus();
    // If authenticated via Redux with admin role and token
    if (isReduxAdmin && token) {
      setIsLoggedIn(true);
      dispatch(setVerifiedAdmin(true));
      fetchData(password, token);
      return;
    }

    // Check if password already saved in session storage
    const savedPassword = sessionStorage.getItem("adminPassword");
    if (savedPassword) {
      handleAutoLogin(savedPassword);
    }
  }, [isReduxAdmin, token]);

  const getAuthHeaders = (passOverride?: string, tokenOverride?: string) => {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    const curToken = tokenOverride || token;
    const curPass = passOverride || password || sessionStorage.getItem("adminPassword");

    if (curToken) {
      headers["Authorization"] = `Bearer ${curToken}`;
    }
    if (curPass) {
      headers["x-admin-password"] = curPass;
    }
    return headers;
  };

  const handleAutoLogin = async (savedPass: string) => {
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: savedPass }),
      });

      if (res.ok) {
        const data = await res.json();
        setPassword(savedPass);
        setIsLoggedIn(true);
        setIsMongo(data.isMongo);
        dispatch(setVerifiedAdmin(true));
        fetchData(savedPass, token);
      } else {
        sessionStorage.removeItem("adminPassword");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (res.ok) {
        setIsLoggedIn(true);
        setIsMongo(data.isMongo);
        sessionStorage.setItem("adminPassword", password);
        dispatch(setVerifiedAdmin(true));
        fetchData(password, token);
      } else {
        setError(data.error || "Authentication failed. Incorrect password.");
      }
    } catch (err) {
      console.error(err);
      setError("Network connection error.");
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async (adminPass?: string, adminToken?: string) => {
    setLoading(true);
    const headers = getAuthHeaders(adminPass, adminToken);

    try {
      // 1. Fetch enrollments
      const enrollRes = await fetch("/api/admin/enrollments", { headers });
      if (enrollRes.ok) {
        const data = await enrollRes.json();
        setEnrollments(data.enrollments || []);
        calculateStats(data.enrollments || [], registeredUsers);

        const codes: { [id: string]: string } = {};
        data.enrollments.forEach((enroll: any) => {
          codes[enroll.id] = enroll.accessCode || "";
        });
        setInlineCodes(codes);
      }

      // 2. Fetch registered MongoDB auth users
      const usersRes = await fetch("/api/admin/users", { headers });
      if (usersRes.ok) {
        const data = await usersRes.json();
        setRegisteredUsers(data.users || []);
        calculateStats(enrollments, data.users || []);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch database records.");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (enrollList: any[], userList: any[]) => {
    const total = enrollList.length;
    const paid = enrollList.filter((x) => x.paid).length;
    const unpaid = total - paid;
    setStats({
      total,
      paid,
      unpaid,
      registeredCount: userList.length,
    });
  };

  const handleUpdateRecord = async (id: string, updatedPaid: boolean) => {
    setUpdatingId(id);
    const code = inlineCodes[id] || "";

    try {
      const headers = getAuthHeaders();
      const res = await fetch(`/api/admin/enrollments/${id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({
          paid: updatedPaid,
          accessCode: code,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        const updatedList = enrollments.map((x) => (x.id === id ? data.enrollment : x));
        setEnrollments(updatedList);
        calculateStats(updatedList, registeredUsers);
      } else {
        alert(data.error || "Update failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting changes to server.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleAutoGenerateCode = (id: string) => {
    const randomHex = Math.floor(100000 + Math.random() * 900000).toString();
    const generated = `DU-ACC-NEXT15-${randomHex}`;
    setInlineCodes((prev) => ({ ...prev, [id]: generated }));
  };

  const handleLogOut = () => {
    sessionStorage.removeItem("adminPassword");
    setIsLoggedIn(false);
    setPassword("");
    setEnrollments([]);
    setRegisteredUsers([]);
  };

  // Filter enrollments
  const filteredEnrollments = enrollments.filter((enroll) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      enroll.name.toLowerCase().includes(q) ||
      enroll.email.toLowerCase().includes(q) ||
      enroll.github.toLowerCase().includes(q) ||
      enroll.bootcamp.toLowerCase().includes(q)
    );
  });

  // Filter registered users
  const filteredUsers = registeredUsers.filter((u) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.github && u.github.toLowerCase().includes(q)) ||
      u.role.toLowerCase().includes(q)
    );
  });

  if (!isLoggedIn) {
    return (
      <section className="py-16 max-w-md mx-auto px-4" id="admin-login-panel">
        <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-xl text-center space-y-6">
          <div className="h-14 w-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-md">
            <Shield className="h-7 w-7" />
          </div>

          <div className="space-y-1.5">
            <h2 className="font-display font-extrabold text-2xl text-slate-900">Faculty Admin Portal</h2>
            <p className="text-slate-500 text-xs sm:text-sm">
              Lead Instructor Umair Riaz Authentication. Provide your secure credentials to manage payments and students.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4" id="admin-login-form">
            <div className="text-left">
              <label htmlFor="admin-pass" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Admin Security Password
              </label>
              <input
                type="password"
                id="admin-pass"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3.5 text-sm focus:border-blue-600 focus:bg-white focus:outline-none transition-all"
              />
            </div>

            {error && (
              <p className="text-xs font-bold text-rose-600 bg-rose-50 border border-rose-100 p-3 rounded-lg text-left flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center space-x-2 bg-slate-950 hover:bg-blue-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-all cursor-pointer"
            >
              <span>{loading ? "Authenticating..." : "Login to Workspace"}</span>
            </button>
          </form>

          <p className="text-[10px] text-slate-400">
            Note: Default testing password is <strong className="text-slate-600 font-mono">admin123</strong>, or sign in as an admin with the top "Sign In" button.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left" id="admin-dashboard">
      
      {/* Dashboard Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-slate-100 pb-6">
        <div>
          <div className="flex items-center space-x-2.5">
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
              Live Faculty Access
            </span>
            <span className="text-slate-400 font-mono text-xs">•</span>
            <span className="text-slate-500 text-xs font-semibold flex items-center">
              <Database className="h-3.5 w-3.5 text-emerald-500 mr-1" />
              Connected DB: {isMongo ? "MongoDB (Real Atlas)" : "MongoDB Fallback Layer"}
            </span>
          </div>
          <h2 className="text-3xl font-display font-extrabold text-slate-900 mt-2">
            Instructor Command Center
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Review applicant spot reservations, authorize course fees, manage code releases, and audit MongoDB auth users.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={() => {
              fetchData(password, token);
              fetchDbStatus();
            }}
            disabled={loading}
            className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all cursor-pointer"
            title="Refresh database records"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={handleLogOut}
            className="bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 border border-slate-200 hover:border-rose-100 font-bold text-xs px-4 py-2.5 rounded-xl transition-all cursor-pointer"
          >
            Instructor Logout
          </button>
        </div>
      </div>

      {/* Live MongoDB Atlas Cluster Status Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 mb-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start sm:items-center space-x-3">
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
              dbStatus?.connected ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
            }`}>
              <Database className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm text-slate-900">
                  MongoDB Atlas: <span className="font-mono text-xs text-blue-600">{dbStatus?.cluster || "cluster0.dxinhca.mongodb.net"}</span>
                </span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  dbStatus?.connected
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-amber-100 text-amber-800"
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full mr-1 ${dbStatus?.connected ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
                  {dbStatus?.connected ? "Atlas Connected & Synced" : "Pending Atlas Whitelist (Fallback Active)"}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Target User: <span className="font-mono text-slate-700 font-semibold">{dbStatus?.user || "decentralizeduniversity_db_user"}</span> • 
                URI: <span className="font-mono text-slate-500">{dbStatus?.targetUri || "mongodb+srv://decentralizeduniversity_db_user:****@cluster0.dxinhca.mongodb.net/dec_university?retryWrites=true&w=majority"}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 self-start sm:self-auto">
            <button
              onClick={handleReconnectDb}
              disabled={reconnecting}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-50 shadow-xs"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${reconnecting ? "animate-spin" : ""}`} />
              <span>{reconnecting ? "Testing Atlas..." : "Test Atlas Connection"}</span>
            </button>
          </div>
        </div>

        {/* Actionable note if Atlas is pending IP whitelist */}
        {!dbStatus?.connected && (
          <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600 flex items-start space-x-2 bg-amber-50/50 p-3 rounded-xl border border-amber-200/60">
            <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-800">
                To authorize connections from this cloud container to your MongoDB Atlas cluster:
              </p>
              <p className="mt-0.5 text-slate-600">
                1. Open <a href="https://cloud.mongodb.com" target="_blank" rel="noreferrer" className="text-blue-600 underline font-semibold">MongoDB Atlas</a> &rarr; <strong>Network Access</strong> (in left menu).<br />
                2. Click <strong>Add IP Address</strong> &rarr; Select <strong>Allow Access from Anywhere (0.0.0.0/0)</strong> &rarr; Click <strong>Confirm</strong>.<br />
                3. Click <strong>Test Atlas Connection</strong> above, and all auth user profiles and spots will immediately sync to MongoDB!
              </p>
            </div>
          </div>
        )}

        {reconnectMessage && (
          <div className="mt-3 text-xs font-semibold text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            {reconnectMessage}
          </div>
        )}
      </div>

      {/* Metrics widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8" id="admin-metrics">
        {/* Total Spot Reservations */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Spot Reservations</span>
            <span className="text-2xl font-extrabold text-slate-900 block mt-1">{stats.total}</span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="h-5 w-5" />
          </div>
        </div>

        {/* Paid / Authorized Access */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Paid & Approved</span>
            <span className="text-2xl font-extrabold text-slate-900 block mt-1">{stats.paid}</span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle className="h-5 w-5" />
          </div>
        </div>

        {/* Pending Auditing */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Pending Payment</span>
            <span className="text-2xl font-extrabold text-slate-900 block mt-1">{stats.unpaid}</span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="h-5 w-5" />
          </div>
        </div>

        {/* MongoDB Registered Accounts */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">MongoDB Accounts</span>
            <span className="text-2xl font-extrabold text-slate-900 block mt-1">{stats.registeredCount}</span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <UserCheck className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Recharts Analytics: Visualizing spot reservations and enrollment trends */}
      <AdminEnrollmentCharts
        enrollments={enrollments}
        onSelectBootcampFilter={(bootcampName) => {
          setActiveTab("enrollments");
          setSearchQuery(bootcampName);
        }}
      />

      {/* Tab Switcher: Spot Reservations vs MongoDB Accounts vs Courses vs Bootcamps */}
      <div className="flex flex-wrap gap-2 mb-4 border-b border-slate-100 pb-3">
        <button
          onClick={() => setActiveTab("enrollments")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === "enrollments"
              ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <CreditCard className="h-4 w-4" />
          <span>Spot Reservations & Code Access ({enrollments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("users")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === "users"
              ? "bg-purple-600 text-white shadow-md shadow-purple-500/20"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <Database className="h-4 w-4" />
          <span>MongoDB Auth Users ({registeredUsers.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("courses")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === "courses"
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <BookOpen className="h-4 w-4" />
          <span>Course Syllabi</span>
        </button>

        <button
          onClick={() => setActiveTab("bootcamps")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === "bootcamps"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
              : "text-slate-600 hover:bg-slate-100"
          }`}
        >
          <GraduationCap className="h-4 w-4" />
          <span>Immersive Bootcamps</span>
        </button>
      </div>

      {activeTab === "courses" ? (
        <AdminCourseManager
          getAuthHeaders={getAuthHeaders}
          onCoursesUpdated={() => fetchData(password, token)}
        />
      ) : activeTab === "bootcamps" ? (
        <AdminBootcampManager
          getAuthHeaders={getAuthHeaders}
          onBootcampsUpdated={() => fetchData(password, token)}
        />
      ) : (
        <div className="bg-white border border-slate-100 rounded-3xl shadow-md overflow-hidden">
        
        {/* Table Search bar */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
          <div className="relative rounded-xl max-w-sm w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4.5 w-4.5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder={activeTab === "enrollments" ? "Search reservations..." : "Search registered accounts..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:border-blue-600 focus:outline-none"
            />
          </div>
          <div className="text-xs font-semibold text-slate-400">
            {activeTab === "enrollments"
              ? `Showing ${filteredEnrollments.length} matching reservations`
              : `Showing ${filteredUsers.length} matching registered users`}
          </div>
        </div>

        {/* View 1: Enrollments Table */}
        {activeTab === "enrollments" && (
          filteredEnrollments.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <Users className="h-12 w-12 text-slate-200 mx-auto mb-3" />
              <p className="font-bold text-slate-700">No applicants found</p>
              <p className="text-xs text-slate-400 mt-1">Make sure students apply through the Cohort Reserve Spot button!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100 text-sm">
                <thead className="bg-slate-50/55 font-display text-slate-500 font-semibold text-xs text-left">
                  <tr>
                    <th className="px-6 py-4">Student & GitHub</th>
                    <th className="px-6 py-4">Course/Bootcamp</th>
                    <th className="px-6 py-4">Payment Status</th>
                    <th className="px-6 py-4">Source Access Code</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-left bg-white font-medium text-slate-700">
                  {filteredEnrollments.map((student) => {
                    const isUpdating = updatingId === student.id;
                    const currentCodeValue = inlineCodes[student.id] || "";

                    return (
                      <tr key={student.id} className="hover:bg-slate-50/40 transition-colors">
                        {/* Name / Email / GitHub */}
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-900">{student.name}</div>
                          <div className="text-xs text-slate-400 font-normal">{student.email}</div>
                          <div className="inline-flex items-center space-x-1 font-mono text-[11px] text-blue-600 bg-blue-50/60 px-2 py-0.5 rounded-md mt-1.5">
                            <span>github.com/{student.github}</span>
                          </div>
                        </td>

                        {/* Applied Bootcamp */}
                        <td className="px-6 py-4">
                          <div className="font-semibold text-xs sm:text-sm text-slate-800 line-clamp-2 max-w-xs">{student.bootcamp}</div>
                          <div className="text-[10px] font-mono text-slate-400 mt-1">Applied: {new Date(student.createdAt).toLocaleDateString()}</div>
                        </td>

                        {/* Payment Toggle Status */}
                        <td className="px-6 py-4">
                          {student.paid ? (
                            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                              <CheckCircle className="h-3.5 w-3.5 fill-emerald-50" />
                              <span>Approved / Paid</span>
                            </div>
                          ) : (
                            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full animate-pulse">
                              <Clock className="h-3.5 w-3.5" />
                              <span>Unpaid / Pending</span>
                            </div>
                          )}
                        </td>

                        {/* Access Code Input */}
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-1.5">
                            <input
                              type="text"
                              value={currentCodeValue}
                              onChange={(e) =>
                                setInlineCodes((prev) => ({ ...prev, [student.id]: e.target.value }))
                              }
                              placeholder="DU-NEXT15-XXXXX"
                              className="bg-slate-50 border border-slate-200 text-xs rounded-lg px-2.5 py-1.5 font-mono max-w-[180px] w-full focus:bg-white"
                            />
                            <button
                              onClick={() => handleAutoGenerateCode(student.id)}
                              className="bg-slate-100 hover:bg-slate-200 border border-slate-200 p-1.5 rounded-lg text-slate-600 transition-all text-xs"
                              title="Auto-Generate Access Code"
                            >
                              <Sparkles className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>

                        {/* Inline Actions */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex flex-col sm:flex-row gap-2 justify-end">
                            {/* Toggle Payment Button */}
                            <button
                              onClick={() => handleUpdateRecord(student.id, !student.paid)}
                              disabled={isUpdating}
                              className={`text-xs font-bold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                                student.paid
                                  ? "bg-rose-50 border-rose-100 text-rose-600 hover:bg-rose-100"
                                  : "bg-emerald-50 border-emerald-100 text-emerald-600 hover:bg-emerald-100"
                              }`}
                            >
                              {student.paid ? "Mark Unpaid" : "Mark Paid"}
                            </button>

                            {/* Save Changes */}
                            <button
                              onClick={() => handleUpdateRecord(student.id, student.paid)}
                              disabled={isUpdating}
                              className="bg-slate-900 hover:bg-blue-600 disabled:bg-slate-100 text-white disabled:text-slate-400 text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                            >
                              {isUpdating ? "Saving..." : "Save Access"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )
        )}

        {/* View 2: MongoDB Registered Users */}
        {activeTab === "users" && (
          filteredUsers.length === 0 ? (
            <div className="py-16 text-center text-slate-400">
              <UserCheck className="h-12 w-12 text-slate-200 mx-auto mb-3" />
              <p className="font-bold text-slate-700">No users found</p>
              <p className="text-xs text-slate-400 mt-1">Users register using the Redux Toolkit modal.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100 text-sm">
                <thead className="bg-slate-50/55 font-display text-slate-500 font-semibold text-xs text-left">
                  <tr>
                    <th className="px-6 py-4">Account Holder</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">GitHub Profile</th>
                    <th className="px-6 py-4">Created Date</th>
                    <th className="px-6 py-4">Storage Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-left bg-white font-medium text-slate-700">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{u.name}</div>
                        <div className="text-xs text-slate-400">{u.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        {u.role === "admin" ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-extrabold bg-purple-100 text-purple-700 uppercase">
                            Admin / Instructor
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-extrabold bg-blue-100 text-blue-700 uppercase">
                            Student
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {u.github ? (
                          <span className="font-mono text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                            @{u.github}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400">None</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs text-slate-500">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "Recent"}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center space-x-1 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                          <Database className="h-3 w-3" />
                          <span>MongoDB Synced</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}

      </div>
      )}

    </section>
  );
}
