"""
Django database seeder script to populate:
- Navigation
- HeroSection
- AboutSection
- ExperienceSection
- SkillsSection
- ProjectsSection
- ContactSection

Execute with: python manage.py shell < seed_data.py
"""

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

# ═══════════════════════════════════════════════════════════════════════════════
# 1. NAVIGATION
# ═══════════════════════════════════════════════════════════════════════════════
nav, _ = Navigation.objects.get_or_create(
    id=1,
    defaults={
        'brand': 'McDonald Gudo',
        'resume_url': '#',
    }
)

nav_items_data = [
    ('About', '#about'),
    ('Experience', '#experience'),
    ('Skills', '#skills'),
    ('Projects', '#projects'),
    ('Contact', '#contact'),
]

for name, href in nav_items_data:
    NavItem.objects.get_or_create(navigation=nav, name=name, defaults={'href': href})

print("✓ Navigation populated")

# ═══════════════════════════════════════════════════════════════════════════════
# 2. HERO SECTION
# ═══════════════════════════════════════════════════════════════════════════════
hero, _ = HeroSection.objects.get_or_create(
    id=1,
    defaults={
        'name': 'McDonald Gudo',
        'title': 'Full-Stack Developer & Security Systems Specialist',
        'initials': 'MG',
        'description': 'Building scalable web applications, modern responsive interfaces, and mission-critical enterprise systems with Django, React, TypeScript, and Python.',
    }
)

HeroAction.objects.get_or_create(
    hero_section=hero,
    label='View Projects',
    defaults={'icon': 'ArrowDown', 'action': '#projects'}
)
HeroAction.objects.get_or_create(
    hero_section=hero,
    label='Contact Me',
    defaults={'icon': 'Mail', 'action': '#contact'}
)

print("✓ Hero Section populated")

# ═══════════════════════════════════════════════════════════════════════════════
# 3. ABOUT SECTION
# ═══════════════════════════════════════════════════════════════════════════════
about_section, _ = AboutSection.objects.get_or_create(
    id=1,
    defaults={
        'section_title': 'About Me',
        'section_subtitle': 'Background & Philosophy',
        'section_description': 'A versatile software engineer combining institutional discipline with cutting-edge web engineering and technical problem solving.',
        'journey_title': 'My Professional Journey',
        'journey_paragraphs': [
            "Accomplished professional with 9 years of dedicated service in correctional institutions, combined with specialized expertise in enterprise security systems infrastructure. Transitioned from institutional security leadership to specialization in biometric access control, surveillance technology deployment, and modern full-stack web development.",
            "Led successful implementation of 50+ biometric and CCTV installations across Zimbabwe and surrounding regions, serving enterprise clients with mission-critical security requirements. Demonstrated capability to manage complex multi-site deployments, coordinate technical teams, and deliver systems that meet the highest standards of security and reliability.",
            "Passionate about leveraging modern software architectures to solve real-world problems. Experienced in building performant APIs with Django REST Framework and dynamic frontend experiences using React, TypeScript, and Tailwind CSS.",
        ]
    }
)

highlights_data = [
    ('Code2', 'Clean Architecture', 'Writing maintainable, type-safe, and scalable code.'),
    ('Rocket', 'High Performance', 'Optimized APIs, fast load times, and reliable uptime.'),
    ('Users', 'Team Leadership', 'Trained 100+ personnel and coordinated multi-site deployments.'),
    ('Zap', 'Agile Problem Solver', 'Rapid diagnosis and resolution of complex technical issues.'),
]

for icon, title, desc in highlights_data:
    AboutHighlight.objects.get_or_create(
        about_section=about_section,
        title=title,
        defaults={'icon': icon, 'description': desc}
    )

print("✓ About Section populated")

# ═══════════════════════════════════════════════════════════════════════════════
# 4. EXPERIENCE SECTION
# ═══════════════════════════════════════════════════════════════════════════════
exp_section, _ = ExperienceSection.objects.get_or_create(
    id=1,
    defaults={
        'section_title': 'Professional Experience',
        'section_subtitle': 'Career Journey',
        'section_description': 'Comprehensive background spanning correctional services and specialized infrastructure systems deployment across southern Africa.',
    }
)

