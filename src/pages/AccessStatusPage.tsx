import React, { useState, useEffect } from "react";
import { Key, Mail, CheckCircle2, AlertTriangle, ShieldCheck, Copy, Check, ArrowRight, BookOpen, Clock, Sparkles, Database } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store";
import { setVerifiedAdmin } from "../store/slices/authSlice";
import { useRouter, Link } from "../router";
import { es, sa } from "../assets/images";
import ChallanForm from "../components/ChallanForm";

export default function AccessStatusPage() {
  const dispatch = useAppDispatch();
  const { navigate } = useRouter();
  const { user } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enrollment, setEnrollment] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  // Auto-fill from logged in user
  useEffect(() => {
    if (user?.email && !email) {
      setEmail(user.email);
    }
  }, [user]);

  const handleCheckStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.toLowerCase().trim();
    if (!cleanEmail) return;

    setLoading(true);
    setError(null);
    setEnrollment(null);

    const isAdmin = cleanEmail === "umair@dotblockers.com" || cleanEmail === "admin@decuniversity.com";

    try {
      const res = await fetch("/api/enrollment/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail }),
      });

      const data = await res.json();
      if (res.ok) {
        setEnrollment(data.enrollment);
        if (isAdmin) {
          dispatch(setVerifiedAdmin(true));
        }
      } else {
        if (isAdmin) {
          dispatch(setVerifiedAdmin(true));
          setEnrollment({
            name: "Instructor Umair Riaz",
            email: cleanEmail,
            github: "umair-riaz",
            bootcamp: "Lead Instructor All-Access Pass",
            paid: true,
            accessCode: "ADMIN-ALL-ACCESS-VERIFIED",
            createdAt: new Date().toISOString(),
          });
        } else {
          setError(data.error || "No enrollment or reservation found for this email address. Please apply for a seat first.");
        }
      }
    } catch (err) {
      console.error(err);
      if (isAdmin) {
        dispatch(setVerifiedAdmin(true));
        setEnrollment({
          name: "Instructor Umair Riaz",
          email: cleanEmail,
          github: "umair-riaz",
          bootcamp: "Lead Instructor All-Access Pass",
          paid: true,
          accessCode: "ADMIN-ALL-ACCESS-VERIFIED",
          createdAt: new Date().toISOString(),
        });
      } else {
        setError("Network error. Please make sure the server is online.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (enrollment?.accessCode) {
      navigator.clipboard.writeText(enrollment.accessCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLaunchLessons = () => {
    if (enrollment?.accessCode) {
      localStorage.setItem("user_access_code", enrollment.accessCode);
    }
    navigate("/video-lessons");
  };

  return (
    <div className="py-12 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-blue-100 text-blue-700 mb-3">
          <Key className="h-6 w-6" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 tracking-tight">
          Enrollment & Access Status
        </h1>
        <p className="mt-2 text-slate-600 text-sm sm:text-base">
          Check your course seat reservation, verify payment approval status, and retrieve your lesson access code.
        </p>
      </div>

      {/* Lookup Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xl shadow-slate-200/50 mb-8 text-left">
        <form onSubmit={handleCheckStatus} className="space-y-4">
          <div>
            <label htmlFor="status-email-input" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Registered Student Email Address
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  id="status-email-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. alex.rivera@example.com"
                  className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-blue-500/10 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Checking Status...</span>
                  </>
                ) : (
                  <>
                    <span>Verify Status</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>

        {/* Error notification */}
        {error && (
          <div className="mt-6 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start space-x-3 text-rose-800 text-sm">
            <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">{error}</p>
              <p className="mt-1 text-xs text-rose-600">
                Want to apply for a seat? Visit our{" "}
                <Link href="/bootcamps" className="underline font-bold">
                  Bootcamps page
                </Link>{" "}
                or explore open{" "}
                <Link href="/courses" className="underline font-bold">
                  Courses
                </Link>.
              </p>
            </div>
          </div>
        )}

        {/* Enrollment Status Result */}
        {enrollment && (
          <div className="mt-8 pt-8 border-t border-slate-100">
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/60">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Student Applicant</span>
                  <h3 className="text-xl font-display font-extrabold text-slate-900">{enrollment.name}</h3>
                  <span className="text-xs text-slate-500">{enrollment.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {enrollment.paid ? (
                    <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span>Access Approved</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                      <Clock className="h-4 w-4 text-amber-600" />
                      <span>Payment / Review Pending</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-b border-slate-200/60 text-xs">
                <div>
                  <span className="text-slate-400 font-semibold block uppercase tracking-wider text-[10px]">Applied Cohort / Course</span>
                  <span className="font-bold text-slate-800 mt-1 block">{enrollment.bootcamp}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold block uppercase tracking-wider text-[10px]">GitHub Profile</span>
                  <span className="font-mono text-slate-800 mt-1 block">{enrollment.github || "Not specified"}</span>
                </div>
              </div>

              {/* Access Code Area */}
              {enrollment.paid ? (
                <div className="mt-5">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                    Congratulation, Now you have Access
                  </span>
                  {enrollment.accessCode ? (
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <div className="flex-1 w-full bg-white border-2 border-dashed border-blue-300 rounded-xl p-3 flex items-center justify-between">
                        <span className="font-mono font-bold text-base text-blue-700 tracking-wider">
                          {enrollment.accessCode}
                        </span>
                        <button
                          type="button"
                          onClick={handleCopyCode}
                          className="inline-flex items-center space-x-1 text-xs font-bold text-slate-600 hover:text-blue-600 px-2.5 py-1 bg-slate-100 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        >
                          {copied ? (
                            <>
                              <Check className="h-3.5 w-3.5 text-emerald-600" />
                              <span className="text-emerald-600">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-3.5 w-3.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={handleLaunchLessons}
                        className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-blue-500/10 cursor-pointer"
                      >
                        <BookOpen className="h-4 w-4" />
                        <span>Start Interactive Lessons</span>
                      </button>
                    </div>
                  ) : (
                    <div className="p-4 bg-amber-50/70 border border-amber-200/70 rounded-xl text-amber-800 text-xs">
                      Your application has been received! Payment is verified. If you have questions, please reach out to <strong className="font-semibold">decentralizeduniversity@gmail.com</strong>.
                    </div>
                  )}
                </div>
              ) : (
                <div className="mt-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-b border-slate-200/60 text-xs">
                    <div>
                      <img
                        src={es}
                        alt="logo"
                        className="object-cover transition duration-700"
                        width={100} height={400}
                      />
                      <span className="font-bold text-slate-800 mt-1 block">Account: +92 346 4440030</span>
                    </div>
                    <div>
                      <img
                        src={sa}
                        alt="logo"
                        className="object-cover transition duration-700"
                        width={100} height={400}
                      />
                      <span className="font-bold text-slate-800 mt-1 block">Account:+92 346 4440030</span>
                    </div>
                  </div>
                  <span className="text-center mt-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                    Pyment recept send to WhatsApp: +923464440030
                  </span>
                  <p className="text-center text-[11px] text-[#8C978F] mt-3 mb-3">
                    Keep the transaction ID for your records. Refunds take 3–5 business days.
                  </p>

                  {/* <ChallanForm /> */}

                  <div className="p-4 bg-amber-50/70 border border-amber-200/70 rounded-xl text-amber-800 text-xs">
                    Payment verification is pending! If you have questions, please reach out to <strong className="font-semibold">decentralizeduniversity@gmail.com</strong>.
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Quick Test Codes Guide */}
      {/* <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100 text-left">
        <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 mb-2 flex items-center space-x-1.5">
          <Sparkles className="h-4 w-4 text-blue-600" />
          <span>Demo Verification Hint</span>
        </h4>
        <p className="text-xs text-slate-600 leading-relaxed">
          You can test status verification with demo student email <code>alex.rivera@example.com</code> (pre-approved with active code) or sign in with your student account created at <Link href="/register" className="text-blue-600 font-bold underline">Registration</Link>.
        </p>
      </div> */}
    </div>
  );
}
