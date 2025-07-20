import { useEffect, useState } from "react";
import { Navigation, NavigationProps } from "@/components/Navigation";
import { Hero, HeroProps } from "@/components/Hero";
import { About, AboutProps } from "@/components/About";
import { Skills, SkillsProps } from "@/components/Skills";
import { Projects, ProjectsProps } from "@/components/Projects";
import { Contact, ContactProps } from "@/components/Contact";
import { getAbout, getContact, getHero, getNavigation, getProjects, getSkills } from "@/lib/api";

const Index = () => {
  const [about, setAbout] = useState<AboutProps | null>(null);
  const [contact, setContact] = useState<ContactProps | null>(null);
  const [hero, setHero] = useState<HeroProps | null>(null);
  const [navigation, setNavigation] = useState<NavigationProps | null>(null);
  const [projects, setProjects] = useState<ProjectsProps | null>(null);
  const [skills, setSkills] = useState<SkillsProps | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [aboutData, contactData, heroData, navigationData, projectsData, skillsData] = await Promise.all([
        getAbout(),
        getContact(),
        getHero(),
        getNavigation(),
        getProjects(),
        getSkills(),
      ]);
      setAbout(Array.isArray(aboutData) ? aboutData[0] : aboutData?.results?.[0] || null);
      setContact(Array.isArray(contactData) ? contactData[0] : contactData?.results?.[0] || null);
      setHero(Array.isArray(heroData) ? heroData[0] : heroData?.results?.[0] || null);
      setNavigation(Array.isArray(navigationData) ? navigationData[0] : navigationData?.results?.[0] || null);
      setProjects(Array.isArray(projectsData) ? projectsData[0] : projectsData?.results?.[0] || null);
      setSkills(Array.isArray(skillsData) ? skillsData[0] : skillsData?.results?.[0] || null);
      setLoading(false);
    }
    fetchData();
  }, []);

  // Debug logging
  console.log("about", about);
  console.log("contact", contact);
  console.log("hero", hero);
  console.log("navigation", navigation);
  console.log("projects", projects);
  console.log("skills", skills);
  console.log("loading", loading);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  // TEMP: Show raw data for debugging
  if (!about || !contact || !hero || !navigation || !projects || !skills) {
    return <pre>{JSON.stringify({ about, contact, hero, navigation, projects, skills }, null, 2)}</pre>;
  }

  return (
    <div className="min-h-screen">
      <Navigation {...navigation} />
      <Hero {...hero} />
      <About {...about} />
      <Skills {...skills} />
      <Projects {...projects} />
      <Contact {...contact} />
      <footer className="bg-muted/30 py-8 text-center">
        <div className="container mx-auto px-6">
          <p className="text-muted-foreground">
            © 2024 Gudo macdonald. Built with Django, React, TypeScript & Tailwind CSS.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
