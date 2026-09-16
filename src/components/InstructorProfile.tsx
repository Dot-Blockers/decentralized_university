import React, { useState } from "react";
import { instructorDetails } from "../data";
import { Terminal, Calendar, Award, Briefcase, ChevronRight, CheckCircle2, User, Clock } from "lucide-react";
import { pic } from "../assets/images";

export default function InstructorProfile() {
  const [sessionDate, setSessionDate] = useState("");
  const [sessionTime, setSessionTime] = useState("");
  const [sessionTopic, setSessionTopic] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (sessionDate && sessionTime && sessionTopic) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setSessionDate("");
        setSessionTime("");
        setSessionTopic("");
      }, 5000);
    }
  };

  return (
    <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="instructor-section">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

        {/* Left Side: Instructor Details, Expertise & Timeline */}
        <div className="lg:col-span-7 space-y-8 text-left" id="instructor-info">
          <div>
            <span className="text-blue-600 text-xs sm:text-sm font-bold uppercase tracking-widest">
              Faculty Founder
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 mt-1">
              Meet Your Lead Instructor
            </h2>
          </div>

          {/* Instructor Bio Bento Box */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 sm:p-8 bg-white border border-slate-100 rounded-3xl shadow-sm">
            {/* Handsome Placeholder / Icon avatar for the instructor */}
            <div className="h-24 w-24 rounded-full flex items-center justify-center shrink-0 shadow-md">
              {/* <User className="h-12 w-12 text-blue-400" /> */}
              <img
                src={pic}
                alt="Umair"
                className="rounded-full"
              />
            </div>
            <div className="space-y-3">
              <h3 className="font-display font-bold text-2xl text-slate-900">{instructorDetails.name}</h3>
              <p className="text-blue-600 text-sm font-semibold">{instructorDetails.title}</p>
              <p className="text-slate-500 text-sm leading-relaxed">{instructorDetails.bio}</p>
            </div>
          </div>

          {/* Core Technical Competencies */}
          <div className="space-y-4">
            <h4 className="font-display font-bold text-lg text-slate-900">Technical Expertise</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" id="expertise-grid">
              {instructorDetails.expertStacks.map((stack, idx) => (
                <div
                  key={idx}
                  className="flex items-center space-x-2.5 p-3.5 bg-slate-50 border border-slate-100/50 rounded-xl"
                >
                  <Terminal className="h-4.5 w-4.5 text-blue-600 shrink-0" />
                  <span className="text-sm font-medium text-slate-700">{stack}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Experience Timeline */}
          {/* <div className="space-y-4">
            <h4 className="font-display font-bold text-lg text-slate-900">Professional Journey</h4>
            <div className="relative border-l-2 border-slate-100 pl-4 sm:pl-6 space-y-6" id="journey-timeline">
              {instructorDetails.experienceTimeline.map((item, idx) => (
                <div key={idx} className="relative text-left">
                  <div className="absolute -left-[25px] sm:-left-[33px] top-1 h-4.5 w-4.5 rounded-full border-2 border-blue-600 bg-white" />
                  <span className="font-mono text-xs text-blue-600 font-semibold">{item.year}</span>
                  <h5 className="font-sans font-bold text-slate-900 text-sm sm:text-base mt-0.5">
                    {item.role}
                  </h5>
                  <p className="text-xs sm:text-sm text-slate-500 font-medium">{item.company}</p>
                </div>
              ))}
            </div>
          </div> */}
        </div>

        {/* Right Side: Interactive Mentorship Scheduler */}
        <div className="lg:col-span-5" id="scheduler-panel">
          <div className="sticky top-24 bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-md">
            <div className="flex items-center space-x-2.5 mb-6 text-left">
              <Calendar className="h-5.5 w-5.5 text-blue-600 shrink-0" />
              <h3 className="font-display font-bold text-xl text-slate-900">
                1-on-1 Office Hours
              </h3>
            </div>

            <p className="text-slate-500 text-xs sm:text-sm text-left mb-6 leading-relaxed">
              Enrolled bootcamp students have priority booking. Request an live code review, career mentorship, or resume audit session directly with **Umair**.
            </p>

            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center">
                <div className="text-emerald-500 text-4xl mb-3">✓</div>
                <h4 className="font-display font-bold text-lg text-slate-900">Request Received!</h4>
                <p className="text-slate-600 text-xs sm:text-sm mt-2">
                  We have queued your mentorship session request on <strong className="text-slate-900">{sessionDate}</strong> at <strong className="text-slate-900">{sessionTime}</strong>. An calendar confirmation email has been dispatched.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmitSession} className="space-y-4" id="scheduler-form">
                {/* Topic Input */}
                <div className="text-left">
                  <label htmlFor="topic" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Mentorship Topic
                  </label>
                  <input
                    type="text"
                    id="topic"
                    required
                    value={sessionTopic}
                    onChange={(e) => setSessionTopic(e.target.value)}
                    placeholder="e.g., Contract Auditng caching error"
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:border-blue-600 focus:bg-white focus:outline-none transition-all"
                  />
                </div>

                {/* Date Input */}
                <div className="text-left">
                  <label htmlFor="date" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    id="date"
                    required
                    value={sessionDate}
                    onChange={(e) => setSessionDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:border-blue-600 focus:bg-white focus:outline-none transition-all"
                  />
                </div>

                {/* Time Selection */}
                <div className="text-left">
                  <label htmlFor="time" className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Preferred Time Slot
                  </label>
                  <select
                    id="time"
                    required
                    value={sessionTime}
                    onChange={(e) => setSessionTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:border-blue-600 focus:bg-white focus:outline-none transition-all"
                  >
                    <option value="">Select a time slot</option>
                    <option value="10:00 AM - 10:45 AM UTC">10:00 AM - 10:45 AM UTC</option>
                    <option value="02:00 PM - 02:45 PM UTC">02:00 PM - 02:45 PM UTC</option>
                    <option value="06:00 PM - 06:45 PM UTC">06:00 PM - 06:45 PM UTC</option>
                  </select>
                </div>

                {/* Action Submit */}
                <button
                  type="submit"
                  id="submit-scheduler"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md shadow-blue-500/10 hover:shadow-lg transition-all cursor-pointer mt-2"
                >
                  Schedule Office Hour
                </button>
              </form>
            )}
          </div>
        </div>

      </div>
    </section>
  );
}
