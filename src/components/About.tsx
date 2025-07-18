import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code2, Rocket, Users, Zap } from "lucide-react";

export const About = () => {
  const highlights = [
    {
      icon: Code2,
      title: "5+ Years Experience",
      description: "Full-stack development across diverse industries"
    },
    {
      icon: Rocket,
      title: "20+ Projects",
      description: "Successfully delivered scalable web applications"
    },
    {
      icon: Users,
      title: "Team Leadership",
      description: "Led development teams and mentored junior developers"
    },
    {
      icon: Zap,
      title: "Performance Focus",
      description: "Optimized applications serving 100k+ users"
    }
  ];

  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">About Me</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Building Digital Solutions That Matter
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              I'm a passionate full-stack developer with a proven track record of creating 
              robust, scalable applications that drive business growth and enhance user experiences.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h3 className="text-2xl font-semibold mb-6 text-foreground">My Journey</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Started as a curious computer science student, I've evolved into a seasoned developer 
                who thrives on solving complex problems with elegant solutions. My experience spans 
                startups to enterprise-level applications.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                I believe in writing clean, maintainable code and staying current with the latest 
                technologies. When I'm not coding, you'll find me contributing to open-source 
                projects or exploring new frameworks.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {highlights.map((highlight, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-0 text-center">
                    <highlight.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                    <h4 className="font-semibold text-foreground mb-2">{highlight.title}</h4>
                    <p className="text-sm text-muted-foreground">{highlight.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};