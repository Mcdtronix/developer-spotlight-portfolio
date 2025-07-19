import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Github, Linkedin, Mail, Phone, MapPin } from "lucide-react";

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

const iconMap = {
  Mail,
  Phone,
  Github,
  Linkedin,
};

export function Contact({ section_title, section_subtitle, section_description, cta_title, cta_description, location, location_note, methods, social_links }: ContactProps) {
  return (
    <section id="contact" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4">{section_subtitle}</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              {section_title}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {section_description}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {methods.map((method, i) => {
              const Icon = iconMap[method.icon] || null;
              return (
                <Card key={i} className="p-6 hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-0">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        {Icon && <Icon className="h-5 w-5 text-primary" />}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{method.label}</h3>
                        <p className="text-muted-foreground">{method.value}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{method.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="p-8 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-0 text-center">
              <h3 className="text-2xl font-semibold mb-4 text-foreground">{cta_title}</h3>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                {cta_description}
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
                {social_links.map((link, i) => {
                  const Icon = iconMap[link.icon] || null;
                  return (
                    <a
                      key={i}
                      href={link.url}
                      className="p-3 rounded-full bg-background hover:bg-muted transition-colors duration-300 shadow-sm hover:shadow-md"
                      aria-label={`${link.platform} Profile`}
                    >
                      {Icon && <Icon className="h-6 w-6 text-foreground" />}
                    </a>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <div className="text-center mt-12">
            <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{location}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {location_note}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}