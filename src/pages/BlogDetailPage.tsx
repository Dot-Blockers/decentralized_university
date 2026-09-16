import React, { useState, useEffect } from "react";
import { Blog } from "../types";
import { ArrowLeft, Clock, Calendar, Share2, Check, Sparkles, BookOpen } from "lucide-react";
import { useRouter, Link } from "../router";
import { SEOHead } from "../components/SEOHead";

interface BlogDetailPageProps {
  blogId: string;
  blogs: Blog[];
}

export default function BlogDetailPage({ blogId, blogs }: BlogDetailPageProps) {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const found = blogs.find((b) => b.id === blogId);
    if (found) {
      setBlog(found);
    }
  }, [blogId, blogs]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (!blog) {
    return (
      <div className="py-20 text-center">
        <p className="text-slate-500 text-sm">Loading article...</p>
        <Link href="/blogs" className="mt-4 inline-flex items-center space-x-1 text-sm font-bold text-blue-600">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Tech Deep-Dives</span>
        </Link>
      </div>
    );
  }

  return (
    <article className="py-8 sm:py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-left">
      <SEOHead blog={blog} />

      {/* Breadcrumb Navigation for SEO */}
      <nav className="flex items-center space-x-2 text-xs font-semibold text-slate-400 mb-6" aria-label="Breadcrumb">
        <Link href="/blogs" className="hover:text-blue-600 transition-colors">Tech Deep-Dives</Link>
        <span>/</span>
        <span className="text-slate-700 truncate">{blog.title}</span>
      </nav>

      {/* Header Container */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-10 shadow-xl shadow-slate-200/40 mb-8">
        <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
          <div className="flex items-center space-x-3 text-xs font-semibold text-slate-500">
            <span className="flex items-center space-x-1">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              <span>{blog.publishedAt}</span>
            </span>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              <span>{blog.readTime}</span>
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
                <span>Share Article</span>
              </>
            )}
          </button>
        </div>

        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-slate-900 tracking-tight leading-tight">
          {blog.title}
        </h1>

        <p className="text-slate-600 text-base sm:text-lg mt-4 leading-relaxed font-medium">
          {blog.excerpt}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mt-6">
          {blog.tags.map((tag, idx) => (
            <span
              key={idx}
              className="bg-blue-50/70 text-blue-700 text-xs font-semibold px-3 py-1 rounded-lg border border-blue-100/40"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Author Bio */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center space-x-4">
          <div className="h-12 w-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
            UR
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">{blog.author.name}</h3>
            <span className="text-xs text-slate-500">{blog.author.role}</span>
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-10 shadow-sm leading-relaxed text-slate-700 text-base space-y-6">
        <p className="text-lg leading-relaxed text-slate-800 font-normal">
          {blog.content}
        </p>

        <div className="p-5 bg-blue-50/60 rounded-2xl border border-blue-100/60">
          <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 mb-2 flex items-center space-x-1.5">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <span>Interactive Learning Notice</span>
          </h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Want to test this in practice? Try our interactive video lessons and browser-based coding lab with AI tutor guidance.
          </p>
          <div className="mt-3">
            <Link
              href="/video-lessons"
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 underline"
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>Launch Interactive Lessons</span>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
