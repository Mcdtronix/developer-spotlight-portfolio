import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export const Skills = () => {
  const skillCategories = [
    {
      title: "Frontend",
      skills: ["React", "TypeScript", "Next.js", "Vue.js", "Tailwind CSS", "Redux", "Framer Motion"],
      color: "from-blue-500/20 to-cyan-500/20"
    },
    {
      title: "Backend",
      skills: ["Node.js", "Python", "PostgreSQL", "MongoDB", "GraphQL", "REST APIs", "Microservices"],
      color: "from-green-500/20 to-emerald-500/20"
    },
    {
      title: "DevOps & Tools",
      skills: ["AWS", "Docker", "Git", "CI/CD", "Kubernetes", "Terraform", "Monitoring"],
      color: "from-purple-500/20 to-violet-500/20"
    },
    {
      title: "Soft Skills",
      skills: ["Team Leadership", "Problem Solving", "Code Review", "Mentoring", "Agile", "Communication"],
      color: "from-orange-500/20 to-red-500/20"
    }
  ];

  return (
    <section id="skills" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Technical Skills</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Technologies I Master
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              A comprehensive toolkit built through years of hands-on experience and continuous learning.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {skillCategories.map((category, index) => (
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
};