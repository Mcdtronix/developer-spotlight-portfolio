import { ArrowDown, Github, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(59,130,246,0.1),transparent_50%)]" />
      
      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Profile image placeholder */}
          <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-primary to-primary-glow shadow-2xl flex items-center justify-center">
            <span className="text-4xl font-bold text-primary-foreground">AM</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Alex Morgan
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-4 font-medium">
            Senior Full Stack Developer
          </p>
          
          <p className="text-lg md:text-xl text-muted-foreground/80 mb-12 max-w-2xl mx-auto leading-relaxed">
            Crafting exceptional digital experiences with modern technologies. 
            Specialized in React, Node.js, and scalable web applications.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button size="lg" className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300">
              View My Work
              <ArrowDown className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300">
              Download Resume
            </Button>
          </div>
          
          <div className="flex justify-center space-x-6">
            <a href="#" className="p-3 rounded-full bg-card hover:bg-muted transition-colors duration-300 shadow-lg hover:shadow-xl">
              <Github className="h-6 w-6 text-foreground" />
            </a>
            <a href="#" className="p-3 rounded-full bg-card hover:bg-muted transition-colors duration-300 shadow-lg hover:shadow-xl">
              <Linkedin className="h-6 w-6 text-foreground" />
            </a>
            <a href="#" className="p-3 rounded-full bg-card hover:bg-muted transition-colors duration-300 shadow-lg hover:shadow-xl">
              <Mail className="h-6 w-6 text-foreground" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};