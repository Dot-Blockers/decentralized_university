import React from "react";
import { GraduationCap, Github, Twitter, ShieldCheck, Linkedin } from "lucide-react";
import { Du9 } from "../assets/images";

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 text-white border-t border-slate-900 pt-16 pb-8" id="footer-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Foot Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-900 text-left">

          {/* Logo & Slogan Column (5 Cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center space-x-3">
              {/* <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg">
                <span className="font-display font-bold text-lg">DU</span>
              </div> */}
              {/* <div className="flex flex-col">
                <span className="font-display font-extrabold text-lg text-white leading-tight">Decentralized</span>
                <span className="font-sans font-medium text-xs text-blue-500 uppercase tracking-widest leading-none">University</span>
              </div> */}
              <img
                src={Du9}
                alt="logo"
                className="object-cover transition duration-700"
                width={190} height={190}
              // referrerPolicy="no-referrer"
              />
            </div>
            <p className="text-slate-400 text-xs sm:text-sm max-w-sm leading-relaxed">
              Premium educational platform focused on modern Solidity Smart Contracts, and Web3 frontends, designed for future-ready software engineers.
            </p>
            <div className="flex items-center space-x-2 text-slate-500 text-xs font-semibold">
              <ShieldCheck className="h-4 w-4 text-blue-500" />
              <span>In affiliation with dotBlockers Sandbox Initiative</span>
            </div>
          </div>

          {/* Quick links Columns (4 Cols) */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="font-display font-bold text-sm text-slate-500 uppercase tracking-widest">
              Curriculum Navigation
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm text-slate-400 font-medium">
              <button onClick={() => onNavigate("courses")} className="hover:text-blue-500 text-left transition-colors cursor-pointer">
                Tech Courses
              </button>
              <button onClick={() => onNavigate("bootcamps")} className="hover:text-blue-500 text-left transition-colors cursor-pointer">
                Immersive Bootcamps
              </button>
              <button onClick={() => onNavigate("instructor")} className="hover:text-blue-500 text-left transition-colors cursor-pointer">
                Lead Instructor
              </button>
              <button onClick={() => onNavigate("blogs")} className="hover:text-blue-500 text-left transition-colors cursor-pointer col-span-2">
                Developer Blogs
              </button>
            </div>
          </div>

          {/* Contact details / Socials Columns (3 Cols) */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="font-display font-bold text-sm text-slate-500 uppercase tracking-widest">
              Connect With Us
            </h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              Got enrollment questions or need enterprise training for your tech engineering team? Contact our team.
            </p>
            <div className="flex items-center space-x-2 text-slate-500 text-xs font-semibold">
              <span>WhatsApp: +92 346 4440030</span>
            </div>
            <div className="flex items-center space-x-2 text-slate-500 text-xs font-semibold">
              <span>decentralizeduniversity@gmail.com</span>
            </div>
            <div className="flex space-x-3">
              <a href="https://github.com/decentraliseduniversity" className="h-9 w-9 rounded-lg bg-slate-900 hover:bg-blue-600 text-slate-400 hover:text-white flex items-center justify-center transition-all">
                <Github className="h-4.5 w-4.5" />
              </a>
              <a href="https://www.linkedin.com/company/decentralised-university" className="h-9 w-9 rounded-lg bg-slate-900 hover:bg-blue-600 text-slate-400 hover:text-white flex items-center justify-center transition-all">
                <Linkedin className="h-4.5 w-4.5" />
              </a>
            </div>
          </div>

        </div>

        {/* Footer Bottom Rights */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-medium gap-4">
          <p>© {currentYear} Decentralized University. All Rights Reserved.</p>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-slate-300">Privacy Policy</a>
            <a href="#" className="hover:text-slate-300">Terms of Service</a>
            <a href="#" className="hover:text-slate-300">EVM Sandbox Agreement</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
