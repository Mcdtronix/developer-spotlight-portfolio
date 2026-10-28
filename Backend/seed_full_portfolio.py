"""
Comprehensive database seeding script to restore and populate all portfolio sections.
Run via: python seed_full_portfolio.py
"""

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Core.settings')
django.setup()

from datetime import datetime
from api.models import (
    Navigation, NavItem,
    HeroSection, HeroAction,
    AboutSection, AboutHighlight,
    ExperienceSection, Experience,
    SkillsSection, SkillCategory,
    ProjectsSection, Project,
    ContactSection, ContactMethod, SocialLink
)

print("Starting portfolio restoration...")

# +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
# 1. NAVIGATION
# +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
nav, _ = Navigation.objects.get_or_create(id=1)
nav.brand = "Macdonald Portfolio"
nav.resume_url = "https://www.cvpeopleafrica.com/jobs/view/zimbabwe/information-technology-telecommunications/it-project-manager-banking/35326"
nav.save()

NavItem.objects.filter(navigation=nav).delete()
nav_items_data = [
    {"name": "About", "href": "#about"},
    {"name": "Experience", "href": "#experience"},
    {"name": "Skills", "href": "#skills"},
    {"name": "Projects", "href": "#projects"},
    {"name": "Contact", "href": "#contact"},
]
for item in nav_items_data:
    NavItem.objects.create(navigation=nav, name=item["name"], href=item["href"])
print("+++ Navigation populated with 5 items")

# +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
# 2. HERO SECTION
# +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
hero, _ = HeroSection.objects.get_or_create(id=1)
hero.initials = "MKG"
hero.name = "Macdonald Kudakwashe Gudo"
hero.title = "Software Developer & Security Systems Specialist"
hero.description = "Crafting exceptional digital experiences with modern technologies. Specialized in Django, React, biometric security systems, and scalable full-stack web applications."
hero.profile_image = "projects/images/20260615_080627.jpg"
hero.save()

HeroAction.objects.filter(hero_section=hero).delete()
HeroAction.objects.create(hero_section=hero, label="Explore Work", icon="ArrowDown", action="#projects")
HeroAction.objects.create(hero_section=hero, label="Get In Touch", icon="Mail", action="#contact")
print("+++ Hero Section configured with actions")

# +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
# 3. ABOUT SECTION
# +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
about, _ = AboutSection.objects.get_or_create(id=1)
about.section_title = "Building Software Solutions That Really Matter"
about.section_subtitle = "About Me"
about.section_description = "I'm a passionate full-stack developer and security systems specialist with a proven track record of creating robust, scalable applications that drive business growth and operational security."
about.journey_title = "My Journey"
about.journey_paragraphs = [
    "Accomplished professional with 9 years of dedicated service in correctional institutions, combined with specialized expertise in enterprise security systems infrastructure. Transitioned from institutional security leadership to specialization in biometric access control and surveillance technology deployment, bringing operational excellence and technical precision to every project.",
    "Led successful implementation of 50+ biometric and CCTV installations across Zimbabwe and surrounding regions, serving enterprise clients with mission-critical security requirements. Demonstrated capability to manage complex multi-site deployments, coordinate technical teams, and deliver systems that meet the highest standards of security and reliability.",
    "Passionate about leveraging technology to enhance security infrastructure and operational efficiency. Committed to continuous learning and professional development, with proven expertise in system design, technical documentation, and stakeholder communication."
]
about.save()

AboutHighlight.objects.filter(about_section=about).delete()
highlights_data = [
    {"icon": "Code2", "title": "2+ Years Dev Experience", "description": "Full-stack development across modern web technologies"},
    {"icon": "Rocket", "title": "Systems Leadership", "description": "Led deployment teams across enterprise installations"},
    {"icon": "Users", "title": "20+ Projects Delivered", "description": "Successfully delivered scalable web apps & security infrastructure"},
    {"icon": "Zap", "title": "99.8% Uptime Focus", "description": "High-reliability architecture serving enterprise facilities"}
]
for h in highlights_data:
    AboutHighlight.objects.create(about_section=about, **h)
print("+++ About Section populated with 4 highlights")

# +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
# 4. EXPERIENCE SECTION
# +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
exp_section, _ = ExperienceSection.objects.get_or_create(id=1)
exp_section.section_title = "Professional Experience"
exp_section.section_subtitle = "Career Journey"
exp_section.section_description = "Comprehensive background spanning correctional services and specialized infrastructure systems deployment across southern Africa."
exp_section.save()

