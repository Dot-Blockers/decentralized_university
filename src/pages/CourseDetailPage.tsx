import React, { useState, useEffect } from "react";
import { Course } from "../types";
import { BookOpen, Star, Users, Award, Clock, CheckCircle2, ArrowLeft, ArrowRight, Sparkles, Share2, Check } from "lucide-react";
import { useRouter, Link } from "../router";
import { SEOHead } from "../components/SEOHead";

interface CourseDetailPageProps {
  courseId: string;
  courses: Course[];
  onEnroll: (courseTitle: string) => void;
}

export default function CourseDetailPage({ courseId, courses, onEnroll }: CourseDetailPageProps) {
  const { navigate } = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const found = courses.find((c) => c.id === courseId);
    if (found) {
      setCourse(found);
    } else {
      // Fetch directly from API in case newly created
      fetch(`/api/courses/${courseId}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.course) setCourse(data.course);
        })
        .catch(console.error);
    }
  }, [courseId, courses]);

  console.log("Course Detail Page - courseId:", courseId, "course:", course);
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (!course) {
    return (
      <div className="py-20 text-center">
        <p className="text-slate-500 text-sm">Loading course details...</p>
        <Link href="/courses" className="mt-4 inline-flex items-center space-x-1 text-sm font-bold text-blue-600">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Courses</span>
        </Link>
      </div>
    );
  }

  // Sample chapters for rich syllabus view
  const chapters = [
    { title: "Module 1: Foundations & Architecture Setup", duration: "2.5 Hours", topics: ["Environment Setup & Monorepo Structure", "TypeScript & Strict Type Configurations", "Architecture Blueprints & System Design"] },
    { title: "Module 2: Core Engineering & Implementation", duration: "4.0 Hours", topics: ["Server Actions & Pipeline Integration", "State Machines & Cache Invalidation", "Security Boundaries & Exception Handling"] },
    { title: "Module 3: Advanced Optimization & Hardening", duration: "3.5 Hours", topics: ["Zero-Downtime Migration Patterns", "Gas Profiling & Performance Telemetry", "Automated Hardhat/Foundry Test Suites"] },
    { title: "Module 4: Production Deployment & Verification", duration: "2.0 Hours", topics: ["Multi-Network RPC Fallbacks", "Contract Verification on Etherscan/Blockscout", "Monitoring & Telemetry Alerts"] },
  ];

  return (
    <div className="py-8 sm:py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
      <SEOHead course={course} />

      {/* Breadcrumb Navigation for SEO */}
      <nav className="flex items-center space-x-2 text-xs font-semibold text-slate-400 mb-6" aria-label="Breadcrumb">
        <Link href="/courses" className="hover:text-blue-600 transition-colors">Courses</Link>
        <span>/</span>
        <span className="text-slate-700 truncate">{course.title}</span>
      </nav>

      {/* Hero Header */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-10 shadow-xl shadow-slate-200/40 mb-8">
        <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center text-xs font-bold px-3 py-1 rounded-full ${
              course.difficulty === "Advanced"
                ? "bg-rose-50 text-rose-600"
                : course.difficulty === "Intermediate"
                ? "bg-amber-50 text-amber-600"
                : "bg-emerald-50 text-emerald-600"
            }`}>
              {course.difficulty} Level
            </span>
            <span className="text-xs font-mono text-slate-400 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
              {course.duration}
            </span>
          </div>

          <button
            onClick={handleShare}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 px-3 py-1.5 bg-slate-50 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
          >
            {copiedLink ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span className="text-emerald-600">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="h-3.5 w-3.5" />
                <span>Share Course</span>
              </>
            )}
          </button>
        </div>

        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 tracking-tight leading-tight">
          {course.title}
        </h1>

        <p className="text-slate-600 text-base sm:text-lg mt-4 leading-relaxed">
          {course.description}
        </p>

        {/* Tech Tags */}
        <div className="flex flex-wrap gap-2 mt-6">
          {course.tags.map((tag, idx) => (
            <span
              key={idx}
              className="bg-blue-50/70 border border-blue-100/50 text-blue-700 text-xs font-semibold px-3 py-1 rounded-lg"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Stats Row */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-1.5">
              <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
              <span className="font-bold text-slate-900">{course.rating} Rating</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Users className="h-4 w-4 text-slate-400" />
              <span className="text-slate-600">{course.enrolledStudents} Enrolled</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <BookOpen className="h-4 w-4 text-slate-400" />
              <span className="text-slate-600">{course.lessonsCount} Chapters</span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => onEnroll(course.title)}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-md shadow-blue-500/10 cursor-pointer"
            >
              Enroll in Course
            </button>
            <Link
              href="/video-lessons"
              className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm rounded-xl transition-all"
            >
              Interactive Code Lab
            </Link>
          </div>
        </div>
      </div>

      {/* Syllabus / Curriculum breakdown */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-10 shadow-sm mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-blue-600 text-xs font-bold uppercase tracking-widest">Syllabus</span>
            <h2 className="text-2xl font-display font-extrabold text-slate-900 mt-1">Course Curriculum Breakdown</h2>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
            {course.lessonsCount} Total Modules
          </span>
        </div>

        <div className="space-y-4">
          {chapters.map((ch, idx) => (
            <div key={idx} className="border border-slate-100 rounded-2xl p-5 hover:border-blue-200 transition-colors bg-slate-50/50">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-base text-slate-900">{ch.title}</h3>
                <span className="text-xs text-slate-400 font-mono font-medium">{ch.duration}</span>
              </div>
              <ul className="mt-3 space-y-1.5">
                {ch.topics.map((t, tIdx) => (
                  <li key={tIdx} className="text-xs text-slate-600 flex items-center space-x-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Instructor Box */}
      <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="h-20 w-20 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-display font-extrabold text-2xl shrink-0 shadow-lg">
            UR
          </div>
          <div className="text-center sm:text-left flex-1">
            <span className="text-blue-400 text-xs font-bold uppercase tracking-wider">Lead Instructor</span>
            <h3 className="text-xl font-display font-extrabold text-white mt-1">{course.instructor || "Umair Riaz"}</h3>
            <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
              Renowned Web3 engineer and Next.js instructor. Co-architect of SecondaryDAO and founder of Decentralized University.
            </p>
          </div>
          <Link
            href="/instructor"
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition-colors shrink-0"
          >
            View Instructor Bio
          </Link>
        </div>
      </div>
    </div>
  );
}
