import React, { useState, useEffect } from "react";
import { Plus, Trash2, Calendar, Users, DollarSign, Clock, AlertCircle, X, BookmarkCheck } from "lucide-react";
import { Bootcamp } from "../types";

interface AdminBootcampManagerProps {
  getAuthHeaders: () => Record<string, string>;
  onBootcampsUpdated?: () => void;
}

export default function AdminBootcampManager({ getAuthHeaders, onBootcampsUpdated }: AdminBootcampManagerProps) {
  const [bootcamps, setBootcamps] = useState<Bootcamp[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("8 Weeks");
  const [startDate, setStartDate] = useState("June 1, 2026");
  const [schedule, setSchedule] = useState("Tue, Thu (6 PM - 8 PM UTC)");
  const [price, setPrice] = useState("$1,200");
  const [maxSeats, setMaxSeats] = useState("25");
  const [techTagsStr, setTechTagsStr] = useState("Next.js 15, Solidity, Ethers.js, Wagmi");
  const [highlightsStr, setHighlightsStr] = useState("1-on-1 Code Mentorship with Umair Riaz, Capstone Security Audit Portfolio");

  const fetchBootcamps = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/bootcamps");
      if (res.ok) {
        const data = await res.json();
        setBootcamps(data.bootcamps || []);
      }
    } catch (err: any) {
      console.error(err);
      setError("Failed to fetch bootcamps.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBootcamps();
  }, []);

  const handleCreateBootcamp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setSubmitting(true);
    setError(null);

    const techTags = techTagsStr.split(",").map((t) => t.trim()).filter(Boolean);
    const highlights = highlightsStr.split(",").map((h) => h.trim()).filter(Boolean);

    try {
      const headers = getAuthHeaders();
      const res = await fetch("/api/bootcamps", {
        method: "POST",
        headers,
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          duration: duration.trim(),
          startDate: startDate.trim(),
          schedule: schedule.trim(),
          price: price.trim(),
          maxSeats: Number(maxSeats) || 25,
          techTags,
          highlights,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setShowCreateModal(false);
        // Reset form
        setTitle("");
        setDescription("");
        setDuration("8 Weeks");
        setStartDate("June 1, 2026");
        setSchedule("Tue, Thu (6 PM - 8 PM UTC)");
        setPrice("$1,200");
        setMaxSeats("25");
        await fetchBootcamps();
        if (onBootcampsUpdated) onBootcampsUpdated();
      } else {
        setError(data.error || "Failed to create bootcamp.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to submit bootcamp.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBootcamp = async (id: string, bootcampTitle: string) => {
    if (!confirm(`Are you sure you want to delete bootcamp "${bootcampTitle}"?`)) return;

    try {
      const headers = getAuthHeaders();
      const res = await fetch(`/api/bootcamps/${id}`, {
        method: "DELETE",
        headers,
      });
      if (res.ok) {
        await fetchBootcamps();
        if (onBootcampsUpdated) onBootcampsUpdated();
      } else {
        const data = await res.json();
        alert(data.error || "Delete failed");
      }
    } catch (err: any) {
      alert("Error deleting bootcamp: " + err.message);
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
        <div>
          <h3 className="font-display font-extrabold text-lg text-slate-900">
            Immersive Bootcamps Management ({bootcamps.length})
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Create, manage cohorts, tuition pricing, and schedules stored directly in MongoDB.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-500/10 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Create New Bootcamp</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center space-x-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Bootcamps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bootcamps.map((b) => (
          <div
            key={b.id}
            className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs hover:border-blue-200 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700">
                  {b.duration} Cohort
                </span>

                <button
                  onClick={() => handleDeleteBootcamp(b.id, b.title)}
                  className="text-slate-400 hover:text-rose-600 p-1 rounded-lg transition-colors cursor-pointer"
                  title="Delete Bootcamp"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <h4 className="font-display font-bold text-base text-slate-900 leading-snug">
                {b.title}
              </h4>
              <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                {b.description}
              </p>

              <div className="flex flex-wrap gap-1.5 mt-3">
                {b.techTags.map((tech, idx) => (
                  <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="font-bold text-slate-900 text-sm">{b.price}</span>
              <span className="flex items-center space-x-1">
                <Calendar className="h-3.5 w-3.5" />
                <span>{b.startDate}</span>
              </span>
              <span>{b.maxSeats} Seats Max</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Create Bootcamp */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 text-left max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Calendar className="h-4 w-4" />
                </div>
                <h3 className="text-lg font-display font-extrabold text-slate-900">
                  Add New Immersive Bootcamp
                </h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBootcamp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Bootcamp Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Next.js 15 & Solidity Elite Fellowship"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Bootcamp Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Live cohort with 1-on-1 mentorship, comprehensive smart contract auditing..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="8 Weeks"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Tuition Price
                  </label>
                  <input
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="$1,200"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Start Date
                  </label>
                  <input
                    type="text"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    placeholder="June 1, 2026"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Max Seat Capacity
                  </label>
                  <input
                    type="number"
                    value={maxSeats}
                    onChange={(e) => setMaxSeats(e.target.value)}
                    placeholder="25"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Schedule (Days & Times)
                </label>
                <input
                  type="text"
                  value={schedule}
                  onChange={(e) => setSchedule(e.target.value)}
                  placeholder="Tue, Thu (6 PM - 8 PM UTC)"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Tech Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={techTagsStr}
                  onChange={(e) => setTechTagsStr(e.target.value)}
                  placeholder="Next.js 15, Solidity, Foundry, Wagmi"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Highlights (comma separated)
                </label>
                <input
                  type="text"
                  value={highlightsStr}
                  onChange={(e) => setHighlightsStr(e.target.value)}
                  placeholder="1-on-1 Mentorship with Umair Riaz, Capstone Audit Report"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900"
                />
              </div>

              <div className="pt-4 flex items-center justify-end space-x-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? "Saving to MongoDB..." : "Create Bootcamp"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
