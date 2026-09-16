import React from "react";
import { Course } from "../types";
import { BookOpen, Star, Users, ArrowRight, Award, ExternalLink } from "lucide-react";
import { Link } from "../router";

interface CoursesListProps {
  courses: Course[];
  onSelectCourse: (courseId: string) => void;
}

export default function CoursesList({ courses, onSelectCourse }: CoursesListProps) {
  return (
    <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="courses-section">
      {/* Grid Headers */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12 gap-4 text-left">
        <div>
          <span className="text-blue-600 text-xs sm:text-sm font-bold uppercase tracking-widest">
            Curriculum
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 mt-1.5">
            Premium Blockchain & Web3 Courses
          </h2>
          <p className="text-slate-500 text-sm sm:text-base mt-2 max-w-xl">
            Participate in interactive, structured code reviews and perform mock smart contract audits. Graduate with a co-authored certified audit portfolio.          </p>
        </div>
        <div className="flex items-center space-x-2 shrink-0">
          <Award className="h-5 w-5 text-blue-600" />
          <span className="text-sm font-semibold text-slate-700 bg-slate-100 px-3.5 py-1.5 rounded-full">
            All Led By Umair Riaz
          </span>
        </div>
      </div>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8" id="courses-grid">
        {courses.map((course) => (
          <div
            key={course.id}
            id={`course-card-${course.id}`}
            className="flex flex-col justify-between bg-white border border-slate-100 rounded-2xl p-6 sm:p-8 hover:border-blue-500/20 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 group text-left"
          >
            <div>
              {/* Header Metadata */}
              <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
                <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${course.difficulty === "Advanced"
                  ? "bg-rose-50 text-rose-600"
                  : course.difficulty === "Intermediate"
                    ? "bg-amber-50 text-amber-600"
                    : "bg-emerald-50 text-emerald-600"
                  }`}>
                  {course.difficulty}
                </span>
                <span className="text-xs text-slate-400 font-medium font-mono">{course.duration}</span>
              </div>

              {/* Title & Description */}
              {/* <Link 
                href={`/courses/${course.id}`} 
                className="hover:underline">
                  {course.title}
                </Link> */}
              <h3 className="font-display font-extrabold text-xl sm:text-2xl text-slate-900 group-hover:text-blue-600 transition-colors duration-200">
                {course.title}
              </h3>
              <p className="text-slate-500 text-sm sm:text-base mt-3 leading-relaxed">
                {course.description}
              </p>

              {/* Technologies Tags */}
              <div className="flex flex-wrap gap-2 mt-5">
                {course.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-slate-50 border border-slate-100 text-slate-600 text-xs font-semibold px-2.5 py-1 rounded-lg"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Actions and Stats */}
            <div className="mt-8 pt-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center space-x-4 text-xs font-semibold text-slate-500">
                <div className="flex items-center space-x-1">
                  <BookOpen className="h-4 w-4 text-slate-400 shrink-0" />
                  <span>{course.lessonsCount} Chapters</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4 text-slate-400 shrink-0" />
                  <span>{course.enrolledStudents} Students</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-amber-400 shrink-0 fill-amber-400" />
                  <span className="text-slate-800">{course.rating}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                {/* <Link
                  href={`/courses/${course.id}`}
                  className="inline-flex items-center justify-center space-x-1 border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-600 font-bold px-3 py-2 rounded-xl text-xs transition-all cursor-pointer"
                >
                  <span>Syllabus</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link> */}
                <button
                  onClick={() => onSelectCourse(course.id)}
                  className="inline-flex items-center justify-center space-x-2 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white font-bold px-4 py-2 rounded-xl text-xs sm:text-sm transition-all duration-300 group cursor-pointer"
                  id={`start-course-${course.id}`}
                >
                  <span>Apply</span>
                  <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                </button>

                {/* <Link href={`/courses/${course.id}`} className="hover:underline">
                  {course.title}
                </Link> */}

                {/* <button
                  onClick={() => onApply(bootcamp.title)}
                  className=" inline-flex items-center justify-center space-x-2 bg-slate-900 hover:bg-blue-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-md transition-all duration-300 group cursor-pointer"
                  id={`apply-bootcamp-${bootcamp.id}`}
                >
                  <span>Reserve My Spot</span>
                  <ArrowUpRight className="h-4.5 w-4.5 transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                </button> */}

              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
