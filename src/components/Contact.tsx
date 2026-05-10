"use client";

import { useEffect, useRef, useState } from "react";
import { Github, Linkedin, Mail, Phone, MapPin, Send, CalendarDays, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ContactMethod {
  type: string;
  label: string;
  value: string;
  description: string;
  icon: string;
}
export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}
export interface ContactProps {
  section_title: string;
  section_subtitle: string;
  section_description: string;
  cta_title: string;
  cta_description: string;
  location: string;
  location_note: string;
  methods: ContactMethod[];
  social_links: SocialLink[];
}

const iconMap: Record<string, React.ElementType> = {
  Mail,
  Phone,
  Github,
  Linkedin,
};

/* ── Carousel slides – Parallel to Hero ── */
const SLIDES = [
  "before:bg-[radial-gradient(ellipse_80%_60%_at_20%_40%,#1e3a8a,transparent_60%)] bg-[radial-gradient(ellipse_60%_80%_at_80%_60%,#0f172a,#0a0a0f)]",
  "before:bg-[radial-gradient(circle_400px_at_75%_25%,rgba(251,146,60,0.18),transparent_65%)] bg-[radial-gradient(ellipse_90%_70%_at_60%_30%,#1a0533,#0a0a0f)]",
  "before:bg-[radial-gradient(ellipse_70%_50%_at_30%_60%,rgba(20,184,166,0.22),transparent_70%)] bg-[radial-gradient(ellipse_100%_60%_at_50%_0%,#042f2e,#0a0a0f)]",
  "before:bg-[radial-gradient(circle_450px_at_15%_50%,rgba(139,92,246,0.22),transparent_70%)] bg-[radial-gradient(ellipse_80%_70%_at_80%_20%,#1e0545,#0a0a0f)]",
];

const INTERVAL = 4500;

export function Contact({
  section_title,
  section_subtitle,
  section_description,
  cta_title,
  cta_description,
  location,
  location_note,
  methods,
  social_links,
}: ContactProps) {
  const [current, setCurrent] = useState(0);
  const [hoveredMethod, setHoveredMethod] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => setCurrent((c) => (c + 1) % SLIDES.length), INTERVAL);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  return (
    <section id="contact" className="relative py-32 overflow-hidden bg-[#0a0a0f]">
      
      {/* ── Top wave: Projects (#f1f5f9) melts into Contact (#0a0a0f) ── */}
      <div className="absolute top-0 left-0 right-0 z-30 pointer-events-none overflow-hidden leading-[0]">
        {/* Back wave — indigo tint, sits behind white */}
        <svg
          viewBox="0 0 1440 110"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute top-0 w-full h-[90px] md:h-[120px] contact-wave-back"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 L1440,0 L1440,60 C1080,110 360,10 0,60 Z"
            fill="rgba(99,102,241,0.07)"
          />
        </svg>
        {/* Front wave — white, covers top edge coming from Projects */}
        <svg
          viewBox="0 0 1440 90"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute top-0 w-full h-[75px] md:h-[100px] contact-wave-front"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 L1440,0 L1440,45 C960,90 480,5 0,50 Z"
            fill="#f1f5f9"
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
          backgroundImage: "radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
        }}
        aria-hidden
      />

      <div className="relative z-10 container mx-auto px-6">
        <div className="max-w-4xl mx-auto">

          {/* ── Header ── */}
          <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="inline-block text-[0.7rem] font-semibold tracking-[0.25em] uppercase text-blue-400 bg-blue-400/[0.08] border border-blue-400/30 backdrop-blur-sm rounded-full px-5 py-2 mb-6">
              {section_subtitle}
            </span>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white tracking-tight leading-tight">
              {section_title}
            </h2>
            <p className="text-lg md:text-xl text-white/40 max-w-2xl mx-auto leading-relaxed">
              {section_description}
            </p>
          </div>

          {/* ── Contact method cards ── */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {methods.map((method, i) => {
              const Icon = iconMap[method.icon as keyof typeof iconMap] || Mail;
              return (
                <div
                  key={i}
                  className="group relative p-7 border border-white/5 bg-white/[0.03] backdrop-blur-md hover:bg-white/[0.07] hover:border-white/10 transition-all duration-500 rounded-2xl overflow-hidden"
                  onMouseEnter={() => setHoveredMethod(i)}
                  onMouseLeave={() => setHoveredMethod(null)}
                >
                   {/* Hover Glow Accent */}
                   <div className="absolute -inset-px bg-gradient-to-br from-blue-500/10 to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative z-10 flex items-start gap-4">
                    <div className="p-3 bg-blue-400/10 rounded-xl border border-blue-400/20 group-hover:bg-blue-400/20 transition-colors">
                      <Icon className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-white/90 mb-1 group-hover:text-white transition-colors">{method.label}</h3>
                      <p className="text-sm font-medium text-blue-400 mb-2 truncate">
                        {method.value}
                      </p>
                      <p className="text-xs text-white/30 leading-relaxed">{method.description}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-white/20 mt-1 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── CTA card (Solid for visibility) ── */}
          <div className="relative p-10 bg-[#0d0d14] border border-white/10 shadow-2xl rounded-[2rem] overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-indigo-500/5 pointer-events-none" />
            
            <div className="relative z-10 text-center">
              <h3 className="text-3xl font-bold mb-5 text-white tracking-tight">
                {cta_title}
              </h3>
              <p className="text-white/40 mb-10 max-w-xl mx-auto leading-relaxed text-lg font-light">
                {cta_description}
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
                <a 
                  href={`mailto:${methods.find(m => m.type === "email")?.value ?? ""}`} 
                  className="inline-flex items-center justify-center gap-3 px-10 py-4 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold hover:shadow-[0_8px_30px_rgba(59,130,246,0.3)] transition-all hover:-translate-y-0.5"
                >
                  <Send className="h-4 w-4" />
                  Send Email
                </a>
                <button className="inline-flex items-center justify-center gap-3 px-10 py-4 rounded-full border border-white/10 bg-white/[0.05] text-white font-semibold hover:bg-white/[0.1] transition-all hover:-translate-y-0.5">
                  <CalendarDays className="h-4 w-4" />
                  Schedule Call
                </button>
              </div>

              {/* Socials */}
              <div className="flex justify-center gap-5">
                {social_links.map((link, i) => {
                  const Icon = iconMap[link.icon as keyof typeof iconMap] || Github;
                  return (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-4 rounded-full bg-white/[0.05] border border-white/10 text-white/50 hover:text-blue-400 hover:border-blue-400/40 hover:bg-blue-400/[0.1] transition-all duration-300"
                    >
                      <Icon className="h-6 w-6" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── Location footer ── */}
          <div className="text-center mt-16 space-y-3 opacity-40">
            <div className="inline-flex items-center gap-2 text-sm px-5 py-2 rounded-full bg-white/[0.03] border border-white/5">
              <MapPin className="h-4 w-4 text-blue-400" />
              <span className="font-medium text-white">{location}</span>
            </div>
            <p className="text-xs text-white/60 tracking-wider uppercase">{location_note}</p>
          </div>
        </div>
      </div>

      <style>{`
        /* ════════════════════════════════
           WAVE ANIMATIONS
        ════════════════════════════════ */
        .contact-wave-back  { animation: contactWaveSway 10s ease-in-out infinite; }
        .contact-wave-front { animation: contactWaveSway 7s ease-in-out infinite reverse; }
        @keyframes contactWaveSway {
          0%, 100% { transform: translateX(0); }
          50%       { transform: translateX(-1.5%); }
        }
      `}</style>
    </section>
  );
}