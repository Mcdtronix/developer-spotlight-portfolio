"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalLink, Github, Star, ChevronLeft, ChevronRight } from "lucide-react";

export interface Project {
  title: string;
  description: string;
  image?: string;
  tech: string[];
  github: string;
  live: string;
  featured: boolean;
}
export interface ProjectsProps {
  section_title: string;
  section_subtitle: string;
  section_description: string;
  view_all_url: string;
  projects: Project[];
}

/* ─── Intersection-observer reveal hook ─── */
function useReveal(threshold = 0.1) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

export function Projects({
  section_title,
  section_subtitle,
  section_description,
  view_all_url,
  projects,
}: ProjectsProps) {
  const { ref: sectionRef, visible } = useReveal(0.08);
  const [hovered, setHovered] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  
  const PROJECTS_PER_PAGE = 6; // 2 rows of 3 projects
  const totalPages = Math.ceil(projects.length / PROJECTS_PER_PAGE);
  const startIndex = (currentPage - 1) * PROJECTS_PER_PAGE;
  const endIndex = startIndex + PROJECTS_PER_PAGE;
  const currentProjects = projects.slice(startIndex, endIndex);

  return (
    <section
      ref={sectionRef as React.Ref<HTMLElement>}
      id="projects"
      className="relative py-32 bg-[#f1f5f9] overflow-hidden"
    >
      {/* ── Top wave receiver: Skills (#0a0a0f) → Projects (#f1f5f9) ── */}
      <div className="absolute top-0 left-0 right-0 z-20 pointer-events-none overflow-hidden leading-[0]">
        <svg
          viewBox="0 0 1440 110"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute top-0 w-full h-[90px] md:h-[120px] proj-wave-top-back"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 L1440,0 L1440,65 C1080,110 360,15 0,65 Z"
            fill="rgba(30,27,75,0.06)"
          />
        </svg>
        <svg
          viewBox="0 0 1440 90"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute top-0 w-full h-[75px] md:h-[100px] proj-wave-top-front"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 L1440,0 L1440,50 C960,95 480,5 0,55 Z"
            fill="#f1f5f9"
          />
        </svg>
      </div>

      {/* ── Subtle background texture ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            "radial-gradient(#6366f1 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Soft ambient orbs */}
      <div className="proj-ambient proj-ambient-1" />
      <div className="proj-ambient proj-ambient-2" />

      <div className="relative z-10 container mx-auto px-6">
        <div className="max-w-6xl mx-auto">

          {/* ── Header ── */}
          <div
            className={`text-center mb-20 proj-reveal ${visible ? "proj-revealed" : ""}`}
            style={{ transitionDelay: "0ms" }}
          >
            <span className="inline-block text-xs font-semibold tracking-[0.25em] uppercase text-indigo-500 bg-indigo-50 border border-indigo-100 rounded-full px-5 py-2 mb-5">
              {section_subtitle}
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-slate-900 tracking-tight leading-tight">
              {section_title}
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
              {section_description}
            </p>
          </div>

          {/* ── Project grid ── */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {currentProjects.map((project, index) => (
              <div
                key={startIndex + index}
                className={`proj-reveal ${visible ? "proj-revealed" : ""}`}
                style={{ transitionDelay: `${120 + index * 100}ms` }}
              >
                <div
                  className="proj-card"
                  onMouseEnter={() => setHovered(startIndex + index)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {/* ── Animated border ring ── */}
                  <div className={`proj-card-ring ${hovered === startIndex + index ? "proj-card-ring-active" : ""}`} />

                  {/* ── Image / placeholder ── */}
                  <div className="proj-image-wrap">
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={project.title}
                        className={`proj-image ${hovered === startIndex + index ? "proj-image-zoomed" : ""}`}
                      />
                    ) : (
                      <div className="proj-image-placeholder">
                        <div className="proj-placeholder-grid" />
                        <span className="proj-placeholder-initials">
                          {project.title.slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                    )}

                    {/* overlay gradient */}
                    <div className="proj-image-overlay" />

                    {/* Featured badge */}
                    {project.featured && (
                      <div className="proj-featured-badge">
                        <Star className="h-3 w-3 fill-current" />
                        Featured
                      </div>
                    )}

                    {/* Hover action strip */}
                    <div className={`proj-action-strip ${hovered === startIndex + index ? "proj-action-strip-visible" : ""}`}>
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="proj-action-btn"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Github className="h-4 w-4" />
                        <span>Code</span>
                      </a>
                      <div className="proj-action-divider" />
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="proj-action-btn"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span>Live Demo</span>
                      </a>
                    </div>
                  </div>

                  {/* ── Card body ── */}
                  <div className="proj-body">
                    <h3 className={`proj-title ${hovered === startIndex + index ? "proj-title-active" : ""}`}>
                      {project.title}
                    </h3>
                    <p className="proj-desc">{project.description}</p>

                    {/* Tech stack */}
                    <div className="flex flex-wrap gap-2 mt-4">
                      {project.tech.map((tech, ti) => (
                        <span
                          key={ti}
                          className="proj-tech-badge"
                          style={{
                            animationDelay: visible ? `${220 + (startIndex + index) * 100 + ti * 45}ms` : "0ms",
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>

                    {/* Footer links */}
                    <div className="proj-footer">
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="proj-footer-btn proj-footer-btn-outline"
                      >
                        <Github className="h-4 w-4" />
                        Code
                      </a>
                      <a
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="proj-footer-btn proj-footer-btn-solid"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Live Demo
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Pagination Controls ── */}
          {totalPages > 1 && (
            <div
              className={`flex justify-center items-center gap-4 mt-12 proj-reveal ${visible ? "proj-revealed" : ""}`}
              style={{ transitionDelay: `${120 + currentProjects.length * 100}ms` }}
            >
              {/* Previous Button */}
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-indigo-600 hover:bg-indigo-50 border border-gray-200 hover:border-indigo-300'
                }`}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>

              {/* Page Numbers */}
              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-10 h-10 rounded-lg font-medium transition-all duration-200 ${
                      currentPage === pageNum
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-white text-gray-700 hover:bg-indigo-50 border border-gray-200 hover:border-indigo-300'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              {/* Next Button */}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-indigo-600 hover:bg-indigo-50 border border-gray-200 hover:border-indigo-300'
                }`}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* ── View all CTA ── */}
          <div
            className={`text-center mt-14 proj-reveal ${visible ? "proj-revealed" : ""}`}
            style={{ transitionDelay: `${120 + projects.length * 100}ms` }}
          >
            <a
              href={view_all_url}
              target="_blank"
              rel="noopener noreferrer"
              className="proj-cta-btn"
            >
              <Github className="h-5 w-5" />
              View All Projects
            </a>
          </div>
        </div>
      </div>

      {/* ── Bottom wave: Projects (#f1f5f9) → Contact (#ffffff) ── */}
      <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none overflow-hidden leading-[0]">
        <svg
          viewBox="0 0 1440 110"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute bottom-0 w-full h-[90px] md:h-[115px] proj-wave-bot-back"
          preserveAspectRatio="none"
        >
          <path
            d="M0,55 C480,110 960,10 1440,65 L1440,110 L0,110 Z"
            fill="rgba(99,102,241,0.06)"
          />
        </svg>
        <svg
          viewBox="0 0 1440 90"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute bottom-0 w-full h-[70px] md:h-[95px] proj-wave-bot-front"
          preserveAspectRatio="none"
        >
          <path
            d="M0,40 C360,90 1080,0 1440,50 L1440,90 L0,90 Z"
            fill="#ffffff"
          />
        </svg>
      </div>

      <style>{`
        /* ── Ambient orbs ── */
        .proj-ambient {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(80px);
        }
        .proj-ambient-1 {
          width: 500px; height: 500px;
          top: -100px; right: -80px;
          background: radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%);
        }
        .proj-ambient-2 {
          width: 400px; height: 400px;
          bottom: -60px; left: -60px;
          background: radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%);
        }

        /* ── Wave animations ── */
        .proj-wave-top-back  { animation: projWaveSway 9s ease-in-out infinite; }
        .proj-wave-top-front { animation: projWaveSway 6.5s ease-in-out infinite reverse; }
        .proj-wave-bot-back  { animation: projBotSway 10s ease-in-out infinite; }
        .proj-wave-bot-front { animation: projBotSway 7s ease-in-out infinite reverse; }
        @keyframes projWaveSway {
          0%, 100% { transform: translateX(0); }
          50%       { transform: translateX(-1.5%); }
        }
        @keyframes projBotSway {
          0%, 100% { transform: translateX(0); }
          50%       { transform: translateX(1.5%); }
        }

        /* ── Scroll reveal ── */
        .proj-reveal {
          opacity: 0;
          transform: translateY(40px) rotateX(5deg);
          transform-origin: bottom center;
          transition:
            opacity 0.8s cubic-bezier(.22,1,.36,1),
            transform 0.8s cubic-bezier(.22,1,.36,1);
        }
        .proj-reveal.proj-revealed {
          opacity: 1;
          transform: translateY(0) rotateX(0deg);
        }

        /* ── Project card ── */
        .proj-card {
          position: relative;
          background: #fff;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid rgba(99,102,241,0.08);
          box-shadow:
            0 4px 24px rgba(0,0,0,0.06),
            0 1px 4px rgba(0,0,0,0.04);
          transition:
            transform 0.45s cubic-bezier(.22,1,.36,1),
            box-shadow 0.45s ease,
            border-color 0.3s ease;
        }
        .proj-card:hover {
          transform: translateY(-8px) scale(1.005);
          box-shadow:
            0 0 0 1px rgba(99,102,241,0.15),
            0 24px 60px rgba(99,102,241,0.13),
            0 8px 24px rgba(0,0,0,0.1);
          border-color: rgba(99,102,241,0.2);
        }

        /* Spinning conic border ring */
        .proj-card-ring {
          position: absolute;
          inset: -1px;
          border-radius: 20px;
          background: conic-gradient(
            from var(--proj-angle, 0deg),
            transparent 0deg,
            rgba(99,102,241,0.55) 60deg,
            transparent 120deg
          );
          opacity: 0;
          transition: opacity 0.4s ease;
          pointer-events: none;
          z-index: 0;
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: exclude;
          padding: 1px;
        }
        .proj-card-ring-active {
          opacity: 1;
          animation: projBorderSpin 3.5s linear infinite;
        }
        @property --proj-angle {
          syntax: "<angle>";
          initial-value: 0deg;
          inherits: false;
        }
        @keyframes projBorderSpin {
          to { --proj-angle: 360deg; }
        }

        /* ── Image area ── */
        .proj-image-wrap {
          position: relative;
          overflow: hidden;
          height: 220px;
        }
        .proj-image {
          width: 100%; height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(.22,1,.36,1);
        }
        .proj-image-zoomed { transform: scale(1.07); }
        .proj-image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            transparent 50%,
            rgba(15,23,42,0.25) 100%
          );
        }

        /* Image placeholder */
        .proj-image-placeholder {
          width: 100%; height: 100%;
          background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
          display: flex; align-items: center; justify-content: center;
          position: relative;
          overflow: hidden;
        }
        .proj-placeholder-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(99,102,241,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.08) 1px, transparent 1px);
          background-size: 32px 32px;
        }
        .proj-placeholder-initials {
          position: relative;
          font-size: 3rem;
          font-weight: 800;
          color: rgba(99,102,241,0.25);
          letter-spacing: -0.04em;
          z-index: 1;
        }

        /* Featured badge */
        .proj-featured-badge {
          position: absolute;
          top: 14px; left: 14px;
          display: flex; align-items: center; gap: 5px;
          font-size: 0.68rem; font-weight: 700;
          letter-spacing: 0.08em; text-transform: uppercase;
          padding: 5px 12px;
          background: rgba(99,102,241,0.9);
          color: #fff;
          border-radius: 999px;
          backdrop-filter: blur(6px);
          box-shadow: 0 4px 12px rgba(99,102,241,0.4);
          animation: badgePulse 3s ease-in-out infinite;
        }
        @keyframes badgePulse {
          0%, 100% { box-shadow: 0 4px 12px rgba(99,102,241,0.4); }
          50%       { box-shadow: 0 4px 24px rgba(99,102,241,0.7); }
        }

        /* Hover action strip */
        .proj-action-strip {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          display: flex; align-items: center; justify-content: center;
          gap: 0;
          padding: 12px;
          background: rgba(15,23,42,0.82);
          backdrop-filter: blur(8px);
          transform: translateY(100%);
          transition: transform 0.35s cubic-bezier(.22,1,.36,1);
        }
        .proj-action-strip-visible { transform: translateY(0); }
        .proj-action-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 8px 20px;
          font-size: 0.8rem; font-weight: 600;
          color: rgba(255,255,255,0.85);
          border-radius: 8px;
          transition: color 0.2s ease, background 0.2s ease;
          text-decoration: none;
        }
        .proj-action-btn:hover { color: #fff; background: rgba(255,255,255,0.1); }
        .proj-action-divider {
          width: 1px; height: 20px;
          background: rgba(255,255,255,0.15);
        }

        /* ── Card body ── */
        .proj-body { padding: 24px 24px 20px; }

        .proj-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 10px;
          letter-spacing: -0.02em;
          transition: color 0.3s ease;
        }
        .proj-title-active { color: #6366f1; }

        .proj-desc {
          font-size: 0.875rem;
          color: #64748b;
          line-height: 1.7;
        }

        /* Tech badges */
        .proj-tech-badge {
          display: inline-block;
          font-size: 0.68rem; font-weight: 600;
          padding: 3px 10px;
          border-radius: 999px;
          background: #f1f5f9;
          color: #6366f1;
          border: 1px solid #e0e7ff;
          opacity: 0;
          transform: translateY(6px) scale(0.9);
          transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
          animation: techReveal 0.45s cubic-bezier(.22,1,.36,1) forwards;
        }
        @keyframes techReveal {
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .proj-tech-badge:hover {
          background: #e0e7ff;
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 4px 10px rgba(99,102,241,0.15);
        }

        /* Footer buttons */
        .proj-footer {
          display: flex; gap: 10px;
          margin-top: 16px;
          padding-top: 16px;
          border-top: 1px solid #f1f5f9;
        }
        .proj-footer-btn {
          flex: 1;
          display: flex; align-items: center; justify-content: center; gap: 6px;
          padding: 8px 0;
          border-radius: 10px;
          font-size: 0.8rem; font-weight: 600;
          text-decoration: none;
          transition: all 0.25s ease;
        }
        .proj-footer-btn-outline {
          background: transparent;
          border: 1px solid #e2e8f0;
          color: #475569;
        }
        .proj-footer-btn-outline:hover {
          border-color: #6366f1;
          color: #6366f1;
          background: #eef2ff;
        }
        .proj-footer-btn-solid {
          background: #6366f1;
          color: #fff;
          border: 1px solid transparent;
          box-shadow: 0 4px 14px rgba(99,102,241,0.35);
        }
        .proj-footer-btn-solid:hover {
          background: #4f46e5;
          box-shadow: 0 6px 20px rgba(99,102,241,0.5);
          transform: translateY(-1px);
        }

        /* ── View all CTA ── */
        .proj-cta-btn {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 14px 32px;
          border-radius: 999px;
          background: #0f172a;
          color: #fff;
          font-size: 0.9rem; font-weight: 600;
          text-decoration: none;
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 4px 20px rgba(0,0,0,0.15);
          transition: all 0.3s ease;
        }
        .proj-cta-btn:hover {
          background: #1e293b;
          box-shadow: 0 8px 30px rgba(0,0,0,0.25);
          transform: translateY(-2px);
        }
      `}</style>
    </section>
  );
}