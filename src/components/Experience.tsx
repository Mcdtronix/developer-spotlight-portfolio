"use client";

import { useEffect, useRef, useState } from "react";
import { Briefcase, Calendar, MapPin, LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface Experience {
  title: string;
  company: string;
  employment_type: string;
  location: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  description: string;
  achievements: string[];
  skills: string[];
  icon: string;
}

export interface ExperienceProps {
  section_title: string;
  section_subtitle: string;
  section_description: string;
  experiences: Experience[];
}

/* ─── Intersection-observer reveal hook ─── */
function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, visible };
}

/* ─── Format date helper ─── */
function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
}

/* ─── Calculate duration ─── */
function calculateDuration(start: string, end?: string): string {
  const startDate = new Date(start);
  const endDate = end ? new Date(end) : new Date();
  const months =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    (endDate.getMonth() - startDate.getMonth());
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;

  if (years > 0 && remainingMonths > 0) {
    return `${years} yr${years > 1 ? "s" : ""} ${remainingMonths} mo`;
  } else if (years > 0) {
    return `${years} yr${years > 1 ? "s" : ""}`;
  } else {
    return `${remainingMonths} mo`;
  }
}

export function Experience({
  section_title,
  section_subtitle,
  section_description,
  experiences,
}: ExperienceProps) {
  const { ref: sectionRef, visible } = useReveal(0.08);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  return (
    <section
      ref={sectionRef as React.Ref<HTMLElement>}
      id="experience"
      className="relative py-32 bg-gradient-to-b from-[#f8fafc] to-[#f1f5f9] overflow-hidden"
    >
      {/* ─── Subtle background texture ─── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            "radial-gradient(#6366f1 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* ─── Ambient orbs ─── */}
      <div className="exp-ambient exp-ambient-1" />
      <div className="exp-ambient exp-ambient-2" />

      <div className="relative z-10 container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          {/* ─── Section Header ─── */}
          <div
            className={`text-center mb-20 exp-reveal ${visible ? "exp-revealed" : ""}`}
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

          {/* ─── Timeline ─── */}
          <div className="relative">
            {/* Timeline line */}
            <div
              className={`exp-timeline-line ${visible ? "exp-timeline-active" : ""}`}
            />

            {/* Experience cards */}
            <div className="space-y-6">
              {experiences.map((exp, index) => (
                <div
                  key={index}
                  className={`exp-reveal ${visible ? "exp-revealed" : ""}`}
                  style={{ transitionDelay: `${120 + index * 100}ms` }}
                >
                  <div
                    className={`exp-card ${expandedIndex === index ? "exp-card-expanded" : ""}`}
                    onClick={() =>
                      setExpandedIndex(expandedIndex === index ? null : index)
                    }
                  >
                    {/* ─── Card Header ─── */}
                    <div className="exp-card-header">
                      <div className="exp-card-marker">
                        <Briefcase className="h-5 w-5 text-indigo-600" />
                      </div>

                      <div className="exp-card-title-section">
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                          <div>
                            <h3 className="text-xl font-bold text-slate-900">
                              {exp.title}
                            </h3>
                            <p className="text-indigo-600 font-semibold mt-1">
                              {exp.company}
                            </p>
                          </div>
                          {exp.is_current && (
                            <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 cursor-default">
                              Current
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* ─── Card Meta ─── */}
                    <div className="exp-card-meta">
                      <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4 text-indigo-500" />
                          <span>
                            {formatDate(exp.start_date)} -{" "}
                            {exp.is_current
                              ? "Present"
                              : exp.end_date
                                ? formatDate(exp.end_date)
                                : "N/A"}
                          </span>
                          <span className="text-slate-400">•</span>
                          <span className="font-medium text-slate-700">
                            {calculateDuration(exp.start_date, exp.end_date)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="h-4 w-4 text-indigo-500" />
                          <span>{exp.location}</span>
                          <span className="text-slate-400">•</span>
                          <span className="text-indigo-600 font-medium capitalize">
                            {exp.employment_type.replace("-", " ")}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* ─── Expandable Content ─── */}
                    <div
                      className={`exp-card-content ${expandedIndex === index ? "exp-card-content-visible" : ""}`}
                    >
                      {/* Description */}
                      <p className="text-slate-600 leading-relaxed mb-5">
                        {exp.description}
                      </p>

                      {/* Achievements */}
                      {exp.achievements && exp.achievements.length > 0 && (
                        <div className="mb-5">
                          <h4 className="text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wider">
                            Key Achievements
                          </h4>
                          <ul className="space-y-2">
                            {exp.achievements.map((achievement, i) => (
                              <li
                                key={i}
                                className="flex gap-3 text-sm text-slate-600"
                              >
                                <span className="text-indigo-500 font-bold">
                                  ✓
                                </span>
                                <span>{achievement}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Skills */}
                      {exp.skills && exp.skills.length > 0 && (
                        <div>
                          <h4 className="text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wider">
                            Technologies & Skills
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {exp.skills.map((skill, i) => (
                              <Badge
                                key={i}
                                className="bg-indigo-100 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 cursor-default"
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* ─── Expand indicator ─── */}
                    <div className="exp-expand-indicator">
                      <span
                        className={`exp-chevron ${expandedIndex === index ? "exp-chevron-expanded" : ""}`}
                      >
                        ↓
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Wave transition → Skills (dark) ─── */}
      <div className="absolute bottom-0 left-0 right-0 z-20 pointer-events-none overflow-hidden leading-[0]">
        {/* Back wave — subtle indigo tint */}
        <svg
          viewBox="0 0 1440 100"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-[80px] md:h-[110px] exp-wave-back"
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
          className="absolute bottom-0 w-full h-[65px] md:h-[85px] exp-wave-front"
          preserveAspectRatio="none"
        >
          <path
            d="M0,30 C480,80 960,0 1440,40 L1440,80 L0,80 Z"
            fill="#0a0a0f"
          />
        </svg>
      </div>

      {/* ─── Styles ─── */}
      <style>{`
        /* ─── Wave animations ─── */
        .exp-wave-back  { animation: expWaveSway 10s ease-in-out infinite; }
        .exp-wave-front { animation: expWaveSway 7s ease-in-out infinite reverse; }
        @keyframes expWaveSway {
          0%, 100% { transform: translateX(0); }
          50%       { transform: translateX(-1.5%); }
        }

        /* ─── Ambient orbs ─── */
        .exp-ambient {
          position: absolute;
          border-radius: 9999px;
          pointer-events: none;
        }
        .exp-ambient-1 {
          width: 500px;
          height: 500px;
          top: -150px;
          left: -100px;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.07) 0%, transparent 70%);
        }
        .exp-ambient-2 {
          width: 400px;
          height: 400px;
          bottom: -80px;
          right: -80px;
          background: radial-gradient(circle, rgba(139, 92, 246, 0.06) 0%, transparent 70%);
        }

        /* ─── Timeline line animation ─── */
        .exp-timeline-line {
          position: absolute;
          left: 39px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: linear-gradient(
            180deg,
            rgba(99, 102, 241, 0),
            rgba(99, 102, 241, 0.4),
            rgba(99, 102, 241, 0)
          );
          transform: scaleY(0);
          transform-origin: top;
          transition: transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .exp-timeline-line.exp-timeline-active {
          transform: scaleY(1);
        }

        /* ─── Reveal animations ─── */
        .exp-reveal {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.75s cubic-bezier(0.22, 1, 0.36, 1),
                      transform 0.75s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .exp-reveal.exp-revealed {
          opacity: 1;
          transform: translateY(0);
        }

        /* ─── Card container ─── */
        .exp-card {
          position: relative;
          padding: 0;
          margin-left: 100px;
          border-radius: 20px;
          background: #fff;
          border: 1px solid #e2e8f0;
          box-shadow: 0 2px 12px rgba(99, 102, 241, 0.08);
          transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);
          cursor: pointer;
          overflow: hidden;
        }
        .exp-card:hover {
          border-color: #c7d2fe;
          box-shadow: 0 8px 28px rgba(99, 102, 241, 0.18);
          transform: translateY(-4px);
        }
        .exp-card.exp-card-expanded {
          box-shadow: 0 12px 40px rgba(99, 102, 241, 0.24);
        }

        /* ─── Timeline marker ─── */
        .exp-card-marker {
          position: absolute;
          left: -80px;
          top: 24px;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, #eef2ff, #e0e7ff);
          border: 3px solid #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 16px rgba(99, 102, 241, 0.25);
          z-index: 10;
          transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .exp-card:hover .exp-card-marker {
          transform: scale(1.15);
          box-shadow: 0 6px 24px rgba(99, 102, 241, 0.4);
        }

        /* ─── Card header ─── */
        .exp-card-header {
          padding: 24px 28px;
          display: flex;
          gap: 16px;
          position: relative;
          z-index: 5;
        }

        .exp-card-title-section {
          flex: 1;
          min-width: 0;
        }

        /* ─── Card meta info ─── */
        .exp-card-meta {
          padding: 0 28px 20px;
          border-top: 1px solid #f1f5f9;
          transition: max-height 0.3s ease;
        }

        /* ─── Expandable content ─── */
        .exp-card-content {
          max-height: 0;
          overflow: hidden;
          opacity: 0;
          padding: 0 28px;
          transition: all 0.35s cubic-bezier(0.22, 1, 0.36, 1);
          border-top: 1px solid #f1f5f9;
        }
        .exp-card-content.exp-card-content-visible {
          max-height: 800px;
          opacity: 1;
          padding: 20px 28px 28px;
        }

        /* ─── Expand indicator ─── */
        .exp-expand-indicator {
          padding: 8px 28px 16px;
          text-align: center;
          color: #6366f1;
          font-size: 12px;
        }

        .exp-chevron {
          display: inline-block;
          transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
          font-weight: bold;
          font-size: 18px;
        }
        .exp-chevron.exp-chevron-expanded {
          transform: rotate(180deg);
        }

        /* ─── Responsive ─── */
        @media (max-width: 768px) {
          .exp-card {
            margin-left: 60px;
          }
          .exp-card-marker {
            left: -54px;
            width: 40px;
            height: 40px;
          }
          .exp-card-header {
            padding: 20px 20px;
          }
          .exp-card-meta {
            padding: 0 20px 16px;
          }
          .exp-card-content {
            padding: 0 20px;
          }
          .exp-card-content.exp-card-content-visible {
            padding: 16px 20px 20px;
          }
          .exp-expand-indicator {
            padding: 6px 20px 12px;
          }
        }
      `}</style>
    </section>
  );
}
