import { ArrowDown, Github, Linkedin, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface HeroAction {
  label: string;
  icon?: string;
  action: string;
}
export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}
export interface HeroProps {
  profile_image?: string | null;
  initials: string;
  name: string;
  title: string;
  description: string;
  main_actions: HeroAction[];
  social_links?: SocialLink[];
}

const iconMap = {
  ArrowDown,
  Github,
  Linkedin,
  Mail,
};

export function Hero({ profile_image, initials, name, title, description, main_actions = [], social_links = [] }: HeroProps) {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(59,130,246,0.1),transparent_50%)]" />
      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="w-32 h-32 mx-auto mb-8 rounded-full bg-gradient-to-br from-primary to-primary-glow shadow-2xl flex items-center justify-center overflow-hidden">
            {profile_image ? (
              <img src={profile_image} alt={name} className="w-full h-full object-cover rounded-full" />
            ) : (
              <span className="text-4xl font-bold text-primary-foreground">{initials}</span>
            )}
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            {name}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-4 font-medium">
            {title}
          </p>
          <p className="text-lg md:text-xl text-muted-foreground/80 mb-12 max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            {main_actions.map((action, i) => {
              const Icon = iconMap[action.icon || "ArrowDown"] || null;
              return (
                <Button key={i} size="lg" className="text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300">
                  {action.label}
                  {Icon && <Icon className="ml-2 h-5 w-5" />}
                </Button>
              );
            })}
          </div>
          <div className="flex justify-center space-x-6">
            {social_links.map((link, i) => {
              const Icon = iconMap[link.icon] || null;
              return (
                <a key={i} href={link.url} className="p-3 rounded-full bg-card hover:bg-muted transition-colors duration-300 shadow-lg hover:shadow-xl">
                  {Icon && <Icon className="h-6 w-6 text-foreground" />}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}