Experience.objects.filter(experience_section=exp_section).delete()
Experience.objects.create(
    id=1,
    experience_section=exp_section,
    title="Biometric Systems Specialist & Installation Lead",
    company="Great People Systems",
    employment_type="hybrid-remote",
    location="Remote (Zimbabwe & Southern Africa)",
    start_date=datetime(2023, 1, 1).date(),
    end_date=None,
    is_current=True,
    description="Specializing in enterprise-grade biometric access control and CCTV surveillance system deployment across commercial and institutional facilities. Lead nationwide multi-site installations with zero downtime deployment strategy. Manage end-to-end system integration, technical documentation, and client training programs.",
    achievements=[
        "Successfully deployed 50+ biometric access control systems nationwide",
        "Established seamless integration across 10+ major corporate branches",
        "Achieved 99.8% system uptime across all deployed installations",
        "Trained 100+ end-users and IT staff on biometric systems operation",
        "Managed concurrent multi-site deployments with zero project delays",
        "Developed comprehensive technical documentation and maintenance protocols",
    ],
    skills=[
        "Biometric Access Control Systems",
        "CCTV Infrastructure Design",
        "Network Security Integration",
        "System Installation & Configuration",
        "Technical Documentation",
        "Client Training & Support",
        "Multi-site Project Management",
        "Hardware & Software Integration",
    ],
    icon="Lock",
    order=0,
    is_active=True,
)

Experience.objects.create(
    id=2,
    experience_section=exp_section,
    title="Correctional Services Officer",
    company="Zimbabwe Prison & Correctional Service",
    employment_type="full-time",
    location="Zimbabwe",
    start_date=datetime(2015, 6, 1).date(),
    end_date=datetime(2024, 6, 30).date(),
    is_current=False,
    description="Served with distinction for 9 years in institutional security and correctional operations. Managed facility-wide security protocols, oversaw inmate management systems, and ensured compliance with national penitentiary standards. Developed expertise in security infrastructure assessment and system optimization.",
    achievements=[
        "Maintained 99.2% facility security compliance over 9 years of service",
        "Led security operations across multiple institutional facilities",
        "Implemented advanced facility management systems and protocols",
        "Trained and supervised 50+ correctional staff across various departments",
        "Achieved zero major security breaches under operational watch",
    ],
    skills=[
        "Facility Security Management",
        "Team Leadership",
        "Systems Oversight",
        "Security Protocol Development",
        "Incident Management",
        "Compliance & Audit",
    ],
    icon="Shield",
    order=1,
    is_active=True,
)
print("+++ Experience Section populated with 2 roles")

# +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
# 5. SKILLS SECTION
# +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
skills_sec, _ = SkillsSection.objects.get_or_create(id=1)
skills_sec.section_title = "Technologies I Master"
skills_sec.section_subtitle = "Technical Skills"
skills_sec.section_description = "A comprehensive toolkit built through years of hands-on experience and continuous learning."
skills_sec.save()

SkillCategory.objects.filter(skills_section=skills_sec).delete()
skills_categories = [
    {
        "title": "Frontend",
        "color": "skyblue",
        "skills": ["React js", "TypeScript", "HTML5", "Bootstrap 5", "Tailwind CSS", "Next.js"]
    },
    {
        "title": "Backend",
        "color": "lime",
        "skills": ["Python", "Django", "FastAPI", "PostgreSQL", "RESTful APIs", "Microservices"]
    },
    {
        "title": "DevOps & Cloud",
        "color": "pink",
        "skills": ["AWS", "Docker", "Git & GitHub", "CI/CD Pipelines", "Linux", "Nginx"]
    },
    {
        "title": "Security Systems",
        "color": "#f87171",
        "skills": ["Biometric Access Control", "CCTV Surveillance", "Network Security", "Access Management", "System Integration", "Hardware Configuration"]
    }
]
for cat in skills_categories:
    SkillCategory.objects.create(skills_section=skills_sec, **cat)
print("+++ Skills Section populated with 4 categories")

# +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
# 6. PROJECTS SECTION
# +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
proj_sec, _ = ProjectsSection.objects.get_or_create(id=1)
proj_sec.section_title = "Projects That Made Impact"
proj_sec.section_subtitle = "Featured Work"
proj_sec.section_description = "A selection of projects showcasing my ability to deliver scalable, user-focused solutions across different industries and technologies."
proj_sec.view_all_url = "https://projecttrack.pythonanywhere.com/"
proj_sec.save()

