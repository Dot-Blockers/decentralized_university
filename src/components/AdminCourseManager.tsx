import React, { useState, useEffect } from "react";
import { Plus, Trash2, BookOpen, Clock, Star, Users, CheckCircle2, AlertCircle, X, Sparkles } from "lucide-react";
import { Course } from "../types";

interface AdminCourseManagerProps {
  getAuthHeaders: () => Record<string, string>;
  onCoursesUpdated?: () => void;
}

export default function AdminCourseManager({ getAuthHeaders, onCoursesUpdated }: AdminCourseManagerProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("10 Hours");
  const [lessonsCount, setLessonsCount] = useState("12");
  const [difficulty, setDifficulty] = useState<"Beginner" | "Intermediate" | "Advanced">("Intermediate");
  const [tagsStr, setTagsStr] = useState("Next.js 15, Solidity, Web3");
  const [instructor, setInstructor] = useState("Umair Riaz");

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/courses");
      if (res.ok) {
        const data = await res.json();
        setCourses(data.courses || []);
      }
    } catch (err: any) {
      console.error(err);
      setError("Failed to fetch courses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    setSubmitting(true);
    setError(null);

    const tags = tagsStr.split(",").map((t) => t.trim()).filter(Boolean);

    try {
      const headers = getAuthHeaders();
      const res = await fetch("/api/courses", {
        method: "POST",
        headers,
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          duration: duration.trim(),
          lessonsCount: Number(lessonsCount) || 12,
          difficulty,
          tags,
          instructor: instructor.trim() || "Umair Riaz",
          enrolledStudents: 0,
          rating: 5.0,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setShowCreateModal(false);
        // Reset form
        setTitle("");
        setDescription("");
        setDuration("10 Hours");
        setLessonsCount("12");
        setTagsStr("Next.js 15, Solidity, Web3");
        await fetchCourses();
        if (onCoursesUpdated) onCoursesUpdated();
      } else {
        setError(data.error || "Failed to create course.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to submit course.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCourse = async (id: string, courseTitle: string) => {
    if (!confirm(`Are you sure you want to delete course "${courseTitle}"?`)) return;

    try {
      const headers = getAuthHeaders();
      const res = await fetch(`/api/courses/${id}`, {
        method: "DELETE",
        headers,
      });
      if (res.ok) {
        await fetchCourses();
        if (onCoursesUpdated) onCoursesUpdated();
      } else {
        const data = await res.json();
        alert(data.error || "Delete failed");
      }
    } catch (err: any) {
      alert("Error deleting course: " + err.message);
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-xs">
        <div>
          <h3 className="font-display font-extrabold text-lg text-slate-900">
            Course Syllabi Management ({courses.length})
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Create, update, or remove official courses stored directly in MongoDB.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-500/10 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Create New Course</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center space-x-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Courses List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs hover:border-blue-200 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  course.difficulty === "Advanced"
                    ? "bg-rose-50 text-rose-600"
                    : course.difficulty === "Intermediate"
                    ? "bg-amber-50 text-amber-600"
                    : "bg-emerald-50 text-emerald-600"
                }`}>
                  {course.difficulty}
                </span>

                <button
                  onClick={() => handleDeleteCourse(course.id, course.title)}
                  className="text-slate-400 hover:text-rose-600 p-1 rounded-lg transition-colors cursor-pointer"
                  title="Delete Course"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <h4 className="font-display font-bold text-base text-slate-900 leading-snug">
                {course.title}
              </h4>
              <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                {course.description}
              </p>

              <div className="flex flex-wrap gap-1.5 mt-3">
                {course.tags.map((t, idx) => (
                  <span key={idx} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center space-x-1">
                <Clock className="h-3.5 w-3.5" />
                <span>{course.duration}</span>
              </span>
              <span>{course.lessonsCount} Chapters</span>
              <span className="font-semibold text-slate-700">{course.instructor || "Umair Riaz"}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Create Course */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 text-left max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <BookOpen className="h-4 w-4" />
                </div>
                <h3 className="text-lg font-display font-extrabold text-slate-900">
                  Add New Course
                </h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Course Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Next.js 15 Server Actions & Wagmi Integration"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Course Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Deep dive into server actions, client cache, and on-chain ethers integration..."
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
                    placeholder="e.g. 14 Hours"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Lessons / Chapters
                  </label>
                  <input
                    type="number"
                    value={lessonsCount}
                    onChange={(e) => setLessonsCount(e.target.value)}
                    placeholder="16"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Difficulty Level
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e: any) => setDifficulty(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Instructor
                  </label>
                  <input
                    type="text"
                    value={instructor}
                    onChange={(e) => setInstructor(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={tagsStr}
                  onChange={(e) => setTagsStr(e.target.value)}
                  placeholder="Next.js 15, Solidity, Web3, Smart Contracts"
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
                  {submitting ? "Saving to MongoDB..." : "Create Course"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
