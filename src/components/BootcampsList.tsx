import React from "react";
import { Bootcamp } from "../types";
import { Calendar, Users, DollarSign, BookmarkCheck, ArrowUpRight, ExternalLink } from "lucide-react";
import { Link } from "../router";

interface BootcampsListProps {
  bootcamps: Bootcamp[];
  onApply: (bootcampTitle: string) => void;
}

export default function BootcampsList({ bootcamps, onApply }: BootcampsListProps) {
  return (
    <section className="py-12 sm:py-16 bg-slate-50" id="bootcamps-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <span className="text-blue-600 text-xs sm:text-sm font-bold uppercase tracking-widest">
            Accelerate Your Career
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 mt-2">
            Cohort-Based Immersive Bootcamps
          </h2>
          <p className="text-slate-500 text-sm sm:text-base mt-3 leading-relaxed">
            Participate in interactive, structured code reviews and perform mock smart contract audits. Graduate with a co-authored certified audit portfolio.
          </p>
        </div>

        {/* Bootcamps Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-8" id="bootcamps-grid">
          {bootcamps.map((bootcamp) => (
            <div
              key={bootcamp.id}
              id={`bootcamp-card-${bootcamp.id}`}
              className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 hover:shadow-xl hover:shadow-slate-200/50 transition-shadow duration-300 flex flex-col justify-between text-left"
            >
              <div>
                {/* Header Status Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                  <span className="bg-blue-50 text-blue-600 text-xs font-semibold px-3 py-1.5 rounded-full uppercase tracking-wider">
                    {bootcamp.duration} Cohort
                  </span>
                  <div className="flex items-center space-x-1.5 text-xs font-semibold text-slate-500">
                    <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                    <span>Starts {bootcamp.startDate}</span>
                  </div>
                </div>

                {/* Bootcamp Title & Description */}
                <h3 className="font-display font-extrabold text-2xl text-slate-900 leading-tight">
                  <Link href={`/bootcamps/${bootcamp.id}`} className="hover:text-blue-600 transition-colors">
                    {bootcamp.title}
                  </Link>
                </h3>
                <p className="text-slate-500 text-sm sm:text-base mt-3 leading-relaxed">
                  {bootcamp.description}
                </p>

                {/* Bootcamp Specifications Stats Grid */}
                <div className="grid grid-cols-3 gap-4 my-6 p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                  <div className="text-left">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Price</span>
                    <span className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center mt-0.5">
                      <DollarSign className="h-4 w-4 text-blue-600 shrink-0 -mr-0.5" />
                      {bootcamp.price.replace('$', '')}
                    </span>
                  </div>
                  <div className="text-left border-x border-slate-200/80 px-4">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Max Capacity</span>
                    <span className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center mt-0.5">
                      <Users className="h-4 w-4 text-blue-600 shrink-0 mr-1" />
                      {bootcamp.maxSeats} Seats
                    </span>
                  </div>
                  <div className="text-left">
                    <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Schedule</span>
                    <span className="text-xs sm:text-sm font-bold text-slate-900 block mt-1 truncate">
                      {bootcamp.schedule.split('),')[0] + ')'}
                    </span>
                  </div>
                </div>

                {/* Bootcamp Tech Stack Badges */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {bootcamp.techTags.map((tech, idx) => (
                    <span
                      key={idx}
                      className="bg-blue-50/50 text-blue-600 text-xs font-semibold px-2.5 py-1 rounded-lg border border-blue-100/30"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Highlights List */}
                <div className="space-y-3 mb-8">
                  <h4 className="text-xs text-slate-400 font-bold uppercase tracking-wider">Cohort Highlights</h4>
                  <ul className="space-y-2.5">
                    {bootcamp.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-start space-x-2.5 text-slate-600 text-sm">
                        <BookmarkCheck className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex text-end">
                {/* <Link
                  href={`/bootcamps/${bootcamp.id}`}
                  className="inline-flex items-center justify-center space-x-1 border border-slate-200 hover:border-blue-400 text-slate-700 hover:text-blue-600 font-bold py-3.5 px-4 rounded-xl text-sm transition-all cursor-pointer"
                >
                  <span>Syllabus</span>
                  <ExternalLink className="h-4 w-4" />
                </Link> */}
                <button
                  onClick={() => onApply(bootcamp.title)}
                  className=" inline-flex items-center justify-center space-x-2 bg-slate-900 hover:bg-blue-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-all duration-300 group cursor-pointer"
                  // id={`apply-bootcamp-${bootcamp.id}`}
                >
                  <span>Reserve My Spot</span>
                  <ArrowUpRight className="h-4.5 w-4.5 transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}





















// import React, { useState, useRef, useEffect, MouseEvent, TouchEvent } from "react";
// import { Bootcamp } from "../types";
// import {
//   Calendar,
//   Users,
//   DollarSign,
//   BookmarkCheck,
//   ArrowUpRight,
//   ExternalLink,
//   Layers,
//   Sparkles,
//   Compass,
//   RotateCcw,
//   Box,
//   Flame,
//   CheckCircle2,
// } from "lucide-react";
// import { Link } from "../router";

// interface BootcampsListProps {
//   bootcamps: Bootcamp[];
//   onApply: (bootcampTitle: string) => void;
// }

// interface ThreeDBootcampCardProps {
//   key?: React.Key;
//   bootcamp: Bootcamp;
//   index: number;
//   viewMode: "interactive" | "isometric" | "elevated";
//   onApply: (title: string) => void;
// }

// // Interactive 3D Card Component with Multi-Plane Parallax Depth
// const ThreeDBootcampCard: React.FC<ThreeDBootcampCardProps> = ({
//   bootcamp,
//   index,
//   viewMode,
//   onApply,
// }) => {
//   const cardRef = useRef<HTMLDivElement>(null);
//   const [rotateX, setRotateX] = useState<number>(0);
//   const [rotateY, setRotateY] = useState<number>(0);
//   const [isHovered, setIsHovered] = useState<boolean>(false);
//   const [glarePosition, setGlarePosition] = useState<{ x: number; y: number }>({ x: 50, y: 50 });

//   // Calculate remaining seats for realistic 3D capacity bar
//   const maxSeats = bootcamp.maxSeats || 20;
//   // Deterministic calculation based on id/index for realistic enrollment display
//   const enrolledSeats = Math.min(maxSeats - 3, Math.floor(maxSeats * 0.75) + (index % 3));
//   const remainingSeats = Math.max(1, maxSeats - enrolledSeats);
//   const fillPercentage = Math.round((enrolledSeats / maxSeats) * 100);

//   const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
//     if (viewMode !== "interactive" || !cardRef.current) return;
//     const rect = cardRef.current.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;
    
//     // Normalized from -1 to 1
//     const normalizedX = (x / rect.width) * 2 - 1;
//     const normalizedY = (y / rect.height) * 2 - 1;

//     // Tilt angles (max 14 degrees)
//     const newRotateY = normalizedX * 12;
//     const newRotateX = -normalizedY * 12;

//     setRotateX(newRotateX);
//     setRotateY(newRotateY);
//     setGlarePosition({
//       x: (x / rect.width) * 100,
//       y: (y / rect.height) * 100,
//     });
//   };

//   const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
//     if (viewMode !== "interactive" || !cardRef.current || e.touches.length === 0) return;
//     const touch = e.touches[0];
//     const rect = cardRef.current.getBoundingClientRect();
//     const x = touch.clientX - rect.left;
//     const y = touch.clientY - rect.top;

//     if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
//       const normalizedX = (x / rect.width) * 2 - 1;
//       const normalizedY = (y / rect.height) * 2 - 1;
//       setRotateX(-normalizedY * 8);
//       setRotateY(normalizedX * 8);
//       setGlarePosition({
//         x: (x / rect.width) * 100,
//         y: (y / rect.height) * 100,
//       });
//     }
//   };

//   const handleMouseEnter = () => {
//     setIsHovered(true);
//   };

//   const handleMouseLeave = () => {
//     setIsHovered(false);
//     setRotateX(0);
//     setRotateY(0);
//   };

//   // Determine current 3D transform based on viewMode & hover state
//   let transformStyle = "";
//   if (viewMode === "isometric") {
//     transformStyle = "perspective(1200px) rotateX(14deg) rotateY(-10deg) rotateZ(1deg) scale3d(0.98, 0.98, 0.98)";
//   } else if (viewMode === "elevated") {
//     transformStyle = "perspective(1200px) rotateX(8deg) rotateY(0deg) scale3d(1.02, 1.02, 1.02) translateY(-8px)";
//   } else {
//     // Interactive
//     if (isHovered) {
//       transformStyle = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02) translateY(-6px)`;
//     } else {
//       transformStyle = "perspective(1200px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
//     }
//   }

//   return (
//     <div
//       className="relative [perspective:1400px] transition-all duration-300"
//       style={{ minHeight: "560px" }}
//     >
//       {/* 3D Drop Projection / Ground Shadow */}
//       <div
//         className={`absolute -inset-2 rounded-[36px] bg-slate-900/10 blur-xl transition-all duration-500 pointer-events-none ${
//           isHovered || viewMode !== "interactive" ? "opacity-100 translate-y-6 scale-95" : "opacity-40 translate-y-2 scale-90"
//         }`}
//       />

//       {/* Main 3D Card Shell */}
//       <div
//         ref={cardRef}
//         id={`bootcamp-card-${bootcamp.id}`}
//         onMouseMove={handleMouseMove}
//         onTouchMove={handleTouchMove}
//         onMouseEnter={handleMouseEnter}
//         onMouseLeave={handleMouseLeave}
//         style={{
//           transform: transformStyle,
//           transformStyle: "preserve-3d",
//           transition: isHovered ? "transform 0.08s ease-out, box-shadow 0.3s ease" : "transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.5s ease",
//         }}
//         className={`relative h-full bg-gradient-to-b from-white via-white to-slate-50/70 border border-slate-200/80 rounded-[32px] p-6 sm:p-8 flex flex-col justify-between text-left cursor-default select-none overflow-hidden ${
//           isHovered
//             ? "shadow-[0_25px_50px_-12px_rgba(15,23,42,0.22),0_0_0_1px_rgba(59,130,246,0.35)]"
//             : "shadow-[0_15px_30px_-10px_rgba(15,23,42,0.1),0_0_0_1px_rgba(226,232,240,0.8)]"
//         }`}
//       >
//         {/* Dynamic Specular 3D Hologram Glare Layer */}
//         {isHovered && (
//           <div
//             className="absolute inset-0 pointer-events-none transition-opacity duration-300 rounded-[32px] opacity-75"
//             style={{
//               background: `radial-gradient(circle 350px at ${glarePosition.x}% ${glarePosition.y}%, rgba(255, 255, 255, 0.85), rgba(219, 234, 254, 0.25) 45%, transparent 70%)`,
//               mixBlendMode: "overlay",
//               zIndex: 30,
//             }}
//           />
//         )}

//         {/* 3D Dimensional Top Edge Highlight Rim */}
//         <div className="absolute top-0 inset-x-8 h-[2px] bg-gradient-to-r from-transparent via-blue-400/40 to-transparent pointer-events-none" />

//         {/* 3D Layer 1: Floating Header & Isometric Cube Accent */}
//         <div
//           style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}
//           className="transition-transform duration-200"
//         >
//           {/* Header Row: Badge & Isometric Polyhedron */}
//           <div className="flex items-center justify-between gap-3 mb-5">
//             <div className="flex items-center space-x-2">
//               <span className="inline-flex items-center space-x-1.5 bg-blue-600 text-white text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-xl shadow-md shadow-blue-500/25 border-t border-blue-400">
//                 <Sparkles className="h-3.5 w-3.5 animate-pulse" />
//                 <span>{bootcamp.duration} Cohort</span>
//               </span>

//               <span className="hidden sm:inline-flex items-center space-x-1 bg-emerald-50 text-emerald-700 text-[11px] font-bold px-2.5 py-1 rounded-lg border border-emerald-200/60 shadow-xs">
//                 <Flame className="h-3 w-3 text-emerald-600" />
//                 <span>Live Enrolling</span>
//               </span>
//             </div>

//             {/* Micro 3D Rotating Cube Graphic */}
//             <div className="relative w-8 h-8 [perspective:300px]">
//               <div
//                 className="w-full h-full relative rounded-lg bg-gradient-to-br from-blue-500 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-blue-500/20 transform-gpu rotate-12 transition-transform duration-300 group-hover:rotate-45"
//                 style={{
//                   boxShadow: "inset 0 1px 1px rgba(255,255,255,0.6), 0 4px 10px rgba(37,99,235,0.3)",
//                 }}
//               >
//                 <Box className="h-4 w-4 text-white" />
//               </div>
//             </div>
//           </div>

//           {/* Schedule & Start Date Banner */}
//           <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 mb-4">
//             <Calendar className="h-4 w-4 text-blue-500 shrink-0" />
//             <span>Starts: <strong className="text-slate-800">{bootcamp.startDate}</strong></span>
//             <span className="text-slate-300">•</span>
//             <span className="text-slate-600 truncate">{bootcamp.schedule}</span>
//           </div>

//           {/* 3D Extruded Title & Description */}
//           <div style={{ transform: "translateZ(38px)" }}>
//             <h3 className="font-display font-black text-2xl sm:text-[26px] text-slate-900 leading-tight tracking-tight">
//               <Link
//                 href={`/bootcamps/${bootcamp.id}`}
//                 className="hover:text-blue-600 transition-colors drop-shadow-xs"
//               >
//                 {bootcamp.title}
//               </Link>
//             </h3>
//             <p className="text-slate-500 text-sm sm:text-[15px] mt-2.5 leading-relaxed font-normal">
//               {bootcamp.description}
//             </p>
//           </div>
//         </div>

//         {/* 3D Layer 2: Elevated Dimensional Metrics Podium */}
//         <div
//           style={{ transform: "translateZ(44px)", transformStyle: "preserve-3d" }}
//           className="my-5 p-4 rounded-2xl bg-gradient-to-b from-white to-slate-100/90 border border-slate-200/90 shadow-[0_8px_20px_-6px_rgba(0,0,0,0.06),inset_0_1px_1px_rgba(255,255,255,0.9)]"
//         >
//           <div className="grid grid-cols-3 gap-2 text-left">
//             {/* Price Podium */}
//             <div className="p-2">
//               <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">
//                 Tuition Fee
//               </span>
//               <div className="text-base sm:text-lg font-black text-slate-900 flex items-center mt-0.5 tracking-tight">
//                 <DollarSign className="h-4 w-4 text-blue-600 shrink-0 -mr-0.5" />
//                 <span>{bootcamp.price.replace("$", "")}</span>
//               </div>
//             </div>

//             {/* Capacity Podium with Divider */}
//             <div className="p-2 border-x border-slate-200/80 px-3">
//               <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">
//                 Total Seats
//               </span>
//               <div className="text-base sm:text-lg font-black text-slate-900 flex items-center mt-0.5 tracking-tight">
//                 <Users className="h-4 w-4 text-blue-600 shrink-0 mr-1" />
//                 <span>{maxSeats}</span>
//               </div>
//             </div>

//             {/* Availability Podium */}
//             <div className="p-2 pl-3">
//               <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">
//                 Status
//               </span>
//               <span className="text-xs sm:text-sm font-black text-emerald-600 flex items-center mt-1">
//                 <CheckCircle2 className="h-3.5 w-3.5 mr-1 shrink-0" />
//                 <span>{remainingSeats} left</span>
//               </span>
//             </div>
//           </div>

//           {/* 3D Inset Progress Chamber (Seats Available Visualizer) */}
//           <div className="mt-3 pt-3 border-t border-slate-200/60">
//             <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-1.5">
//               <span>Cohort Enrollment Pace</span>
//               <span className="font-bold text-slate-800">{fillPercentage}% Filled</span>
//             </div>
//             <div className="relative h-2.5 w-full bg-slate-200/80 rounded-full overflow-hidden shadow-[inset_0_1px_3px_rgba(0,0,0,0.15)]">
//               <div
//                 className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 shadow-[0_0_10px_rgba(37,99,235,0.4)] transition-all duration-700"
//                 style={{ width: `${fillPercentage}%` }}
//               />
//             </div>
//           </div>
//         </div>

//         {/* 3D Layer 3: Raised Holographic Tech Stack Chips */}
//         <div
//           style={{ transform: "translateZ(34px)", transformStyle: "preserve-3d" }}
//           className="mb-5"
//         >
//           <div className="flex flex-wrap gap-2">
//             {bootcamp.techTags.map((tech, idx) => (
//               <span
//                 key={idx}
//                 className="inline-flex items-center text-xs font-bold text-slate-700 bg-white px-3 py-1.5 rounded-xl border border-slate-200/90 shadow-[0_2px_4px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.9)] hover:border-blue-400 hover:text-blue-600 transition-colors"
//               >
//                 {tech}
//               </span>
//             ))}
//           </div>
//         </div>

//         {/* 3D Layer 4: Cohort Deliverables / Highlights */}
//         <div
//           style={{ transform: "translateZ(26px)" }}
//           className="space-y-2.5 mb-7"
//         >
//           <h4 className="text-xs text-slate-400 font-extrabold uppercase tracking-wider">
//             Verified Outcomes & Deliverables
//           </h4>
//           <ul className="space-y-2">
//             {bootcamp.highlights.map((highlight, idx) => (
//               <li
//                 key={idx}
//                 className="flex items-start space-x-2.5 text-slate-600 text-xs sm:text-sm font-medium"
//               >
//                 <BookmarkCheck className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
//                 <span>{highlight}</span>
//               </li>
//             ))}
//           </ul>
//         </div>

//         {/* 3D Layer 5: Physical Tactile 3D Action Buttons */}
//         <div
//           style={{ transform: "translateZ(48px)", transformStyle: "preserve-3d" }}
//           className="pt-2 flex items-center gap-3"
//         >
//           <Link
//             href={`/bootcamps/${bootcamp.id}`}
//             className="inline-flex items-center justify-center space-x-1.5 bg-white hover:bg-slate-50 text-slate-700 hover:text-blue-600 font-bold py-3.5 px-4 rounded-2xl text-xs sm:text-sm border border-slate-200/90 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),inset_0_1px_0_rgba(255,255,255,1)] hover:shadow-md transition-all active:translate-y-0.5 cursor-pointer"
//           >
//             <span>Syllabus</span>
//             <ExternalLink className="h-4 w-4" />
//           </Link>

//           <button
//             onClick={() => onApply(bootcamp.title)}
//             id={`apply-bootcamp-${bootcamp.id}`}
//             className="flex-1 inline-flex items-center justify-center space-x-2 bg-slate-950 hover:bg-blue-600 text-white font-black py-3.5 px-5 rounded-2xl text-xs sm:text-sm border-b-[4px] border-slate-800 hover:border-blue-700 shadow-[0_10px_20px_-5px_rgba(15,23,42,0.3)] hover:shadow-blue-500/30 transition-all duration-150 active:translate-y-1 active:border-b-0 cursor-pointer group"
//           >
//             <span>Reserve My Spot</span>
//             <ArrowUpRight className="h-4 w-4 transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function BootcampsList({ bootcamps, onApply }: BootcampsListProps) {
//   // 3D View mode: "interactive" (tracks mouse/touch parallax), "isometric" (dimensional perspective), "elevated" (subtle tilt)
//   const [viewMode, setViewMode] = useState<"interactive" | "isometric" | "elevated">("interactive");

//   return (
//     <section className="py-12 sm:py-16 bg-slate-50 relative overflow-hidden" id="bootcamps-section">
//       {/* 3D Depth Isometric Perspective Background Plane */}
//       <div
//         className="absolute inset-0 pointer-events-none opacity-40"
//         style={{
//           backgroundImage: `radial-gradient(#cbd5e1 1px, transparent 1px), radial-gradient(#e2e8f0 1px, transparent 1px)`,
//           backgroundSize: "32px 32px",
//           backgroundPosition: "0 0, 16px 16px",
//           maskImage: "radial-gradient(ellipse at 50% 30%, black 40%, transparent 80%)",
//         }}
//       />

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
//         {/* Section Heading & 3D Interactive Control Dock */}
//         <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-14 gap-6">
//           <div className="text-left max-w-2xl">
//             <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-100/80 px-3.5 py-1.5 rounded-full mb-3 shadow-xs">
//               <Compass className="h-3.5 w-3.5 text-blue-600 animate-spin-slow" />
//               <span className="text-blue-700 text-xs font-black uppercase tracking-widest">
//                 3D Immersive Cohort Experience
//               </span>
//             </div>
//             <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-slate-900 tracking-tight">
//               Cohort-Based Immersive Bootcamps
//             </h2>
//             <p className="text-slate-500 text-sm sm:text-base mt-3 leading-relaxed">
//               Hover, tilt, and explore each intensive program in real-time 3D depth. Participate in live code reviews, multi-sig smart contract architecture, and graduate with a co-authored certified audit portfolio.
//             </p>
//           </div>

//           {/* 3D Spatial Perspective Mode Switcher */}
//           <div className="flex items-center space-x-1.5 bg-white p-1.5 rounded-2xl border border-slate-200/90 shadow-sm self-start md:self-end">
//             <span className="text-[11px] font-bold text-slate-400 px-2.5 uppercase tracking-wider hidden sm:inline">
//               3D View:
//             </span>

//             <button
//               onClick={() => setViewMode("interactive")}
//               className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
//                 viewMode === "interactive"
//                   ? "bg-blue-600 text-white shadow-sm shadow-blue-500/25"
//                   : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
//               }`}
//               title="Interactive Parallax: Follows cursor and touch coordinates"
//             >
//               <Layers className="h-3.5 w-3.5" />
//               <span>Interactive Tilt</span>
//             </button>

//             <button
//               onClick={() => setViewMode("isometric")}
//               className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
//                 viewMode === "isometric"
//                   ? "bg-blue-600 text-white shadow-sm shadow-blue-500/25"
//                   : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
//               }`}
//               title="Fixed Isometric 3D Perspective"
//             >
//               <Box className="h-3.5 w-3.5" />
//               <span>Isometric 3D</span>
//             </button>

//             <button
//               onClick={() => setViewMode("elevated")}
//               className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
//                 viewMode === "elevated"
//                   ? "bg-blue-600 text-white shadow-sm shadow-blue-500/25"
//                   : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
//               }`}
//               title="Elevated Float Presentation"
//             >
//               <RotateCcw className="h-3.5 w-3.5" />
//               <span>Elevated Float</span>
//             </button>
//           </div>
//         </div>

//         {/* 3D Bootcamps Grid Layout */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10" id="bootcamps-grid">
//           {bootcamps.map((bootcamp, idx) => (
//             <ThreeDBootcampCard
//               key={bootcamp.id}
//               bootcamp={bootcamp}
//               index={idx}
//               viewMode={viewMode}
//               onApply={onApply}
//             />
//           ))}
//         </div>

//         {/* Interactive 3D Exploration Hint Footer */}
//         <div className="mt-12 text-center">
//           <div className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 bg-white/80 backdrop-blur-xs px-4 py-2 rounded-full border border-slate-200/60 shadow-xs">
//             <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
//             <span>Interactive 3D Engine Active: Move your cursor over any card to inspect spatial depth and specular light reflections.</span>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
