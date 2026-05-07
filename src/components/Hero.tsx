"use client";

import { ArrowDown, Github, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useRef } from "react";

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

const iconMap = {
  ArrowDown,
  Github,
  Linkedin,
  Mail,
};

export function Hero({
  profile_image,
  initials,
  name,
  title,
  description,
  main_actions = [],
  social_links = [],
}: HeroProps) {
  const heroRef = useRef<HTMLElement>(null);

  // Parallax + fade on scroll
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroHeight = hero.offsetHeight;
      const progress = Math.min(scrollY / heroHeight, 1);

      const inner = hero.querySelector<HTMLDivElement>(".hero-inner");
      if (inner) {
        inner.style.transform = `translateY(${scrollY * 0.35}px)`;
        inner.style.opacity = `${1 - progress * 1.6}`;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0a0a0f]"
    >
      {/* ── Animated mesh background ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />
        {/* Fine grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* ── Main content (parallax wrapper) ── */}
      <div className="hero-inner relative z-10 container mx-auto px-6 text-center will-change-transform">
        <div className="max-w-4xl mx-auto">

          {/* Avatar */}
          <div className="hero-avatar w-32 h-32 mx-auto mb-8 rounded-full shadow-[0_0_60px_rgba(99,102,241,0.45)] flex items-center justify-center overflow-hidden ring-2 ring-indigo-500/30">
            {profile_image ? (
              <img
                src={profile_image}
                alt={name}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <span className="text-4xl font-bold text-white">{initials}</span>
            )}
          </div>

          {/* Name */}
          <h1 className="hero-name text-5xl md:text-7xl font-extrabold mb-4 tracking-tight text-white leading-none">
            {name}
          </h1>

          {/* Title chip */}
          <p className="hero-title inline-block text-sm md:text-base font-semibold tracking-[0.2em] uppercase text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-5 py-2 mb-6">
            {title}
          </p>

          {/* Description */}
          <p className="hero-desc text-base md:text-lg text-white/50 mb-12 max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>

          {/* CTAs */}
          <div className="hero-ctas flex flex-col sm:flex-row gap-4 justify-center mb-16">
            {main_actions.map((action, i) => {
              const Icon = iconMap[action.icon as keyof typeof iconMap] || null;
              return (
                <Button
                  key={i}
                  size="lg"
                  className={
                    i === 0
                      ? "text-base px-8 py-6 bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:shadow-[0_0_45px_rgba(99,102,241,0.6)] transition-all duration-300 rounded-full"
                      : "text-base px-8 py-6 bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all duration-300 rounded-full"
                  }
                >
                  {action.label}
                  {Icon && <Icon className="ml-2 h-5 w-5" />}
                </Button>
              );
            })}
          </div>

          {/* Socials */}
          <div className="hero-socials flex justify-center space-x-4">
            {social_links.map((link, i) => {
              const Icon = iconMap[link.icon as keyof typeof iconMap] || null;
              return (
                <a
                  key={i}
                  href={link.url}
                  className="p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-500/40 transition-all duration-300 shadow hover:shadow-indigo-500/20 hover:shadow-lg"
                >
                  {Icon && <Icon className="h-5 w-5 text-white/70 hover:text-white" />}
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 hero-scroll-indicator">
        <span className="text-xs tracking-[0.2em] uppercase text-white/30">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-white/30 to-transparent animate-[scrollLine_1.8s_ease-in-out_infinite]" />
      </div>

      {/* ── Wave SVG transition into About ── */}
      <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none overflow-hidden leading-[0]">
        {/* Back wave — slower, lighter */}
        <svg
          viewBox="0 0 1440 120"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-[90px] md:h-[120px] hero-wave-back"
          preserveAspectRatio="none"
        >
          <path
            d="M0,60 C240,110 480,10 720,60 C960,110 1200,10 1440,60 L1440,120 L0,120 Z"
            fill="rgba(255,255,255,0.04)"
          />
        </svg>
        {/* Front wave — solid page bg colour */}
        <svg
          viewBox="0 0 1440 80"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute bottom-0 w-full h-[70px] md:h-[90px] hero-wave-front"
          preserveAspectRatio="none"
        >
          <path
            d="M0,40 C360,90 1080,0 1440,40 L1440,80 L0,80 Z"
            fill="#f8fafc"
          />
        </svg>
      </div>

      <style>{`
        /* Orbs */
        .hero-orb {
          position: absolute;
          border-radius: 9999px;
          filter: blur(80px);
          will-change: transform;
        }
        .hero-orb-1 {
          width: 600px; height: 600px;
          top: -150px; left: -150px;
          background: radial-gradient(circle, rgba(99,102,241,0.18) 0%, transparent 70%);
          animation: orbFloat 14s ease-in-out infinite;
        }
        .hero-orb-2 {
          width: 500px; height: 500px;
          bottom: 50px; right: -100px;
          background: radial-gradient(circle, rgba(168,85,247,0.14) 0%, transparent 70%);
          animation: orbFloat 18s ease-in-out infinite reverse;
        }
        .hero-orb-3 {
          width: 400px; height: 400px;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          background: radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%);
          animation: orbPulse 8s ease-in-out infinite;
        }

        @keyframes orbFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33%       { transform: translate(30px, -40px) scale(1.05); }
          66%       { transform: translate(-20px, 20px) scale(0.97); }
        }
        @keyframes orbPulse {
          0%, 100% { opacity: 0.6; transform: translate(-50%, -50%) scale(1); }
          50%       { opacity: 1;   transform: translate(-50%, -50%) scale(1.15); }
        }

        /* Avatar glow pulse */
        .hero-avatar {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          animation: avatarGlow 4s ease-in-out infinite;
        }
        @keyframes avatarGlow {
          0%, 100% { box-shadow: 0 0 40px rgba(99,102,241,0.35); }
          50%       { box-shadow: 0 0 80px rgba(139,92,246,0.55); }
        }

        /* Entrance stagger */
        .hero-avatar     { animation: fadeUp 0.7s cubic-bezier(.22,1,.36,1) 0.1s both, avatarGlow 4s ease-in-out infinite; }
        .hero-name       { animation: fadeUp 0.7s cubic-bezier(.22,1,.36,1) 0.25s both; }
        .hero-title      { animation: fadeUp 0.7s cubic-bezier(.22,1,.36,1) 0.38s both; }
        .hero-desc       { animation: fadeUp 0.7s cubic-bezier(.22,1,.36,1) 0.5s both; }
        .hero-ctas       { animation: fadeUp 0.7s cubic-bezier(.22,1,.36,1) 0.62s both; }
        .hero-socials    { animation: fadeUp 0.7s cubic-bezier(.22,1,.36,1) 0.74s both; }
        .hero-scroll-indicator { animation: fadeUp 0.7s cubic-bezier(.22,1,.36,1) 1s both; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* Scroll line pulse */
        @keyframes scrollLine {
          0%, 100% { opacity: 0.3; transform: scaleY(0.7); transform-origin: top; }
          50%       { opacity: 1;   transform: scaleY(1);   transform-origin: top; }
        }

        /* Wave animations */
        .hero-wave-back {
          animation: waveSway 9s ease-in-out infinite;
        }
        .hero-wave-front {
          animation: waveSway 6s ease-in-out infinite reverse;
        }
        @keyframes waveSway {
          0%, 100% { transform: translateX(0); }
          50%       { transform: translateX(-2%); }
        }
      `}</style>
    </section>
  );
}