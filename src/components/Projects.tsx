import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ExternalLink, Github } from "lucide-react";

export const Projects = () => {
  const projects = [
    {
      title: "E-Commerce Platform",
      description: "Full-stack e-commerce solution with real-time inventory, payment processing, and admin dashboard. Built for a client serving 50k+ customers.",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
      tech: ["React", "Node.js", "PostgreSQL", "Stripe", "AWS"],
      github: "#",
      live: "#",
      featured: true
    },
    {
      title: "Task Management SaaS",
      description: "Collaborative project management tool with real-time updates, team workflows, and analytics dashboard. Used by 200+ teams.",
      image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=400&fit=crop",
      tech: ["Next.js", "TypeScript", "Prisma", "WebSocket", "Vercel"],
      github: "#",
      live: "#",
      featured: true
    },
    {
      title: "Financial Dashboard",
      description: "Real-time financial analytics platform with interactive charts, portfolio tracking, and automated reporting features.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
      tech: ["Vue.js", "Python", "FastAPI", "Chart.js", "Docker"],
      github: "#",
      live: "#",
      featured: false
    },
    {
      title: "AI Content Generator",
      description: "Machine learning-powered content creation tool with natural language processing and automated publishing workflows.",
      image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop",
      tech: ["React", "Python", "TensorFlow", "OpenAI", "MongoDB"],
      github: "#",
      live: "#",
      featured: false
    }
  ];

  return (
    <section id="projects" className="py-20 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Featured Work</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Projects That Made Impact
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              A selection of projects showcasing my ability to deliver scalable, 
              user-focused solutions across different industries and technologies.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <Card 
                key={index} 
                className={`group overflow-hidden hover:shadow-xl transition-all duration-300 ${
                  project.featured ? 'lg:col-span-2' : ''
                }`}
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {project.featured && (
                    <Badge className="absolute top-4 left-4 bg-primary text-primary-foreground">
                      Featured
                    </Badge>
                  )}
                </div>
                
                <CardContent className="p-6">
                  <h3 className="text-2xl font-semibold mb-3 text-foreground group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech.map((tech, techIndex) => (
                      <Badge key={techIndex} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
                
                <CardFooter className="p-6 pt-0 flex gap-3">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Github className="h-4 w-4 mr-2" />
                    Code
                  </Button>
                  <Button size="sm" className="flex-1">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Live Demo
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="px-8">
              View All Projects
              <Github className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};