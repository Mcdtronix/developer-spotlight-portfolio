"use client";

import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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
            {categories.map((category, index) => (
              <div
                key={index}
                className={`skills-reveal ${visible ? "skills-revealed" : ""}`}
                style={{ transitionDelay: `${120 + index * 80}ms` }}
              >
                <Card className="group relative h-full p-6 border-white/5 bg-white/[0.03] backdrop-blur-md hover:bg-white/[0.07] hover:border-white/10 transition-all duration-500 overflow-hidden">
                  {/* Hover glow */}
                  <div className="absolute -inset-px bg-gradient-to-br from-blue-500/20 via-transparent to-violet-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Top accent line */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <CardContent className="relative p-0 z-10">
                    <h3 className="text-lg font-bold mb-5 text-white/90 group-hover:text-blue-400 transition-colors">
                      {category.title}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {category.skills.map((skill, skillIndex) => (
                        <Badge
                          key={skillIndex}
                          variant="secondary"
                          className="text-[0.7rem] py-1 bg-white/[0.05] hover:bg-blue-400/20 text-white/60 hover:text-white border-white/5 transition-all"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        /* ── Wave animations ── */
        .skills-wave-back  { animation: skillsWaveSway 10s ease-in-out infinite; }
        .skills-wave-front { animation: skillsWaveSway 7s ease-in-out infinite reverse; }
        @keyframes skillsWaveSway {
          0%, 100% { transform: translateX(0); }
          50%       { transform: translateX(-1.5%); }
        }

        /* ── Scroll reveal ── */
        .skills-reveal {
          opacity: 0;
          transform: translateY(36px);
          transition:
            opacity 0.75s cubic-bezier(.22,1,.36,1),
            transform 0.75s cubic-bezier(.22,1,.36,1);
        }
        .skills-reveal.skills-revealed {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </section>
  );
}