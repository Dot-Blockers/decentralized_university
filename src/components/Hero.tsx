import React from "react";
import { Sparkles, Terminal, ArrowRight, ShieldCheck, Cpu } from "lucide-react";
import { pic } from '../assets/images';

interface HeroProps {
  onExploreCourses: () => void;
  onExploreBootcamps: () => void;
}

export default function Hero({ onExploreCourses, onExploreBootcamps }: HeroProps) {
  return (
    // bg-[radial-gradient(ellipse_at_top_right,rgba(37,99,235,0.15),transparent_50%)]

    <div className="relative overflow-hidden bg-slate-50 text-white py-16 sm:py-24 lg:py-20" id="hero-section">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 
       bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] 
      bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_80%,transparent_100%)]
       pointer-events-none
       " />
      <div className="absolute top-1/2 left-0 h-96 w-96 -translate-y-1/2 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Text Content Area */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-left">
            {/* Tag Badge */}
            <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/30 px-3.5 py-1.5 rounded-full text-blue-400 text-xs sm:text-sm font-semibold uppercase tracking-wider" id="hero-badge">
              <Sparkles className="h-3.5 sm:h-4 w-3.5 sm:w-4" />
              <span>Next-Gen Web3 Education</span>
            </div>

            {/* Display Heading */}
            <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-black leading-[1.1]" id="hero-title">
              Decentralizing the Mind. <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">
                Empowering the Future.
              </span>
            </h1>

            {/* Platform Sub-description */}
            <p className="font-sans text-slate-500 text-base sm:text-lg lg:text-xl max-w-xl leading-relaxed" id="hero-desc">
              Build your foundational <strong>blockchain </strong>knowledge and unlock your future as a blockchain developer or web3 professional. Blockchain Basics blends theoretical clarity with engaging, hands-on activities like setting up your first wallet, sending testnet transactions, and interacting with protocols
              {/* Step into the future of decentralized development. Led by expert architect <strong className="text-white">Umair Riaz</strong>, learn to build ultra-scalable server actions, dynamic dApps, and audited smart contracts. */}
            </p>

            {/* Dual CTAs for Courses / Bootcamps */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2" id="hero-ctas">
              <button
                onClick={onExploreCourses}
                className="inline-flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-300 transform active:scale-95 cursor-pointer"
              >
                <span>Browse Courses</span>
                <ArrowRight className="h-5 w-5" />
              </button>
              <button
                onClick={onExploreBootcamps}
                className="inline-flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-white font-bold px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl transition-all duration-300 cursor-pointer"
              >
                <span>Bootcamps</span>
              </button>
            </div>

            {/* Platform Trust Badges */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-800 max-w-lg" id="hero-trust">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="h-5 w-5 text-blue-400 shrink-0" />
                <span className="text-xs sm:text-sm text-slate-400 font-medium">Industry Certified Auditor</span>
              </div>
              {/* <div className="flex items-center space-x-2">
                <Cpu className="h-5 w-5 text-blue-400 shrink-0" />
                <span className="text-xs sm:text-sm text-slate-400 font-medium">Hands-On Code Sandbox</span>
              </div> */}
            </div>
          </div>

          {/* Graphical Terminal Bento Card */}
          {/* <div className="lg:col-span-5 relative" id="hero-graphic">
            <div className="relative mx-auto max-w-md lg:max-w-none rounded-2xl bg-slate-950/90 border border-slate-800 p-5 shadow-2xl shadow-blue-950/30">
              <div className="flex items-center justify-between pb-4 border-b border-slate-900">
                <div className="flex space-x-2">
                  <div className="h-3 w-3 rounded-full bg-rose-500" />
                  <div className="h-3 w-3 rounded-full bg-amber-500" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500" />
                </div>
                <div className="text-[10px] sm:text-xs text-slate-500 font-mono">du_solidity_compiler.sh</div>
              </div>
              <div className="font-mono text-[11px] sm:text-xs text-left text-slate-300 space-y-2.5 pt-4">
                <p className="text-blue-400"># Compiling SecondaryDAO Smart Contract...</p>
                <p className="text-slate-500">$ npx hardhat compile --network arbitrum</p>
                <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-900 space-y-1">
                  <p className="text-emerald-400">✓ Solidity compiler output matches UUPS upgrade standards.</p>
                  <p className="text-slate-400">✓ Optimization flags configured (200 runs).</p>
                  <p className="text-indigo-400">✓ Verified Check-Effects-Interactions guard active.</p>
                </div>
                <p className="text-slate-500">$ next dev -p 3000</p>
                <p className="text-amber-300">▲ Next.js 15 Server-Actions compiled in 1.4s.</p>
                <p className="text-blue-400">→ Ready on http://localhost:3000</p>
              </div>
            </div>
          </div> */}
          <div className="relative lg:col-span-5 bg-white border border-slate-200 rounded-3xl overflow-hidden p-3.5 w-full flex flex-col justify-between shadow-sm">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/50">
              <img
                src={pic}
                alt="Umair Riaz - Founding Architect"
                className="w-full h-full object-cover transition duration-700 group-hover:scale-[1.02]"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  // Fallback elegant background in case image fails loading
                  e.currentTarget.onerror = null;
                  e.currentTarget.style.display = 'none';
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    const div = document.createElement('div');
                    div.className = "absolute inset-0 bg-gradient-to-tr from-slate-100 via-slate-50 to-slate-200 flex flex-col items-center justify-center p-6 text-center";
                    div.innerHTML = `
                          <div class="p-4 rounded-full bg-blue-50 border border-blue-100 text-blue-600 mb-4">
                            <svg class="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                          </div>
                          <span class="text-slate-900 font-display text-lg font-bold">Umair Riaz</span>
                          <span class="text-blue-600 font-mono text-xs mt-1">Chief Tech Architect</span>
                        `;
                    parent.appendChild(div);
                  }
                }}
              />

              {/* Top overlay badge representing status */}
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200 flex items-center space-x-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-mono tracking-wider font-semibold text-slate-700">ACTIVE SESSION (UTC)</span>
              </div>

              {/* Bottom title info strip */}
              <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-slate-950/95 via-slate-950/45 to-transparent flex flex-col">
                <span className="text-white font-display font-bold text-lg leading-tight"> Inst. Umair Riaz</span>
                <span className="text-blue-400 text-xs font-mono font-bold mt-0.5 tracking-wide">Blockchain Council Member</span>
              </div>
            </div>

            {/* Additional overlay sticker highlighting feature */}
            <div className="mb-2 absolute -bottom-0 -right-2 bg-white border border-slate-200 rounded-2xl p-3.5 shadow-md flex items-center space-x-3.5 max-w-[210px]">
              {/* <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100/50 flex items-center justify-center text-blue-600 shrink-0">
                <Terminal className="w-4 h-4" />
              </div> */}
              <div>
                <div className="text-[10px] font-mono font-bold tracking-wide text-slate-400">umair@dotblockers.com</div>
                <div className="text-xs font-display font-semibold text-slate-800">www.umairriaz.info</div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