Project.objects.filter(projects_section=proj_sec).delete()
projects_data = [
    {
        "id": 1,
        "title": "Nationwide Biometric Access Control Deployment",
        "description": "Enterprise-scale deployment of biometric access control and CCTV surveillance systems across 50+ commercial branch locations throughout Zimbabwe. Coordinated multi-site installations, systems integration, user training, and ongoing technical support for 1000+ end-users. Achieved industry-leading 99.8% uptime and zero-downtime deployments.",
        "image": "projects/images/Screenshot_115.png",
        "github": "https://github.com/Mcdtronix",
        "live": "",
        "featured": True,
        "tech": ["Biometric Systems", "CCTV Technology", "Access Control", "Network Integration", "System Administration"],
        "order": 0,
        "priority": 100,
        "is_active": True
    },
    {
        "id": 2,
        "title": "Project Tracker",
        "description": "Collaborative project management tool with real-time updates, team workflows, and analytics dashboard. Used by 200+ teams.",
        "image": "projects/images/Screenshot_115.png",
        "github": "https://github.com/Mcdtronix/Project_Tracker",
        "live": "https://projecttrack.pythonanywhere.com/",
        "featured": True,
        "tech": ["PostgreSQL", "React JS", "Django", "TypeScript"],
        "order": 1,
        "priority": 90,
        "is_active": True
    },
    {
        "id": 3,
        "title": "Travelix",
        "description": "A comprehensive tourism platform showcasing exciting destinations and attractions across Zimbabwe with interactive itineraries.",
        "image": "projects/images/Screenshot_113.png",
        "github": "https://github.com/Mcdtronix/Travelling",
        "live": "http://ropafadzo.pythonanywhere.com/",
        "featured": False,
        "tech": ["PostgreSQL", "React JS", "Django", "TypeScript"],
        "order": 2,
        "priority": 80,
        "is_active": True
    },
    {
        "id": 4,
        "title": "Tourism Booking Platform",
        "description": "A modern travel booking website that allows users to search and book various travel services including hotels, flights, car rentals, and cruises.",
        "image": "projects/images/Screenshot_114.png",
        "github": "https://github.com/Mcdtronix/Tourism_Website",
        "live": "http://mcdtronix.pythonanywhere.com/",
        "featured": False,
        "tech": ["PostgreSQL", "React JS", "Django", "TypeScript"],
        "order": 3,
        "priority": 70,
        "is_active": True
    }
]
for p in projects_data:
    Project.objects.create(projects_section=proj_sec, **p)
print("+++ Projects Section populated with 4 projects")

# +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
# 7. CONTACT SECTION
# +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
contact_sec, _ = ContactSection.objects.get_or_create(id=1)
contact_sec.section_title = "Let's Solve A Problem Using Technology"
contact_sec.section_subtitle = "Get In Touch"
contact_sec.section_description = "I'm always open to discussing new opportunities, innovative projects, or just having a conversation about technology."
contact_sec.cta_title = "Ready to Start a Project?"
contact_sec.cta_description = "Whether you need a full-stack application, technical consultation, or want to discuss an innovative idea, I'd love to hear from you."
contact_sec.location = "Great People Systems, Belvedere, Harare"
contact_sec.location_note = "Open to remote work and relocation opportunities anywhere"
contact_sec.save()

ContactMethod.objects.filter(contact_section=contact_sec).delete()
ContactMethod.objects.create(
    contact_section=contact_sec,
    type="email",
    label="Email",
    value="gudomacdonald16@gmail.com",
    description="Best for project inquiries and professional opportunities.",
    icon="Mail"
)
ContactMethod.objects.create(
    contact_section=contact_sec,
    type="phone",
    label="Phone",
    value="+263771076744",
    description="Available for urgent matters and consultations.",
    icon="Phone"
)

SocialLink.objects.filter(contact_section=contact_sec).delete()
SocialLink.objects.create(
    contact_section=contact_sec,
    platform="github",
    url="https://github.com/Mcdtronix",
    icon="Github"
)
SocialLink.objects.create(
    contact_section=contact_sec,
    platform="linkedin",
    url="https://www.linkedin.com/feed/",
    icon="Linkedin"
)
SocialLink.objects.create(
    contact_section=contact_sec,
    platform="email",
    url="mailto:gudomacdonald16@gmail.com",
    icon="Mail"
)
print("+++ Contact Section populated with methods and social links")

print("\n" + "="*80)
print("++++ FULL PORTFOLIO RESTORATION COMPLETE!")
print("="*80)
