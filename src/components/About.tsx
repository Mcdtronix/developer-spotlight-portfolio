import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code2, Rocket, Users, Zap, LucideIcon } from "lucide-react";

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

export function About({ section_title, section_subtitle, section_description, journey_title, journey_paragraphs, highlights }: AboutProps) {
  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">{section_subtitle}</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              {section_title}
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {section_description}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h3 className="text-2xl font-semibold mb-6 text-foreground">{journey_title}</h3>
              {journey_paragraphs.map((p, i) => (
                <p key={i} className="text-muted-foreground leading-relaxed mb-6">{p}</p>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {highlights.map((highlight, index) => {
                const Icon = iconMap[highlight.icon] || null;
                return (
                  <Card key={index} className="p-6 hover:shadow-lg transition-shadow duration-300">
                    <CardContent className="p-0 text-center">
                      {Icon && <Icon className="h-8 w-8 text-primary mx-auto mb-3" />}
                      <h4 className="font-semibold text-foreground mb-2">{highlight.title}</h4>
                      <p className="text-sm text-muted-foreground">{highlight.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}