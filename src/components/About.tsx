"use client";

import { Code2, Rocket, Users, Zap, LucideIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useEffect, useRef, useState, useCallback } from "react";

export interface AboutHighlight {
  icon: string;
  title: string;
  description: string;
}

export interface AboutProps {
  section_title: string;
  section_subtitle: string;
  section_description: string;
  journey_title: string;
  journey_paragraphs: string[];
  highlights: AboutHighlight[];
}

const iconMap: Record<string, LucideIcon> = {
  Code2,
  Rocket,
  Users,
  Zap,
};

/* ─── Intersection-observer hook ─────────────────────────────────────── */
function useReveal(threshold = 0.15) {
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

/* ─── Carousel ────────────────────────────────────────────────────────── */
function HighlightCarousel({ highlights }: { highlights: AboutHighlight[] }) {
  const [active, setActive] = useState(0);
  const [animDir, setAnimDir] = useState<"left" | "right">("right");
  const [animating, setAnimating] = useState(false);
  const total = highlights.length;
  const autoRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const go = useCallback(
    (next: number, dir: "left" | "right") => {
      if (animating) return;
      setAnimDir(dir);
      setAnimating(true);
      setTimeout(() => {
        setActive((next + total) % total);
        setAnimating(false);
      }, 320);
    },
    [animating, total]
  );

  const prev = () => go(active - 1, "left");
  const next = () => go(active + 1, "right");

  /* auto-advance */
  useEffect(() => {
    autoRef.current = setTimeout(() => go(active + 1, "right"), 4000);
    return () => { if (autoRef.current) clearTimeout(autoRef.current); };
  }, [active, go]);

  const highlight = highlights[active];
  const Icon = iconMap[highlight.icon] || null;

  return (
    <div className="carousel-shell relative flex flex-col items-center gap-6 select-none">

      {/* ── Card track ── */}
      <div className="relative w-full overflow-hidden rounded-3xl" style={{ minHeight: 260 }}>
        {/* ghost cards left */}
        <div className="carousel-ghost carousel-ghost-left pointer-events-none">
          {(() => {
            const g = highlights[(active - 1 + total) % total];
            const GIcon = iconMap[g.icon] || null;
            return (
              <div className="ghost-card">
                {GIcon && <GIcon className="h-8 w-8 text-indigo-300 mx-auto mb-3" />}
                <p className="font-semibold text-slate-700 text-sm">{g.title}</p>
              </div>
            );
          })()}
        </div>

        {/* ghost cards right */}
        <div className="carousel-ghost carousel-ghost-right pointer-events-none">
          {(() => {
            const g = highlights[(active + 1) % total];
            const GIcon = iconMap[g.icon] || null;
            return (
              <div className="ghost-card">
                {GIcon && <GIcon className="h-8 w-8 text-indigo-300 mx-auto mb-3" />}
                <p className="font-semibold text-slate-700 text-sm">{g.title}</p>
              </div>
            );
          })()}
        </div>

        {/* active card */}
        <div
          key={active}
          className={`active-card ${animating ? (animDir === "right" ? "slide-in-right" : "slide-in-left") : ""}`}
        >
          {/* white card body */}
          <div className="active-card-inner">
            <div className="icon-bubble">
              {Icon && <Icon className="h-9 w-9 text-indigo-600" />}
            </div>
            <h4 className="text-xl font-bold text-slate-900 mb-3">{highlight.title}</h4>
            <p className="text-slate-500 leading-relaxed text-sm max-w-xs mx-auto">
              {highlight.description}
            </p>
          </div>

          {/* shimmer */}
          <div className="card-shimmer" />
        </div>
      </div>

      {/* ── Controls ── */}
      <div className="flex items-center gap-6">
        <button onClick={prev} className="carousel-btn" aria-label="Previous">
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Dots */}
        <div className="flex gap-2">
          {highlights.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i, i > active ? "right" : "left")}
              aria-label={`Go to slide ${i + 1}`}
              className={`dot ${i === active ? "dot-active" : ""}`}
            />
          ))}
        </div>

        <button onClick={next} className="carousel-btn" aria-label="Next">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <style>{`
        /* ── Shell ── */
        .carousel-shell { width: 100%; }

        /* ── Ghost cards ── */
        .carousel-ghost {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 0;
          width: 160px;
        }
        .carousel-ghost-left  { left: -20px; }
        .carousel-ghost-right { right: -20px; }
        .ghost-card {
          background: #fff;
          border-radius: 16px;
          padding: 20px 12px;
          text-align: center;
          box-shadow: 0 4px 24px rgba(0,0,0,0.06);
          opacity: 0.45;
          transform: scale(0.88);
          filter: blur(1px);
        }

        /* ── Active card ── */
        .active-card {
          position: relative;
          z-index: 10;
          margin: 0 100px;
          border-radius: 28px;
          overflow: hidden;
          background: #fff;
          box-shadow:
            0 0 0 1px rgba(99,102,241,0.08),
            0 20px 60px rgba(99,102,241,0.12),
            0 4px 16px rgba(0,0,0,0.06);
          animation: cardPop 0.5s cubic-bezier(.22,1,.36,1) both;
        }
        @keyframes cardPop {
          from { opacity:0; transform: scale(0.94) translateY(12px); }
          to   { opacity:1; transform: scale(1) translateY(0); }
        }

        .active-card-inner {
          position: relative;
          z-index: 2;
          padding: 44px 36px 40px;
          text-align: center;
        }

        /* shimmer sweep */
        .card-shimmer {
          position: absolute;
          inset: 0;
          z-index: 1;
          background: linear-gradient(
            105deg,
            transparent 40%,
            rgba(255,255,255,0.55) 50%,
            transparent 60%
          );
          background-size: 200% 100%;
          animation: shimmerSweep 3.5s ease-in-out infinite;
        }
        @keyframes shimmerSweep {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        /* ── Icon bubble ── */
        .icon-bubble {
          width: 64px; height: 64px;
          border-radius: 18px;
          background: linear-gradient(135deg, #eef2ff, #e0e7ff);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 20px;
          box-shadow: 0 4px 16px rgba(99,102,241,0.15);
        }

        /* ── Slide transitions ── */
        .slide-in-right { animation: slideInRight 0.32s cubic-bezier(.22,1,.36,1) both; }
        .slide-in-left  { animation: slideInLeft  0.32s cubic-bezier(.22,1,.36,1) both; }
        @keyframes slideInRight {
          from { opacity:0; transform: translateX(60px) scale(0.96); }
          to   { opacity:1; transform: translateX(0)    scale(1); }
        }
        @keyframes slideInLeft {
          from { opacity:0; transform: translateX(-60px) scale(0.96); }
          to   { opacity:1; transform: translateX(0)     scale(1); }
        }

        /* ── Controls ── */
        .carousel-btn {
          width: 40px; height: 40px;
          border-radius: 50%;
          background: #fff;
          border: 1px solid #e2e8f0;
          display: flex; align-items: center; justify-content: center;
          color: #6366f1;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          transition: all 0.2s;
          cursor: pointer;
        }
        .carousel-btn:hover {
          background: #6366f1; color: #fff;
          box-shadow: 0 4px 16px rgba(99,102,241,0.35);
          transform: scale(1.08);
        }

        .dot {
          width: 8px; height: 8px;
          border-radius: 9999px;
          background: #cbd5e1;
          transition: all 0.3s;
          cursor: pointer;
          border: none;
          padding: 0;
        }
        .dot-active {
          width: 24px;
          background: #6366f1;
          box-shadow: 0 0 8px rgba(99,102,241,0.45);
        }
      `}</style>
    </div>
  );
}

