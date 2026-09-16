import React, { useState, useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  TrendingUp,
  Users,
  CheckCircle2,
  Clock,
  Award,
  Layers,
  Sparkles,
  PieChart as PieIcon,
  BarChart3,
  Calendar,
  DollarSign,
} from "lucide-react";
import { bootcampsData } from "../data";

interface EnrollmentItem {
  id: string;
  name: string;
  email: string;
  github: string;
  bootcamp: string;
  paid: boolean;
  accessCode?: string;
  createdAt: string | Date;
}

interface AdminEnrollmentChartsProps {
  enrollments: EnrollmentItem[];
  onSelectBootcampFilter?: (bootcampName: string) => void;
}

export default function AdminEnrollmentCharts({
  enrollments,
  onSelectBootcampFilter,
}: AdminEnrollmentChartsProps) {
  const [chartView, setChartView] = useState<"all" | "comparison" | "trends">("all");

  // 1. Process data for Bootcamp Comparison Bar Chart
  const bootcampComparisonData = useMemo(() => {
    return bootcampsData.map((bootcamp) => {
      // Find matching enrollments (matching title or partial name)
      const matched = enrollments.filter(
        (e) =>
          e.bootcamp.toLowerCase().includes(bootcamp.title.toLowerCase()) ||
          bootcamp.title.toLowerCase().includes(e.bootcamp.toLowerCase()) ||
          (bootcamp.id === "web3-nextjs-accelerator" && e.bootcamp.toLowerCase().includes("web3")) ||
          (bootcamp.id === "solidity-auditing-intensive" && e.bootcamp.toLowerCase().includes("audit"))
      );

      const totalReserved = matched.length;
      const paidCount = matched.filter((e) => e.paid).length;
      const pendingCount = totalReserved - paidCount;
      const maxSeats = bootcamp.maxSeats || 30;
      const fillRate = Math.round((totalReserved / maxSeats) * 100);
      const priceNumeric = parseInt(bootcamp.price.replace(/[^0-9]/g, ""), 10) || 0;
      const revenue = paidCount * priceNumeric;

      // Short label for chart axis
      const shortName =
        bootcamp.id === "web3-nextjs-accelerator"
          ? "Web3 & Next.js"
          : "Smart Contract Audit";

      return {
        id: bootcamp.id,
        fullName: bootcamp.title,
        name: shortName,
        totalReserved,
        paid: paidCount,
        pending: pendingCount,
        maxSeats,
        fillRate,
        revenue,
        price: bootcamp.price,
      };
    });
  }, [enrollments]);

  // 2. Process data for Enrollment Trends Over Time (Cumulative Area Chart)
  const timelineTrendData = useMemo(() => {
    if (enrollments.length === 0) return [];

    // Sort enrollments chronologically
    const sorted = [...enrollments].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateA - dateB;
    });

    // Group enrollments by readable date / week
    const dateMap = new Map<string, { total: number; paid: number; pending: number; dateLabel: string }>();

    let cumulativeTotal = 0;
    let cumulativePaid = 0;
    let cumulativePending = 0;

    sorted.forEach((item) => {
      const d = new Date(item.createdAt);
      // Format as "Mon DD"
      const dateKey = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

      cumulativeTotal += 1;
      if (item.paid) {
        cumulativePaid += 1;
      } else {
        cumulativePending += 1;
      }

      dateMap.set(dateKey, {
        total: cumulativeTotal,
        paid: cumulativePaid,
        pending: cumulativePending,
        dateLabel: dateKey,
      });
    });

    return Array.from(dateMap.values());
  }, [enrollments]);

  // 3. Process Share Distribution for Donut Chart
  const distributionData = useMemo(() => {
    const colors = ["#2563EB", "#059669", "#7C3AED", "#D97706"];
    return bootcampComparisonData.map((b, idx) => ({
      name: b.name,
      fullName: b.fullName,
      value: b.totalReserved,
      color: colors[idx % colors.length],
    }));
  }, [bootcampComparisonData]);

  // High-level calculations
  const totalSpots = enrollments.length;
  const totalPaid = enrollments.filter((e) => e.paid).length;
  const totalPotentialRevenue = bootcampComparisonData.reduce(
    (acc, b) => acc + b.revenue,
    0
  );

  return (
    <div className="space-y-6 mb-8" id="admin-charts-section">
      {/* Visual Analytics Header & Filter Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 border border-slate-200/80 rounded-2xl p-4">
        <div className="flex items-center space-x-2.5">
          <div className="h-9 w-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
            <TrendingUp className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 font-display">
              Enrollment Trends & Bootcamp Analytics
            </h3>
            <p className="text-xs text-slate-500">
              Interactive visualization of reserved cohort seats, verification status, and seat fill rate.
            </p>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center space-x-1 bg-white border border-slate-200 p-1 rounded-xl shadow-xs self-start sm:self-auto">
          <button
            onClick={() => setChartView("all")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 ${
              chartView === "all"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>All Views</span>
          </button>
          <button
            onClick={() => setChartView("comparison")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 ${
              chartView === "comparison"
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5" />
            <span>Bootcamp Breakdown</span>
          </button>
          <button
            onClick={() => setChartView("trends")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center space-x-1.5 ${
              chartView === "trends"
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Growth Timeline</span>
          </button>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* CHART 1: Bootcamp Spot Breakdown (Bar Chart) */}
        {(chartView === "all" || chartView === "comparison") && (
          <div
            className={`${
              chartView === "comparison" ? "lg:col-span-12" : "lg:col-span-7"
            } bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col`}
            id="bootcamp-breakdown-card"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 block">
                  Cohort Demand Comparison
                </span>
                <h4 className="text-base font-bold text-slate-900 mt-0.5">
                  Reserved Spots by Bootcamp
                </h4>
              </div>
              <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
                {bootcampComparisonData.length} Cohorts Active
              </span>
            </div>

            {/* Recharts BarChart */}
            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={bootcampComparisonData}
                  margin={{ top: 15, right: 20, left: -10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#64748b", fontSize: 12, fontWeight: 600 }}
                    axisLine={{ stroke: "#e2e8f0" }}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fill: "#64748b", fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomBarTooltip />} />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    iconType="circle"
                    wrapperStyle={{ paddingBottom: "12px", fontSize: "12px", fontWeight: 600 }}
                  />
                  <Bar
                    dataKey="paid"
                    name="Paid & Confirmed"
                    fill="#10b981"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={44}
                  />
                  <Bar
                    dataKey="pending"
                    name="Pending Verification"
                    fill="#f59e0b"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={44}
                  />
                  <Bar
                    dataKey="totalReserved"
                    name="Total Spots"
                    fill="#3b82f6"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={44}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Bootcamp Cap Cards below the Bar Chart */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100">
              {bootcampComparisonData.map((b) => (
                <div
                  key={b.id}
                  onClick={() => onSelectBootcampFilter?.(b.fullName)}
                  className="bg-slate-50/70 hover:bg-blue-50/40 border border-slate-100 hover:border-blue-200 rounded-2xl p-3.5 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-xs text-slate-800 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {b.fullName}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                      {b.fillRate}% Filled
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-200/80 rounded-full h-2 mb-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-emerald-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(b.fillRate, 100)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>
                      <strong className="text-slate-900">{b.totalReserved}</strong> / {b.maxSeats} spots reserved
                    </span>
                    <span className="text-emerald-600 font-semibold font-mono">
                      ${b.revenue.toLocaleString()} verified
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CHART 2: Timeline Enrollment Trends (Area Chart) */}
        {(chartView === "all" || chartView === "trends") && (
          <div
            className={`${
              chartView === "trends" ? "lg:col-span-12" : "lg:col-span-5"
            } bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col`}
            id="enrollment-trends-card"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block">
                  Cumulative Velocity
                </span>
                <h4 className="text-base font-bold text-slate-900 mt-0.5">
                  Spot Reservations Timeline
                </h4>
              </div>
              <div className="flex items-center space-x-1 text-xs font-bold text-slate-600">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                <span>{timelineTrendData.length} Milestone points</span>
              </div>
            </div>

            {/* Recharts AreaChart */}
            <div className="w-full h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={timelineTrendData}
                  margin={{ top: 15, right: 15, left: -15, bottom: 5 }}
                >
                  <defs>
                    <linearGradient id="totalSpotsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="paidSpotsGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="dateLabel"
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    axisLine={{ stroke: "#e2e8f0" }}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fill: "#64748b", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomAreaTooltip />} />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    iconType="circle"
                    wrapperStyle={{ paddingBottom: "12px", fontSize: "12px", fontWeight: 600 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="total"
                    name="Cumulative Total"
                    stroke="#2563eb"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#totalSpotsGrad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="paid"
                    name="Paid Students"
                    stroke="#059669"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#paidSpotsGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Quick KPI stats summary below Area Chart */}
            <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100">
              <div className="bg-slate-50 p-3 rounded-2xl text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  Payment Conversion
                </span>
                <span className="text-xl font-extrabold text-slate-900 block mt-0.5">
                  {totalSpots > 0 ? `${Math.round((totalPaid / totalSpots) * 100)}%` : "0%"}
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold">
                  {totalPaid} of {totalSpots} paid
                </span>
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  Audited Revenue
                </span>
                <span className="text-xl font-extrabold text-emerald-600 font-mono block mt-0.5">
                  ${totalPotentialRevenue.toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-500 font-semibold">
                  from confirmed spots
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Custom Tooltip for Bar Chart
function CustomBarTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-950 text-white rounded-2xl p-3.5 shadow-xl border border-slate-800 text-xs font-sans max-w-xs z-50">
        <p className="font-extrabold text-slate-100 text-sm mb-2 border-b border-slate-800 pb-1">
          {data.fullName}
        </p>
        <div className="space-y-1 text-slate-300">
          <div className="flex items-center justify-between space-x-3">
            <span className="flex items-center space-x-1 text-blue-400">
              <span className="h-2 w-2 rounded-full bg-blue-400 inline-block" />
              <span>Total Reserved:</span>
            </span>
            <span className="font-bold text-white font-mono">{data.totalReserved} spots</span>
          </div>

          <div className="flex items-center justify-between space-x-3">
            <span className="flex items-center space-x-1 text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 inline-block" />
              <span>Paid & Confirmed:</span>
            </span>
            <span className="font-bold text-emerald-300 font-mono">{data.paid} students</span>
          </div>

          <div className="flex items-center justify-between space-x-3">
            <span className="flex items-center space-x-1 text-amber-400">
              <span className="h-2 w-2 rounded-full bg-amber-400 inline-block" />
              <span>Pending Payment:</span>
            </span>
            <span className="font-bold text-amber-300 font-mono">{data.pending} students</span>
          </div>

          <div className="pt-2 mt-2 border-t border-slate-800/80 flex items-center justify-between text-slate-400">
            <span>Cohort Capacity:</span>
            <span className="text-white font-mono">{data.fillRate}% ({data.totalReserved}/{data.maxSeats})</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
}

// Custom Tooltip for Area Chart
function CustomAreaTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-950 text-white rounded-2xl p-3.5 shadow-xl border border-slate-800 text-xs font-sans max-w-xs z-50">
        <p className="font-bold text-slate-300 text-xs mb-1.5 flex items-center space-x-1">
          <Calendar className="h-3 w-3 text-blue-400" />
          <span>Timeline Date: {data.dateLabel}</span>
        </p>
        <div className="space-y-1 text-slate-300">
          <div className="flex items-center justify-between space-x-3">
            <span className="text-blue-400 font-semibold">Cumulative Spots:</span>
            <span className="font-bold text-white font-mono">{data.total}</span>
          </div>
          <div className="flex items-center justify-between space-x-3">
            <span className="text-emerald-400 font-semibold">Verified Paid:</span>
            <span className="font-bold text-emerald-300 font-mono">{data.paid}</span>
          </div>
          <div className="flex items-center justify-between space-x-3">
            <span className="text-amber-400 font-semibold">Pending Audits:</span>
            <span className="font-bold text-amber-300 font-mono">{data.pending}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
}
