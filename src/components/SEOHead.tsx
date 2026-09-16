import React, { useEffect } from "react";
import { useRouter } from "../router";
import { Course, Bootcamp, Blog } from "../types";

interface SEOHeadProps {
  course?: Course | null;
  bootcamp?: Bootcamp | null;
  blog?: Blog | null;
}

export const SEOHead: React.FC<SEOHeadProps> = ({ course, bootcamp, blog }) => {
  const { path } = useRouter();

  useEffect(() => {
    let title = "Decentralized University | Learn Next.js 15 & Web3 by Umair Riaz";
    let description = "Premium educational platform for Next.js and Decentralized technologies, founded by expert instructor Umair Riaz. Features interactive video lessons, AI Tutor, courses, bootcamps, and developer deep-dives.";
    let ogType = "website";
    let jsonLd: Record<string, any> | null = null;

    if (course) {
      title = `${course.title} | Decentralized University`;
      description = course.description;
      ogType = "article";
      jsonLd = {
        "@context": "https://schema.org",
        "@type": "Course",
        name: course.title,
        description: course.description,
        provider: {
          "@type": "Organization",
          name: "Decentralized University",
          sameAs: window.location.origin,
        },
        instructor: {
          "@type": "Person",
          name: course.instructor || "Umair Riaz",
          jobTitle: "Founder & Lead Web3 Instructor",
        },
        timeRequired: course.duration,
        educationalCredentialAwarded: "Course Completion Certificate",
        courseCode: course.id,
      };
    } else if (bootcamp) {
      title = `${bootcamp.title} | Immersive Bootcamp`;
      description = bootcamp.description;
      ogType = "article";
      jsonLd = {
        "@context": "https://schema.org",
        "@type": "EducationalOccupationalProgram",
        name: bootcamp.title,
        description: bootcamp.description,
        provider: {
          "@type": "EducationalOrganization",
          name: "Decentralized University",
          url: window.location.origin,
        },
        timeToComplete: bootcamp.duration,
        startDate: bootcamp.startDate,
        offers: {
          "@type": "Offer",
          price: bootcamp.price.replace(/[^0-9.]/g, ""),
          priceCurrency: "USD",
        },
      };
    } else if (blog) {
      title = `${blog.title} | Tech Deep-Dives`;
      description = blog.excerpt;
      ogType = "article";
      jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: blog.title,
        description: blog.excerpt,
        author: {
          "@type": "Person",
          name: blog.author.name,
        },
        datePublished: blog.publishedAt,
      };
    } else if (path === "/courses") {
      title = "All Courses & Syllabi | Decentralized University";
      description = "Browse high-level full-stack Next.js 15, Solidity smart contract, and Web3 frontend courses taught by Umair Riaz.";
    } else if (path === "/bootcamps") {
      title = "Web3 & Next.js Bootcamps | Live Mentorship by Umair Riaz";
      description = "Cohort-based immersive bootcamps with 1-on-1 mentorship, audit portfolios, and Web3 career acceleration.";
    } else if (path.startsWith("/video-lessons") || path.startsWith("/lessons")) {
      title = "Interactive Video Lessons & Code Lab | Decentralized University";
      description = "Watch structured video modules, take chapter quizzes, and practice with our built-in Web3 code lab and Gemini AI Tutor.";
    } else if (path.startsWith("/instructor")) {
      title = "Umair Riaz - Blockchain Developer & Next.js Instructor | Decentralized University";
      description = "Meet Umair Riaz, founder of Decentralized University and SecondaryDAO architect. Learn about his career and curriculum.";
    } else if (path.startsWith("/blogs")) {
      title = "Web3 & Next.js Tech Deep-Dives | Decentralized University";
      description = "In-depth engineering articles on Next.js 15 caching, Solidity reentrancy defenses, and tokenomics architecture.";
    } else if (path.startsWith("/access-status") || path.startsWith("/check-access")) {
      title = "Check Enrollment & Access Status | Decentralized University";
      description = "Verify your bootcamp reservation, payment approval status, and retrieve your student course access code.";
    } else if (path.startsWith("/login")) {
      title = "Student & Faculty Login | Decentralized University";
      description = "Log into your student account or instructor portal with your credentials stored securely in MongoDB.";
    } else if (path.startsWith("/register")) {
      title = "Create Student Account | Decentralized University";
      description = "Register for Decentralized University to enroll in courses, join bootcamps, and save lesson progress.";
    } else if (path.startsWith("/admin")) {
      title = "Lead Instructor Management Portal | Decentralized University";
      description = "Manage student applications, issue access codes, and monitor MongoDB Atlas database connectivity.";
    }

    // Update document title
    document.title = title;

    // Update or create meta tags
    const updateMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    updateMeta("description", description);
    updateMeta("og:title", title, true);
    updateMeta("og:description", description, true);
    updateMeta("og:url", window.location.href, true);
    updateMeta("og:type", ogType, true);

    // Canonical link tag
    let canonical = document.querySelector("link[rel='canonical']");
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", window.location.href);

    // JSON-LD Script tag
    let scriptTag = document.getElementById("seo-jsonld");
    if (jsonLd) {
      if (!scriptTag) {
        scriptTag = document.createElement("script");
        scriptTag.id = "seo-jsonld";
        scriptTag.setAttribute("type", "application/ld+json");
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(jsonLd);
    } else if (scriptTag) {
      scriptTag.remove();
    }
  }, [path, course, bootcamp, blog]);

  return null;
};
