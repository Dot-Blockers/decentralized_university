import React, { useState } from "react";
import { Blog } from "../types";
import { Rss, Calendar, Clock, ArrowRight, UserCheck } from "lucide-react";

interface BlogsListProps {
  blogs: Blog[];
}

export default function BlogsList({ blogs }: BlogsListProps) {
  const [selectedBlogId, setSelectedBlogId] = useState<string | null>(null);

  return (
    <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" id="blogs-section">
      
      {/* Header Info */}
      <div className="text-left mb-10">
        <span className="text-blue-600 text-xs sm:text-sm font-bold uppercase tracking-widest">
          Knowledge Base
        </span>
        <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 mt-1">
          Technical Blogs & Web3 Deep-Dives
        </h2>
        <p className="text-slate-500 text-sm sm:text-base mt-2 max-w-xl">
          Get exclusive technical articles written by Umair Riaz detailing modern Web Router optimizations, smart contract audits, and zero-knowledge paradigms.
        </p>
      </div>

      {/* Blogs Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start" id="blogs-grid">
        
        {/* Left Hand: Blogs List - 5 cols */}
        <div className="lg:col-span-5 space-y-4" id="blogs-nav-column">
          {blogs.map((blog) => (
            <button
              key={blog.id}
              onClick={() => setSelectedBlogId(blog.id === selectedBlogId ? null : blog.id)}
              className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 cursor-pointer ${
                selectedBlogId === blog.id
                  ? "bg-white border-blue-500 shadow-lg shadow-blue-500/5"
                  : "bg-white border-slate-100 hover:border-slate-200"
              }`}
            >
              <div className="flex items-center space-x-2.5 text-slate-400 text-xs font-semibold mb-3">
                <Calendar className="h-4 w-4 shrink-0" />
                <span>{blog.publishedAt}</span>
                <span className="text-slate-200">•</span>
                <Clock className="h-4 w-4 shrink-0" />
                <span>{blog.readTime}</span>
              </div>
              <h3 className="font-display font-extrabold text-lg text-slate-900 leading-snug group-hover:text-blue-600">
                {blog.title}
              </h3>
              <p className="text-slate-500 text-xs sm:text-sm mt-2 line-clamp-2">
                {blog.excerpt}
              </p>
              <div className="flex items-center space-x-1.5 text-xs font-bold text-blue-600 mt-4">
                <span>{selectedBlogId === blog.id ? "Minimize Read" : "Read Full Deep-Dive"}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </button>
          ))}
        </div>

        {/* Right Hand: Full Blog Content Viewer - 7 cols */}
        <div className="lg:col-span-7" id="blog-viewer-column">
          {selectedBlogId ? (
            (() => {
              const currentBlog = blogs.find((b) => b.id === selectedBlogId);
              if (!currentBlog) return null;
              return (
                <article className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm text-left space-y-6">
                  {/* Article Metadata Header */}
                  <div className="space-y-3.5 pb-5 border-b border-slate-100">
                    <div className="flex flex-wrap gap-2">
                      {currentBlog.tags.map((tag, idx) => (
                        <span key={idx} className="bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 leading-tight">
                      {currentBlog.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-xs font-semibold text-slate-500">
                      <span className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                        <span>Published {currentBlog.publishedAt}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <Clock className="h-4 w-4 text-slate-400 shrink-0" />
                        <span>{currentBlog.readTime}</span>
                      </span>
                    </div>
                  </div>

                  {/* Body Text */}
                  <div className="text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line space-y-4">
                    {currentBlog.content}
                  </div>

                  {/* Instructor Author Signature Footer */}
                  <div className="pt-6 border-t border-slate-100 flex items-center space-x-3.5">
                    <div className="h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center shrink-0">
                      <UserCheck className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <span className="block font-bold text-slate-900 text-sm">{currentBlog.author.name}</span>
                      <span className="block text-slate-500 text-xs font-medium">{currentBlog.author.role}</span>
                    </div>
                  </div>
                </article>
              );
            })()
          ) : (
            <div className="bg-white border border-slate-100 border-dashed rounded-3xl p-12 text-center h-[340px] flex flex-col items-center justify-center">
              <Rss className="h-12 w-12 text-slate-300 stroke-[1.5]" />
              <h4 className="font-display font-bold text-lg text-slate-900 mt-4">Select a deep-dive article</h4>
              <p className="text-slate-400 text-xs sm:text-sm mt-2 max-w-sm">
                Click on any of the tech blog entries on the left side to load its fully verified technical contents here.
              </p>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