Experience.objects.get_or_create(
    id=1,
    defaults={
        'experience_section': exp_section,
        'title': 'Correctional Services Officer',
        'company': 'Zimbabwe Prison & Correctional Service',
        'employment_type': 'full-time',
        'location': 'Zimbabwe',
        'start_date': datetime(2015, 6, 1).date(),
        'end_date': datetime(2024, 6, 30).date(),
        'is_current': False,
        'description': 'Served with distinction for 9 years in institutional security and correctional operations. Managed facility-wide security protocols, oversaw inmate management systems, and ensured compliance with national penitentiary standards.',
        'achievements': [
            'Maintained 99.2% facility security compliance over 9 years of service',
            'Led security operations across multiple institutional facilities',
            'Implemented advanced facility management systems and protocols',
            'Trained and supervised 50+ correctional staff across various departments',
            'Achieved zero major security breaches under operational watch',
        ],
        'skills': [
            'Facility Security Management',
            'Team Leadership',
            'Systems Oversight',
            'Security Protocol Development',
            'Incident Management',
            'Compliance & Audit',
        ],
        'icon': 'Shield',
        'order': 1,
        'is_active': True,
    }
)

Experience.objects.get_or_create(
    id=2,
    defaults={
        'experience_section': exp_section,
        'title': 'Biometric Systems Specialist & Installation Lead',
        'company': 'Great People Systems',
        'employment_type': 'hybrid-remote',
        'location': 'Remote (Zimbabwe & Southern Africa)',
        'start_date': datetime(2023, 1, 1).date(),
        'end_date': None,
        'is_current': True,
        'description': 'Specializing in enterprise-grade biometric access control and CCTV surveillance system deployment across commercial and institutional facilities.',
        'achievements': [
            'Successfully deployed 50+ biometric access control systems nationwide',
            'Established seamless integration across 10+ major corporate branches',
            'Achieved 99.8% system uptime across all deployed installations',
            'Trained 100+ end-users and IT staff on biometric systems operation',
            'Managed concurrent multi-site deployments with zero project delays',
            'Developed comprehensive technical documentation and maintenance protocols',
        ],
        'skills': [
            'Biometric Access Control Systems',
            'CCTV Infrastructure Design',
            'Network Security Integration',
            'System Installation & Configuration',
            'Technical Documentation',
            'Client Training & Support',
        ],
        'icon': 'Lock',
        'order': 0,
        'is_active': True,
    }
)

print("✓ Experience Section populated")

# ═══════════════════════════════════════════════════════════════════════════════
# 5. SKILLS SECTION
# ═══════════════════════════════════════════════════════════════════════════════
skills_section, _ = SkillsSection.objects.get_or_create(
    id=1,
    defaults={
        'section_title': 'Skills & Capabilities',
        'section_subtitle': 'Technical Toolkit',
        'section_description': 'Core competencies and technologies applied across software development and hardware security systems.',
    }
)

