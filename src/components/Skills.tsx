import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

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

export function Skills({ section_title, section_subtitle, section_description, categories }: SkillsProps) {
  return (
    <section id="skills" className="py-20 bg-background">
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
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <Card key={index} className={`p-6 bg-gradient-to-br ${category.color} hover:shadow-lg transition-shadow duration-300`}>
                <CardContent className="p-0">
                  <h3 className="text-xl font-semibold mb-4 text-foreground">{category.title}</h3>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill, skillIndex) => (
                      <Badge
                        key={skillIndex}
                        variant="secondary"
                        className="text-xs bg-background/80 hover:bg-background transition-colors"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}