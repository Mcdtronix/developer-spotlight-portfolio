"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, Github, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface HeroAction {
  label: string;
  icon?: string;
  action: string;
}
export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}
export interface HeroProps {
  profile_image?: string | null;
  initials: string;
  name: string;
  title: string;
  description: string;
  main_actions: HeroAction[];
  social_links?: SocialLink[];
}

const iconMap = { ArrowDown, Github, Linkedin, Mail };

// ── Carousel slides – each is a Tailwind-safe gradient combo ──
const SLIDES = [
  // Deep-space blue
  "before:bg-[radial-gradient(ellipse_80%_60%_at_20%_40%,#1e3a8a,transparent_60%)] bg-[radial-gradient(ellipse_60%_80%_at_80%_60%,#0f172a,#0a0a0f)]",
  // Ember / rose
  "before:bg-[radial-gradient(circle_400px_at_75%_25%,rgba(251,146,60,0.18),transparent_65%)] bg-[radial-gradient(ellipse_90%_70%_at_60%_30%,#1a0533,#0a0a0f)]",
  // Teal aurora
  "before:bg-[radial-gradient(ellipse_70%_50%_at_30%_60%,rgba(20,184,166,0.22),transparent_70%)] bg-[radial-gradient(ellipse_100%_60%_at_50%_0%,#042f2e,#0a0a0f)]",
  // Violet haze
  "before:bg-[radial-gradient(circle_450px_at_15%_50%,rgba(139,92,246,0.22),transparent_70%)] bg-[radial-gradient(ellipse_80%_70%_at_80%_20%,#1e0545,#0a0a0f)]",
];

const INTERVAL = 4500;

export function Hero({
  profile_image,
  initials,
  name,
  title,
  description,
  main_actions = [],
  social_links = [],
}: HeroProps) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = (n: number) => setCurrent((n + SLIDES.length) % SLIDES.length);

  const startAuto = () => {
    timerRef.current = setInterval(() => setCurrent((c) => (c + 1) % SLIDES.length), INTERVAL);
  };

  useEffect(() => {
    startAuto();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const handleDot = (i: number) => {
    goTo(i);
    if (timerRef.current) clearInterval(timerRef.current);
    startAuto();
  };

  // Split name for gradient accent on last word
  const nameParts = name.trim().split(" ");
  const firstName = nameParts.slice(0, -1).join(" ");
  const lastName = nameParts.at(-1);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0a0a0f]">

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

      {/* ── Dot grid ── */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.065) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
          maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%)",
        }}
        aria-hidden/>

      {/* ── Floating ambient orbs ── */}
      <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden" aria-hidden>
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-blue-500/[0.07] blur-[100px] animate-[float_12s_ease-in-out_infinite]" />
        <div className="absolute -bottom-16 -right-16 w-[380px] h-[380px] rounded-full bg-violet-500/[0.08] blur-[90px] animate-[float_12s_ease-in-out_infinite_-4s]" />
        <div className="absolute top-1/2 left-1/2 w-[260px] h-[260px] rounded-full bg-teal-400/[0.06] blur-[80px] animate-[float_12s_ease-in-out_infinite_-8s]" />
      </div>

      {/* ── Hero content ── */}
      <div className="relative z-10 container mx-auto px-6 text-center py-32">
        <div className="max-w-3xl mx-auto">

          {/* Availability badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-400/30 bg-blue-400/[0.08] backdrop-blur-sm text-[0.73rem] uppercase tracking-widest text-white/60 mb-8 animate-[fadeUp_0.7s_0.1s_both]">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            Open to opportunities
          </div>

          {/* Avatar */}
          <div className="relative w-28 h-28 mx-auto mb-8 animate-[fadeUp_0.8s_0.2s_cubic-bezier(0.34,1.56,0.64,1)_both]">
            <div className="absolute inset-0 rounded-full border border-blue-400/35 animate-spin [animation-duration:8s]" />
            <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-violet-600 shadow-[0_0_60px_rgba(96,165,250,0.35)] flex items-center justify-center overflow-hidden">
              {profile_image ? (
                <img src={profile_image} alt={name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-bold text-white font-[Sora,sans-serif]">{initials}</span>
              )}
            </div>
          </div>

          {/* Name */}
          <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.02] tracking-[-0.04em] text-white mb-5 animate-[fadeUp_0.7s_0.35s_both]">
            {firstName && <span>{firstName} </span>}
            <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent">
              {lastName}
            </span>
          </h1>

          {/* Title */}
          <p className="text-lg md:text-xl text-white/50 font-light tracking-wide mb-4 animate-[fadeUp_0.7s_0.45s_both]">
            {title}
          </p>

          {/* Description */}
          <p className="text-base md:text-lg text-white/35 max-w-xl mx-auto leading-relaxed mb-12 animate-[fadeUp_0.7s_0.55s_both]">
            {description}
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-14 animate-[fadeUp_0.7s_0.65s_both]">
            {main_actions.map((action, i) => {
              const Icon = iconMap[action.icon as keyof typeof iconMap] || null;
              return i === 0 ? (
                <Button
                  key={i}
                  size="lg"
                  className="rounded-full px-8 py-6 text-base bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-400 hover:to-indigo-400 border-0 shadow-[0_8px_30px_rgba(59,130,246,0.38)] hover:shadow-[0_14px_40px_rgba(59,130,246,0.55)] transition-all duration-300 hover:-translate-y-0.5">
                  {action.label}
                  {Icon && <Icon className="ml-2 h-4 w-4" />}
                </Button>
              ) : (
                <Button
                  key={i}
                  size="lg"
                  variant="ghost"
                  className="rounded-full px-8 py-6 text-base border border-white/12 bg-white/[0.06] hover:bg-white/[0.11] hover:border-white/25 text-white/75 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5">
                  {Icon && <Icon className="mr-2 h-4 w-4" />}
                  {action.label}
                </Button>
              );
            })}
          </div>

          {/* Social icons */}
          <div className="flex justify-center gap-3 animate-[fadeUp_0.7s_0.75s_both]">
            {social_links.map((link, i) => {
              const Icon = iconMap[link.icon as keyof typeof iconMap] || null;
              return (
                <a
                  key={i}
                  href={link.url}
                  title={link.platform}
                  className="w-11 h-11 rounded-full flex items-center justify-center border border-white/10 bg-white/[0.06] text-white/55 hover:text-blue-400 hover:border-blue-400/40 hover:bg-blue-400/[0.12] transition-all duration-300 hover:-translate-y-0.5 backdrop-blur-sm">
                  {Icon && <Icon className="h-5 w-5" />}
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Slide indicators ── */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-2.5" role="tablist" aria-label="Background slide">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === current}
            onClick={() => handleDot(i)}
            className={cn(
              "h-[3px] rounded-full transition-all duration-500 cursor-pointer",
              i === current ? "w-12 bg-blue-400" : "w-7 bg-white/25 hover:bg-white/45"
            )}
          />
        ))}
      </div>

      {/* ── Subtle scroll cue ── */}
      <div className="absolute bottom-12 right-12 hidden md:flex flex-col items-center gap-2 text-white/25 text-[0.65rem] uppercase tracking-widest" aria-hidden>
        <span>scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-transparent to-white/25 animate-[scrollLine_2s_ease-in-out_infinite]" />
      </div>
    </section>
  );
}