"use client";

import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Github, Linkedin, Mail, Phone, MapPin } from "lucide-react";
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

const iconMap = { Mail, Phone, Github, Linkedin };

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
  social_links 
}: ContactProps) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => setCurrent((c) => (c + 1) % SLIDES.length), INTERVAL);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  return (
    <section id="contact" className="relative py-32 overflow-hidden bg-[#0a0a0f]">
      
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
          
          {/* Header */}
          <div className="text-center mb-16">
            <Badge 
              variant="outline" 
              className="mb-6 px-4 py-1.5 border-blue-400/30 bg-blue-400/[0.08] backdrop-blur-sm text-white/70 uppercase tracking-widest text-[0.7rem]"
            >
              {section_subtitle}
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white tracking-tight">
              {section_title}
            </h2>
            <p className="text-lg md:text-xl text-white/40 max-w-2xl mx-auto leading-relaxed">
              {section_description}
            </p>
          </div>

          {/* Contact Methods Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {methods.map((method, i) => {
              const Icon = iconMap[method.icon as keyof typeof iconMap] || null;
              return (
                <Card key={i} className="group relative p-6 border-white/5 bg-white/[0.03] backdrop-blur-md hover:bg-white/[0.07] transition-all duration-500 overflow-hidden">
                   {/* Subtle Hover Glow based on string in DB */}
                   <div className="absolute -inset-px bg-gradient-to-br from-blue-500/10 to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <CardContent className="relative p-0 z-10">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="p-3 bg-blue-400/10 rounded-xl border border-blue-400/20 group-hover:bg-blue-400/20 transition-colors">
                        {Icon && <Icon className="h-5 w-5 text-blue-400" />}
                      </div>
                      <div>
                        <h3 className="font-bold text-white/90 group-hover:text-white transition-colors">{method.label}</h3>
                        <p className="text-sm text-white/50">{method.value}</p>
                      </div>
                    </div>
                    <p className="text-sm text-white/30 leading-relaxed">{method.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* ── Ready to Start a Project Card ── */}
          {/* We use a solid darker background here to ensure it's not affected by carousel transparency */}
          <Card className="relative p-10 bg-[#0d0d14] border border-white/10 shadow-2xl overflow-hidden group">
            {/* Subtle internal gradient accent that stays static */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none" />
            
            <CardContent className="relative p-0 text-center z-10">
              <h3 className="text-3xl font-bold mb-5 text-white">{cta_title}</h3>
              <p className="text-lg text-white/40 mb-10 max-w-2xl mx-auto leading-relaxed">
                {cta_description}
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
                <Button size="lg" className="rounded-full px-10 py-7 text-lg bg-blue-500 hover:bg-blue-400 shadow-[0_8px_30px_rgba(59,130,246,0.3)] transition-all hover:-translate-y-0.5">
                  <Mail className="h-5 w-5 mr-3" />
                  Send Email
                </Button>
                <Button variant="outline" size="lg" className="rounded-full px-10 py-7 text-lg border-white/10 bg-white/[0.05] text-white hover:bg-white/[0.1] transition-all hover:-translate-y-0.5">
                  Schedule Call
                </Button>
              </div>

              {/* Social links */}
              <div className="flex justify-center space-x-5">
                {social_links.map((link, i) => {
                  const Icon = iconMap[link.icon as keyof typeof iconMap] || null;
                  return (
                    <a
                      key={i}
                      href={link.url}
                      className="p-4 rounded-full bg-white/[0.05] border border-white/10 text-white/50 hover:text-blue-400 hover:border-blue-400/40 hover:bg-blue-400/[0.1] transition-all duration-300"
                      aria-label={`${link.platform} Profile`}
                    >
                      {Icon && <Icon className="h-6 w-6" />}
                    </a>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Location footer */}
          <div className="text-center mt-16 space-y-3">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/5 text-sm text-white/40">
              <MapPin className="h-4 w-4 text-blue-400" />
              <span>{location}</span>
            </div>
            <p className="text-xs text-white/20 tracking-wider">
              {location_note}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}