categories_data = [
    ('Frontend Development', '#60a5fa', ['React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'Vite', 'HTML5/CSS3', 'Responsive Design']),
    ('Backend Engineering', '#a78bfa', ['Django', 'Django REST Framework', 'Python', 'RESTful APIs', 'Authentication & JWT', 'Microservices']),
    ('Databases & Storage', '#34d399', ['PostgreSQL', 'MySQL', 'SQLite', 'Redis', 'Database Indexing & Query Optimization']),
    ('DevOps & Tools', '#fbbf24', ['Git & GitHub', 'Docker', 'Linux/Bash', 'Vercel', 'PythonAnywhere', 'CI/CD Pipelines']),
    ('Security Systems', '#f87171', ['Biometric Access Control', 'CCTV Surveillance', 'Network Security', 'Access Management', 'Hardware Configuration']),
]

for title, color, skills_list in categories_data:
    SkillCategory.objects.get_or_create(
        skills_section=skills_section,
        title=title,
        defaults={'color': color, 'skills': skills_list}
    )

print("✓ Skills Section populated")

# ═══════════════════════════════════════════════════════════════════════════════
# 6. PROJECTS SECTION
# ═══════════════════════════════════════════════════════════════════════════════
projects_section, _ = ProjectsSection.objects.get_or_create(
    id=1,
    defaults={
        'section_title': 'Featured Projects',
        'section_subtitle': 'Selected Work',
        'section_description': 'A showcase of recent software applications, enterprise system deployments, and case studies.',
        'view_all_url': 'https://github.com/mcdtronix',
    }
)

projects_data = [
    {
        'id': 1,
        'title': 'Nationwide Biometric Access Control Deployment',
        'description': 'Enterprise-scale deployment of biometric access control and CCTV surveillance systems across 50+ commercial branch locations throughout Zimbabwe. Coordinated multi-site installations and user training for 1000+ end-users.',
        'tech': ['Biometric Systems', 'CCTV Technology', 'Access Control', 'Network Integration', 'System Administration'],
        'github': 'https://github.com/mcdtronix',
        'live': 'https://mcdtronix.co.zw',
        'featured': True,
        'order': 0,
        'priority': 100,
    },
    {
        'id': 2,
        'title': 'Developer Spotlight Portfolio & CMS API',
        'description': 'Dynamic portfolio and content management system built with Django REST Framework backend and modern React TypeScript frontend with Tailwind CSS and glassmorphism design.',
        'tech': ['React', 'TypeScript', 'Django REST Framework', 'PostgreSQL', 'Tailwind CSS'],
        'github': 'https://github.com/mcdtronix/developer-spotlight-portfolio',
        'live': 'https://mcdtronix.co.zw',
        'featured': True,
        'order': 1,
        'priority': 90,
    },
    {
        'id': 3,
        'title': 'Institutional Facility Management System',
        'description': 'Secure internal compliance and records management portal ensuring strict auditable access control, role-based authorization, and real-time activity logging.',
        'tech': ['Python', 'Django', 'PostgreSQL', 'Bootstrap', 'Security Compliance'],
        'github': 'https://github.com/mcdtronix',
        'live': 'https://mcdtronix.co.zw',
        'featured': False,
        'order': 2,
        'priority': 80,
    },
]

for p in projects_data:
    Project.objects.get_or_create(
        id=p['id'],
        defaults={
            'projects_section': projects_section,
            'title': p['title'],
            'description': p['description'],
            'tech': p['tech'],
            'github': p['github'],
            'live': p['live'],
            'featured': p['featured'],
            'order': p['order'],
            'priority': p['priority'],
            'is_active': True,
        }
    )

print("✓ Projects Section populated")

# ═══════════════════════════════════════════════════════════════════════════════
# 7. CONTACT SECTION
# ═══════════════════════════════════════════════════════════════════════════════
contact_section, _ = ContactSection.objects.get_or_create(
    id=1,
    defaults={
        'section_title': 'Get In Touch',
        'section_subtitle': 'Let\'s Connect',
        'section_description': 'Available for software engineering roles, security system consulting, and collaborative technical projects.',
        'cta_title': 'Have a project in mind?',
        'cta_description': 'Feel free to reach out via email, phone, or connect on LinkedIn and GitHub.',
        'location': 'Harare, Zimbabwe',
        'location_note': 'Available for remote work worldwide and on-site projects locally.',
    }
)

contact_methods = [
    ('email', 'Email Me', 'gudomacdonald16@gmail.com', 'Usually responds within 24 hours', 'Mail'),
    ('phone', 'Call / WhatsApp', '+263 77 000 0000', 'Monday to Friday, 8am - 5pm CAT', 'Phone'),
]

for m_type, label, val, desc, icon in contact_methods:
    ContactMethod.objects.get_or_create(
        contact_section=contact_section,
        type=m_type,
        defaults={'label': label, 'value': val, 'description': desc, 'icon': icon}
    )

social_links = [
    ('github', 'https://github.com/mcdtronix', 'Github'),
    ('linkedin', 'https://linkedin.com/in/mcdonald-gudo', 'Linkedin'),
    ('email', 'mailto:gudomacdonald16@gmail.com', 'Mail'),
]

for platform, url, icon in social_links:
    SocialLink.objects.get_or_create(
        contact_section=contact_section,
        platform=platform,
        defaults={'url': url, 'icon': icon}
    )

print("✓ Contact Section populated")
print("\n" + "="*80)
print("✓ Complete portfolio database seeding finished successfully!")
print("="*80)
