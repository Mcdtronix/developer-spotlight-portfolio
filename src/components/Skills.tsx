"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Monitor, Server, Database, Terminal, Wrench } from "lucide-react";
import { Badge } from "./ui/badge";

/* ─── Per-card accent palette ──────────────────────────────────────────
   Maps by index so it degrades gracefully for any number of categories.
─────────────────────────────────────────────────────────────────────── */
const CARD_ACCENTS = [
  {
    // Frontend — electric blue
    Icon: Monitor,
    iconColor: "#60a5fa",
    bubble: "rgba(96,165,250,0.12)",
    orb: "radial-gradient(circle, rgba(96,165,250,0.55) 0%, transparent 70%)",
    bar: "linear-gradient(90deg, #3b82f6, #60a5fa, #93c5fd)",
    ring: "rgba(96,165,250,0.7)",
    badgeHover: "rgba(59,130,246,0.28)",
  },
  {
    // Backend — violet
    Icon: Server,
    iconColor: "#a78bfa",
    bubble: "rgba(167,139,250,0.12)",
    orb: "radial-gradient(circle, rgba(139,92,246,0.55) 0%, transparent 70%)",
    bar: "linear-gradient(90deg, #7c3aed, #a78bfa, #c4b5fd)",
    ring: "rgba(167,139,250,0.7)",
    badgeHover: "rgba(124,58,237,0.28)",
  },
  {
    // Database — emerald
    Icon: Database,
    iconColor: "#34d399",
    bubble: "rgba(52,211,153,0.12)",
    orb: "radial-gradient(circle, rgba(16,185,129,0.55) 0%, transparent 70%)",
    bar: "linear-gradient(90deg, #059669, #34d399, #6ee7b7)",
    ring: "rgba(52,211,153,0.7)",
    badgeHover: "rgba(5,150,105,0.28)",
  },
  {
    // DevOps — amber
    Icon: Terminal,
    iconColor: "#fbbf24",
    bubble: "rgba(251,191,36,0.12)",
    orb: "radial-gradient(circle, rgba(245,158,11,0.5) 0%, transparent 70%)",
    bar: "linear-gradient(90deg, #d97706, #fbbf24, #fde68a)",
    ring: "rgba(251,191,36,0.7)",
    badgeHover: "rgba(217,119,6,0.28)",
  },
  {
    // Tools — rose
    Icon: Wrench,
    iconColor: "#f87171",
    bubble: "rgba(248,113,113,0.12)",
    orb: "radial-gradient(circle, rgba(239,68,68,0.5) 0%, transparent 70%)",
    bar: "linear-gradient(90deg, #dc2626, #f87171, #fca5a5)",
    ring: "rgba(248,113,113,0.7)",
    badgeHover: "rgba(220,38,38,0.28)",
  },
];

export interface SkillCategory {
  title: string;
  skills: string[];
  color: string;
}

export interface SkillsProps {
  section_title: string;
  section_subtitle: string;
  section_description: string;
  categories: SkillCategory[];
}

const SLIDES = [
  "before:bg-[radial-gradient(ellipse_80%_60%_at_20%_40%,#1e3a8a,transparent_60%)] bg-[radial-gradient(ellipse_60%_80%_at_80%_60%,#0f172a,#0a0a0f)]",
  "before:bg-[radial-gradient(circle_400px_at_75%_25%,rgba(251,146,60,0.18),transparent_65%)] bg-[radial-gradient(ellipse_90%_70%_at_60%_30%,#1a0533,#0a0a0f)]",
  "before:bg-[radial-gradient(ellipse_70%_50%_at_30%_60%,rgba(20,184,166,0.22),transparent_70%)] bg-[radial-gradient(ellipse_100%_60%_at_50%_0%,#042f2e,#0a0a0f)]",
  "before:bg-[radial-gradient(circle_450px_at_15%_50%,rgba(139,92,246,0.22),transparent_70%)] bg-[radial-gradient(ellipse_80%_70%_at_80%_20%,#1e0545,#0a0a0f)]",
];

const INTERVAL = 4500;

