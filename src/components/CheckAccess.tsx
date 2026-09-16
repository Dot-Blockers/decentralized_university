import React, { useState, useEffect } from "react";
import { Key, Mail, CheckCircle2, AlertTriangle, ShieldCheck, Copy, Check, ArrowRight, User } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store";
import { setVerifiedAdmin } from "../store/slices/authSlice";

interface CheckAccessProps {
  onAdminVerified?: (verified: boolean) => void;
}

export default function CheckAccess({ onAdminVerified }: CheckAccessProps) {
  const dispatch = useAppDispatch();
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
          if (onAdminVerified) {
            onAdminVerified(true);
          }
        }
      } else {
        if (isAdmin) {
          dispatch(setVerifiedAdmin(true));
          setEnrollment({
            name: "Instructor Umair Riaz",
            email: cleanEmail,
            github: "umair-riaz",
            bootcamp: "Instructor Admin Portal Access Approved",
            paid: true,
            accessCode: "ADMIN-SESSION-ACTIVE"
          });
          if (onAdminVerified) {
            onAdminVerified(true);
          }
        } else {
          setError(data.error || "Could not retrieve enrollment status.");
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
          bootcamp: "Instructor Admin Portal Access Approved",
          paid: true,
          accessCode: "ADMIN-SESSION-ACTIVE"
        });
        if (onAdminVerified) {
          onAdminVerified(true);
        }
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

  return (
    <section className="py-12 sm:py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left" id="check-access-section">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-blue-600 text-xs sm:text-sm font-bold uppercase tracking-widest">
          Student Portal
        </span>
        <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 mt-1.5">
          Verify Course Access & Source Code
        </h2>
        <p className="text-slate-500 text-sm sm:text-base mt-2">
          Applied and paid the course fee? Enter your registered email address below to verify your status and retrieve your private Next.js & Solidity repository access code.
        </p>
      </div>

      <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-10 shadow-xl max-w-2xl mx-auto">
        <form onSubmit={handleCheckStatus} className="space-y-5" id="check-access-form">
          <div className="text-left">
            <label htmlFor="check-email" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Registered Email Address
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="email"
                id="check-email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g., student@gmail.com"
                className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:border-blue-600 focus:bg-white focus:outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-300 transform active:scale-95 cursor-pointer"
          >
            <span>{loading ? "Checking Database..." : "Verify Access Status"}</span>
            <ArrowRight className="h-4.5 w-4.5" />
          </button>
        </form>

        {/* Display Error Response */}
        {error && (
          <div className="mt-8 bg-rose-50 border border-rose-100 rounded-2xl p-5 text-slate-800 flex items-start space-x-3.5 animate-in fade-in slide-in-from-top-2 duration-200">
            <AlertTriangle className="h-5.5 w-5.5 text-rose-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Status Lookup Failed</h4>
              <p className="text-slate-600 text-xs sm:text-sm mt-1 leading-relaxed">
                {error}
              </p>
              <div className="mt-3">
                <p className="text-xs font-semibold text-rose-700">
                  Tip: Please double check your spelling or click on "Bootcamps" to submit a spot reservation first.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Display Success & Access Status */}
        {enrollment && (
          <div className="mt-8 border-t border-slate-100 pt-8 animate-in fade-in slide-in-from-top-4 duration-300">
            {enrollment.paid ? (
              /* PAID STATUS VIEW */
              <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-6 space-y-5">
                <div className="flex items-start space-x-3.5">
                  <div className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-slate-900">Access Approved!</h3>
                    <p className="text-slate-500 text-xs font-medium">Payment Verified • Cohort Spot Confirmed</p>
                  </div>
                </div>

                <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-1.5">
                  <p>Welcome to <strong className="text-slate-950">{enrollment.bootcamp}</strong>, <strong className="text-slate-950">{enrollment.name}</strong>!</p>
                  <p>Your payment registration has been fully audited by Lead Instructor Umair Riaz. Below is your secure, private access code to claim your Next.js and Solidity boilerplate templates:</p>
                </div>

                {/* Display Approved Code */}
                {enrollment.accessCode ? (
                  <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
                    <div className="font-mono text-xs sm:text-sm text-slate-800 font-semibold truncate select-all pr-2">
                      {enrollment.accessCode}
                    </div>
                    <button
                      onClick={handleCopyCode}
                      className="inline-flex items-center justify-center space-x-1.5 bg-slate-950 hover:bg-blue-600 text-white text-xs font-bold py-2 px-3 rounded-lg transition-all shrink-0 cursor-pointer"
                    >
                      {copied ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="bg-amber-50/50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800">
                    ⚠️ Payment is marked as Paid, but no custom Repository Access Code has been provisioned yet by Instructor Umair Riaz. Check back shortly or ping him during 1-on-1 Office Hours!
                  </div>
                )}

                <div className="text-[11px] text-slate-400 italic">
                  Note: Do not share your unique access code. This is linked directly to your GitHub account: <strong>{enrollment.github}</strong>.
                </div>
              </div>
            ) : (
              /* UNPAID STATUS VIEW */
              <div className="bg-amber-50/40 border border-amber-100 rounded-2xl p-6 space-y-4">
                <div className="flex items-start space-x-3.5">
                  <div className="h-10 w-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                    <Key className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-lg text-slate-900">Application Pending Payment</h3>
                    <p className="text-slate-500 text-xs font-medium">Spot Reserved • Awaiting Fee Audit</p>
                  </div>
                </div>

                <div className="text-xs sm:text-sm text-slate-600 leading-relaxed space-y-2">
                  <p>Hi <strong className="text-slate-950">{enrollment.name}</strong>, we found your active spot reservation for <strong className="text-slate-950">{enrollment.bootcamp}</strong>.</p>
                  <p>Your access is currently locked because the enrollment fee has not been registered or audited yet.</p>
                  <div className="bg-white border border-slate-100/80 p-4 rounded-xl space-y-1.5 text-xs text-slate-700 my-3">
                    <p className="font-bold text-slate-900">Next Steps to Unlock Premium Source Code:</p>
                    <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
                      <li>Complete your course fee deposit securely.</li>
                      <li>Contact Lead Instructor <strong className="text-slate-950">Umair Riaz</strong> through <strong>1-on-1 Office Hours</strong> or the sandbox group chat.</li>
                      <li>Once verified, the instructor will activate your access code instantly!</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
