import React, { useState, useEffect } from "react";
import { Bootcamp } from "../types";
import { Calendar, Users, DollarSign, BookmarkCheck, ArrowLeft, ArrowRight, ShieldCheck, Clock, Award, CheckCircle2, Share2, Check } from "lucide-react";
import { useRouter, Link } from "../router";
import { SEOHead } from "../components/SEOHead";

interface BootcampDetailPageProps {
  bootcampId: string;
  bootcamps: Bootcamp[];
  onApply: (bootcampTitle: string) => void;
}

export default function BootcampDetailPage({ bootcampId, bootcamps, onApply }: BootcampDetailPageProps) {
  const { navigate } = useRouter();
  const [bootcamp, setBootcamp] = useState<Bootcamp | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const found = bootcamps.find((b) => b.id === bootcampId);
    if (found) {
      setBootcamp(found);
    } else {
      // Fetch directly from API in case newly created
      fetch(`/api/bootcamps/${bootcampId}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.bootcamp) setBootcamp(data.bootcamp);
        })
        .catch(console.error);
    }
  }, [bootcampId, bootcamps]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (!bootcamp) {
    return (
      <div className="py-20 text-center">
        <p className="text-slate-500 text-sm">Loading bootcamp details...</p>
        <Link href="/bootcamps" className="mt-4 inline-flex items-center space-x-1 text-sm font-bold text-blue-600">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Bootcamps</span>
        </Link>
      </div>
    );
  }

  const weeklyRoadmap = [
    { phase: "Weeks 1-2: Core Foundations & Frameworks", focus: "Full-stack Next.js 15 App Router architecture, Server Actions, TypeScript typing models, and client/server cache isolation." },
    { phase: "Weeks 3-5: EVM Smart Contract Architecture", focus: "Writing gas-optimized Solidity smart contracts, ERC standards, multi-sig vaults, and Foundry/Hardhat automation suites." },
    { phase: "Weeks 6-8: Security Auditing & Exploit Mitigations", focus: "Reentrancy mitigations, integer overflow, flash loan vectors, and conducting static analysis using Slither and Mythril." },
    { phase: "Weeks 9-12: Capstone Project & Career Audit", focus: "Co-authoring a live verified security audit report, SecondaryDAO integration sandbox, and 1-on-1 career coaching with Umair Riaz." },
  ];

  return (
    <div className="py-8 sm:py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
      <SEOHead bootcamp={bootcamp} />

      {/* Breadcrumb Navigation for SEO */}
      <nav className="flex items-center space-x-2 text-xs font-semibold text-slate-400 mb-6" aria-label="Breadcrumb">
        <Link href="/bootcamps" className="hover:text-blue-600 transition-colors">Bootcamps</Link>
        <span>/</span>
        <span className="text-slate-700 truncate">{bootcamp.title}</span>
      </nav>

      {/* Hero Container */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-10 shadow-xl shadow-slate-200/40 mb-8">
        <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
          <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
            {bootcamp.duration} Immersive Cohort
          </span>

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
                <span>Share Bootcamp</span>
              </>
            )}
          </button>
        </div>

        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 tracking-tight leading-tight">
          {bootcamp.title}
        </h1>

        <p className="text-slate-600 text-base sm:text-lg mt-4 leading-relaxed">
          {bootcamp.description}
        </p>

        {/* Tech Stack Badges */}
        <div className="flex flex-wrap gap-2 mt-6">
          {bootcamp.techTags.map((tech, idx) => (
            <span
              key={idx}
              className="bg-blue-50/60 text-blue-700 border border-blue-100/40 text-xs font-semibold px-3 py-1 rounded-lg"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Specifications Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-8 p-5 bg-slate-50 rounded-2xl border border-slate-100">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Tuition Price</span>
            <span className="text-base sm:text-xl font-extrabold text-slate-900 flex items-center mt-0.5">
              <DollarSign className="h-5 w-5 text-blue-600 -mr-1 shrink-0" />
              {bootcamp.price.replace('$', '')}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Cohort Start</span>
            <span className="text-xs sm:text-sm font-bold text-slate-900 block mt-1">
              {bootcamp.startDate}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Cohort Size</span>
            <span className="text-xs sm:text-sm font-bold text-slate-900 flex items-center mt-1">
              <Users className="h-4 w-4 text-blue-600 mr-1 shrink-0" />
              {bootcamp.maxSeats} Limited Seats
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Weekly Schedule</span>
            <span className="text-xs font-semibold text-slate-700 block mt-1 truncate" title={bootcamp.schedule}>
              {bootcamp.schedule}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-slate-100">
          <div className="flex items-center space-x-2 text-xs font-medium text-slate-500">
            <Award className="h-4 w-4 text-amber-500" />
            <span>Includes 1-on-1 Code Review & Verified Graduate Audit Portfolio</span>
          </div>

          <button
            onClick={() => onApply(bootcamp.title)}
            className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>Apply for Bootcamp Seat</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Cohort Highlights */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-10 shadow-sm mb-8">
        <span className="text-blue-600 text-xs font-bold uppercase tracking-widest">Experience</span>
        <h2 className="text-2xl font-display font-extrabold text-slate-900 mt-1 mb-6">Program Highlights</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {bootcamp.highlights.map((h, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start space-x-3">
              <BookmarkCheck className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
              <span className="text-sm font-semibold text-slate-700">{h}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Roadmap */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-10 shadow-sm mb-8">
        <span className="text-blue-600 text-xs font-bold uppercase tracking-widest">Roadmap</span>
        <h2 className="text-2xl font-display font-extrabold text-slate-900 mt-1 mb-6">Cohort Curriculum Roadmap</h2>

        <div className="space-y-4">
          {weeklyRoadmap.map((item, idx) => (
            <div key={idx} className="p-5 rounded-2xl border border-slate-100 bg-slate-50/60">
              <div className="flex items-center space-x-2">
                <span className="h-6 w-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                  {idx + 1}
                </span>
                <h3 className="font-display font-bold text-base text-slate-900">{item.phase}</h3>
              </div>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 ml-8 leading-relaxed">
                {item.focus}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