/* ─── Main About component ───────────────────────────────────────────── */
export function About({
  section_title,
  section_subtitle,
  section_description,
  journey_title,
  journey_paragraphs,
  highlights,
}: AboutProps) {
  const { ref: sectionRef, visible } = useReveal(0.1);

  return (
    <section
      ref={sectionRef as React.Ref<HTMLElement>}
      id="about"
      className="relative py-28 bg-[#f8fafc] overflow-hidden"
    >
      {/* Subtle background decoration */}
      <div className="about-bg-orb about-bg-orb-1" />
      <div className="about-bg-orb about-bg-orb-2" />

      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">

          {/* ── Header ── */}
          <div className={`text-center mb-20 reveal-block ${visible ? "revealed" : ""}`} style={{ transitionDelay: "0ms" }}>
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

          {/* ── Two-column layout ── */}
          <div className="grid md:grid-cols-2 gap-16 items-center">

            {/* Journey text */}
            <div className={`reveal-block ${visible ? "revealed" : ""}`} style={{ transitionDelay: "120ms" }}>
              <div className="about-divider" />
              <h3 className="text-2xl font-bold mb-7 text-slate-900">{journey_title}</h3>
              {journey_paragraphs.map((p, i) => (
                <p key={i} className="text-slate-500 leading-relaxed mb-5 text-[15px]">{p}</p>
              ))}

              {/* Decorative stat chips */}
              <div className="flex flex-wrap gap-3 mt-8">
                {["Open Source", "Clean Code", "User-First", "Always Learning"].map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-semibold tracking-wide uppercase text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-full px-4 py-1.5"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Carousel */}
            <div className={`reveal-block ${visible ? "revealed" : ""}`} style={{ transitionDelay: "240ms" }}>
              <HighlightCarousel highlights={highlights} />
            </div>
          </div>
        </div>
      </div>

      {/* ── Wave transition → Skills (dark) ── */}
      <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none overflow-hidden leading-[0]">
        {/* Back wave — subtle indigo tint */}
        <svg
          viewBox="0 0 1440 100"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-[80px] md:h-[110px] about-wave-back"
          preserveAspectRatio="none"
        >
          <path
            d="M0,50 C360,100 1080,0 1440,50 L1440,100 L0,100 Z"
            fill="rgba(99,102,241,0.07)"
          />
        </svg>
        {/* Front wave — matches Skills bg #0a0a0f */}
        <svg
          viewBox="0 0 1440 80"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute bottom-0 w-full h-[65px] md:h-[85px] about-wave-front"
          preserveAspectRatio="none"
        >
          <path
            d="M0,30 C480,80 960,0 1440,40 L1440,80 L0,80 Z"
            fill="#0a0a0f"
          />
        </svg>
      </div>

      <style>{`
        /* Wave animations */
        .about-wave-back  { animation: aboutWaveSway 10s ease-in-out infinite; }
        .about-wave-front { animation: aboutWaveSway 7s ease-in-out infinite reverse; }
        @keyframes aboutWaveSway {
          0%, 100% { transform: translateX(0); }
          50%       { transform: translateX(-1.5%); }
        }

        /* Background orbs */
        .about-bg-orb {
          position: absolute;
          border-radius: 9999px;
          pointer-events: none;
        }
        .about-bg-orb-1 {
          width: 500px; height: 500px;
          top: -120px; right: -100px;
          background: radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%);
        }
        .about-bg-orb-2 {
          width: 400px; height: 400px;
          bottom: -80px; left: -80px;
          background: radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%);
        }

        /* Reveal animation */
        .reveal-block {
          opacity: 0;
          transform: translateY(36px);
          transition: opacity 0.75s cubic-bezier(.22,1,.36,1), transform 0.75s cubic-bezier(.22,1,.36,1);
        }
        .reveal-block.revealed {
          opacity: 1;
          transform: translateY(0);
        }

        /* Section divider accent */
        .about-divider {
          width: 48px; height: 4px;
          border-radius: 2px;
          background: linear-gradient(90deg, #6366f1, #8b5cf6);
          margin-bottom: 24px;
        }
      `}</style>
    </section>
  );
}