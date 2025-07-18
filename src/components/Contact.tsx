import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Github, Linkedin, Mail, Phone, MapPin } from "lucide-react";

export const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">Get In Touch</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Let's Build Something Amazing
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              I'm always open to discussing new opportunities, innovative projects, 
              or just having a conversation about technology.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-0">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Email</h3>
                    <p className="text-muted-foreground">alex.morgan@email.com</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Best for project inquiries and professional opportunities.
                </p>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-0">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Phone</h3>
                    <p className="text-muted-foreground">+1 (555) 123-4567</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Available for urgent matters and consultations.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="p-8 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-0 text-center">
              <h3 className="text-2xl font-semibold mb-4 text-foreground">Ready to Start a Project?</h3>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Whether you need a full-stack application, technical consultation, 
                or want to discuss an innovative idea, I'd love to hear from you.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                <Button size="lg" className="px-8">
                  <Mail className="h-5 w-5 mr-2" />
                  Send Email
                </Button>
                <Button variant="outline" size="lg" className="px-8">
                  Schedule Call
                </Button>
              </div>

              <div className="flex justify-center space-x-6">
                <a 
                  href="#" 
                  className="p-3 rounded-full bg-background hover:bg-muted transition-colors duration-300 shadow-sm hover:shadow-md"
                  aria-label="GitHub Profile"
                >
                  <Github className="h-6 w-6 text-foreground" />
                </a>
                <a 
                  href="#" 
                  className="p-3 rounded-full bg-background hover:bg-muted transition-colors duration-300 shadow-sm hover:shadow-md"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin className="h-6 w-6 text-foreground" />
                </a>
                <a 
                  href="#" 
                  className="p-3 rounded-full bg-background hover:bg-muted transition-colors duration-300 shadow-sm hover:shadow-md"
                  aria-label="Email Contact"
                >
                  <Mail className="h-6 w-6 text-foreground" />
                </a>
              </div>
            </CardContent>
          </Card>

          <div className="text-center mt-12">
            <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>San Francisco Bay Area, CA</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Open to remote work and relocation opportunities
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};