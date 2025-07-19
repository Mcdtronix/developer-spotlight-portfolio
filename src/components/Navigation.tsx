import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export interface NavItem {
  name: string;
  href: string;
}
export interface NavigationProps {
  brand: string;
  nav_items: NavItem[];
  resume_url: string;
}

export function Navigation({ brand, nav_items, resume_url }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-background/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <a href="#" className="text-xl font-bold text-foreground">
            {brand}
          </a>
          <div className="hidden md:flex items-center space-x-8">
            {nav_items.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-foreground/80 hover:text-primary transition-colors duration-200 font-medium"
              >
                {item.name}
              </a>
            ))}
            <Button variant="outline" size="sm" asChild>
              <a href={resume_url} target="_blank" rel="noopener noreferrer">Resume</a>
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
        {isMobileMenuOpen && (
          <div className="md:hidden bg-background border-t border-border">
            <div className="py-4 space-y-3">
              {nav_items.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block px-4 py-2 text-foreground/80 hover:text-primary transition-colors duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <div className="px-4 pt-2">
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <a href={resume_url} target="_blank" rel="noopener noreferrer">Resume</a>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}