/* ─── Intersection-observer reveal hook ─── */
function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setVisible(true); obs.disconnect(); }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}

export function Skills({
  section_title,
  section_subtitle,
  section_description,
  categories,
}: SkillsProps) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { ref: sectionRef, visible } = useReveal(0.08);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % SLIDES.length);
    }, INTERVAL);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  return (
    <section
      ref={sectionRef as React.Ref<HTMLElement>}
      id="skills"
      className="relative py-32 overflow-hidden bg-[#0a0a0f]"
    >
      {/* ── Top wave: About (#f8fafc) melts into Skills (#0a0a0f) ── */}
      <div className="absolute top-0 left-0 right-0 z-20 pointer-events-none overflow-hidden leading-[0]">
        {/* Back wave — indigo tint, sits behind white */}
        <svg
          viewBox="0 0 1440 110"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute top-0 w-full h-[90px] md:h-[120px] skills-wave-back"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 L1440,0 L1440,60 C1080,110 360,10 0,60 Z"
            fill="rgba(99,102,241,0.07)"
          />
        </svg>
        {/* Front wave — white, covers top edge coming from About */}
        <svg
          viewBox="0 0 1440 90"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute top-0 w-full h-[75px] md:h-[100px] skills-wave-front"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 L1440,0 L1440,45 C960,90 480,5 0,50 Z"
            fill="#f8fafc"
          />
        </svg>
      </div>

      {/* ── Carousel background slides ── */}
      <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden>
        {SLIDES.map((cls, i) => (
          <div
            key={i}
            className={cn(
              "absolute inset-0 transition-opacity duration-[1200ms] ease-in-out before:absolute before:inset-0",
              cls,
              i === current ? "opacity-100" : "opacity-0"
            )}
          />
        ))}
      </div>

      {/* ── Dot grid overlay ── */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
          maskImage:
            "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
        }}
        aria-hidden
      />

      <div className="relative z-10 container mx-auto px-6">
        <div className="max-w-6xl mx-auto">

          {/* ── Header ── */}
          <div
            className={`text-center mb-20 skills-reveal ${visible ? "skills-revealed" : ""}`}
            style={{ transitionDelay: "0ms" }}
          >
            <Badge
              variant="outline"
              className="mb-6 px-4 py-1.5 border-blue-400/30 bg-blue-400/[0.08] backdrop-blur-sm text-white/70 uppercase tracking-widest text-[0.7rem]"
            >
              {section_subtitle}
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold mb-8 text-white tracking-tight">
              {section_title}
            </h2>
            <p className="text-lg md:text-xl text-white/40 max-w-3xl mx-auto leading-relaxed">
              {section_description}
            </p>
          </div>

          {/* ── Skills Grid ── */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => {
              const accent = CARD_ACCENTS[index % CARD_ACCENTS.length];
              return (
                <div
                  key={index}
                  className={`skills-reveal ${visible ? "skills-revealed" : ""}`}
                  style={{ transitionDelay: `${100 + index * 110}ms` }}
                >
                  <div className={`skill-card group skill-card-${index}`}>

                    {/* ── Orbiting ambient glow ── */}
                    <div className="card-orb" style={{ background: accent.orb }} />

                    {/* ── Scanline sweep on hover ── */}
                    <div className="card-scanline" />

                    {/* ── Animated border gradient ── */}
                    <div className="card-border-ring" style={{ "--accent": accent.ring } as React.CSSProperties} />

                    {/* ── Top accent bar ── */}
                    <div className="card-top-bar" style={{ background: accent.bar }} />

                    {/* ── Card body ── */}
                    <div className="relative z-10 p-6">

                      {/* Icon + title row */}
                      <div className="flex items-center gap-3 mb-5">
                        <div className="card-icon-bubble" style={{ background: accent.bubble }}>
                          <accent.Icon className="h-4 w-4" style={{ color: accent.iconColor }} />
                        </div>
                        <h3 className="card-title text-[15px] font-bold text-white/90 tracking-wide">
                          {category.title}
                        </h3>
                      </div>

                      {/* Skill badges — stagger in */}
                      <div className="flex flex-wrap gap-2">
                        {category.skills.map((skill, si) => (
                          <span
                            key={si}
                            className="skill-badge"
                            style={{
                              animationDelay: visible ? `${200 + index * 110 + si * 55}ms` : "0ms",
                              "--badge-hover": accent.badgeHover,
                            } as React.CSSProperties}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* ── Corner particle dots ── */}
                    <div className="card-particle card-particle-tl" style={{ background: accent.iconColor }} />
                    <div className="card-particle card-particle-br" style={{ background: accent.iconColor }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        /* ════════════════════════════════
           WAVE ANIMATIONS
        ════════════════════════════════ */
        .skills-wave-back  { animation: skillsWaveSway 10s ease-in-out infinite; }
        .skills-wave-front { animation: skillsWaveSway 7s ease-in-out infinite reverse; }
        .skills-bot-wave-back  { animation: skillsBotSway 11s ease-in-out infinite; }
        .skills-bot-wave-front { animation: skillsBotSway 8s ease-in-out infinite reverse; }
        @keyframes skillsWaveSway {
          0%, 100% { transform: translateX(0); }
          50%       { transform: translateX(-1.5%); }
        }
        @keyframes skillsBotSway {
          0%, 100% { transform: translateX(0); }
          50%       { transform: translateX(1.5%); }
        }

        /* ════════════════════════════════
           SCROLL REVEAL
        ════════════════════════════════ */
        .skills-reveal {
          opacity: 0;
          transform: translateY(40px) rotateX(6deg);
          transform-origin: bottom center;
          transition:
            opacity 0.8s cubic-bezier(.22,1,.36,1),
            transform 0.8s cubic-bezier(.22,1,.36,1);
        }
        .skills-reveal.skills-revealed {
          opacity: 1;
          transform: translateY(0) rotateX(0deg);
        }

        /* ════════════════════════════════
           SKILL CARD — BASE
        ════════════════════════════════ */
        .skill-card {
          position: relative;
          height: 100%;
          border-radius: 18px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          overflow: hidden;
          backdrop-filter: blur(14px);
          cursor: default;
          transition:
            transform 0.4s cubic-bezier(.22,1,.36,1),
            border-color 0.4s ease,
            box-shadow 0.4s ease;
          animation: cardFloat 6s ease-in-out infinite;
        }

        /* stagger each card's float phase */
        .skill-card-0 { animation-delay: 0s; }
        .skill-card-1 { animation-delay: 1.2s; }
        .skill-card-2 { animation-delay: 2.4s; }
        .skill-card-3 { animation-delay: 3.6s; }
        .skill-card-4 { animation-delay: 0.6s; }

        @keyframes cardFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-6px); }
        }

        .skill-card:hover {
          transform: translateY(-10px) scale(1.02);
          border-color: rgba(255,255,255,0.14);
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.06),
            0 24px 60px rgba(0,0,0,0.5),
            0 0 80px rgba(99,102,241,0.12);
          animation-play-state: paused;
        }

        /* ── Top accent bar ── */
        .card-top-bar {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          opacity: 0;
          transition: opacity 0.35s ease;
        }
        .skill-card:hover .card-top-bar { opacity: 1; }

        /* ── Orbiting ambient glow ── */
        .card-orb {
          position: absolute;
          width: 180px; height: 180px;
          border-radius: 50%;
          filter: blur(50px);
          top: -60px; right: -60px;
          opacity: 0;
          transition: opacity 0.5s ease;
          pointer-events: none;
          animation: orbOrbit 8s linear infinite;
        }
        .skill-card:hover .card-orb { opacity: 0.35; }
        @keyframes orbOrbit {
          0%   { transform: translate(0, 0); }
          25%  { transform: translate(-20px, 20px); }
          50%  { transform: translate(-30px, 0px); }
          75%  { transform: translate(-10px, -20px); }
          100% { transform: translate(0, 0); }
        }

        /* ── Animated border ring ── */
        .card-border-ring {
          position: absolute;
          inset: -1px;
          border-radius: 18px;
          background: conic-gradient(
            from var(--angle, 0deg),
            transparent 0deg,
            var(--accent, rgba(99,102,241,0.6)) 60deg,
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
        .skill-card:hover .card-border-ring {
          opacity: 1;
          animation: borderSpin 3s linear infinite;
        }
        @property --angle {
          syntax: "<angle>";
          initial-value: 0deg;
          inherits: false;
        }
        @keyframes borderSpin {
          to { --angle: 360deg; }
        }

        /* ── Scanline sweep ── */
        .card-scanline {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            105deg,
            transparent 35%,
            rgba(255,255,255,0.06) 50%,
            transparent 65%
          );
          background-size: 200% 100%;
          background-position: 200% 0;
          transition: none;
          pointer-events: none;
          z-index: 1;
        }
        .skill-card:hover .card-scanline {
          animation: scanlineSweep 1.4s ease forwards;
        }
        @keyframes scanlineSweep {
          from { background-position: 200% 0; }
          to   { background-position: -200% 0; }
        }

        /* ── Icon bubble ── */
        .card-icon-bubble {
          width: 32px; height: 32px;
          border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          transition: transform 0.35s cubic-bezier(.22,1,.36,1);
        }
        .skill-card:hover .card-icon-bubble {
          transform: rotate(-8deg) scale(1.15);
        }

        /* ── Card title ── */
        .card-title {
          transition: color 0.3s ease, letter-spacing 0.3s ease;
        }
        .skill-card:hover .card-title {
          color: #fff;
          letter-spacing: 0.03em;
        }

        /* ── Skill badges ── */
        .skill-badge {
          display: inline-block;
          font-size: 0.68rem;
          font-weight: 500;
          padding: 3px 10px;
          border-radius: 999px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.55);
          cursor: default;
          opacity: 0;
          transform: translateY(8px) scale(0.92);
          transition:
            background 0.25s ease,
            color 0.25s ease,
            transform 0.25s ease,
            box-shadow 0.25s ease;
          animation: badgeReveal 0.5s cubic-bezier(.22,1,.36,1) forwards;
        }
        @keyframes badgeReveal {
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .skill-badge:hover {
          background: var(--badge-hover, rgba(99,102,241,0.25));
          color: #fff;
          transform: translateY(-2px) scale(1.06);
          box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }

        /* ── Corner particle dots ── */
        .card-particle {
          position: absolute;
          width: 5px; height: 5px;
          border-radius: 50%;
          opacity: 0;
          transition: opacity 0.4s ease;
        }
        .skill-card:hover .card-particle { opacity: 0.6; }
        .card-particle-tl {
          top: 12px; left: 12px;
          animation: particlePulseTl 2s ease-in-out infinite;
        }
        .card-particle-br {
          bottom: 12px; right: 12px;
          animation: particlePulseBr 2.4s ease-in-out infinite;
        }
        @keyframes particlePulseTl {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50%       { transform: scale(1.8); opacity: 0.2; }
        }
        @keyframes particlePulseBr {
          0%, 100% { transform: scale(1); opacity: 0.4; }
          50%       { transform: scale(2); opacity: 0.1; }
        }
      `}</style>

      {/* ── Bottom wave: Skills (#0a0a0f) → Projects (#f1f5f9) ── */}
      <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none overflow-hidden leading-[0]">
        <svg
          viewBox="0 0 1440 110"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute bottom-0 w-full h-[90px] md:h-[120px] skills-bot-wave-back"
          preserveAspectRatio="none"
        >
          <path
            d="M0,60 C360,110 1080,10 1440,60 L1440,110 L0,110 Z"
            fill="rgba(99,102,241,0.07)"
          />
        </svg>
        <svg
          viewBox="0 0 1440 90"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute bottom-0 w-full h-[70px] md:h-[95px] skills-bot-wave-front"
          preserveAspectRatio="none"
        >
          <path
            d="M0,45 C480,95 960,5 1440,50 L1440,90 L0,90 Z"
            fill="#f1f5f9"
          />
        </svg>
      </div>
    </section>
  );
}