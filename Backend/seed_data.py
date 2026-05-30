"""
Django shell script to populate Experience, Skills, and Projects data
Execute with: python manage.py shell < seed_data.py
"""

from datetime import datetime
from api.models import ExperienceSection, Experience, SkillsSection, SkillCategory, ProjectsSection, Project, AboutSection

# ═══════════════════════════════════════════════════════════════════════════════
# EXPERIENCE SECTION
# ═══════════════════════════════════════════════════════════════════════════════

exp_section, _ = ExperienceSection.objects.get_or_create(
    id=1,
    defaults={
        'section_title': 'Professional Experience',
        'section_subtitle': 'Career Journey',
        'section_description': 'Comprehensive background spanning correctional services and specialized infrastructure systems deployment across southern Africa.',
    }
)

# Experience 1: Zimbabwe Prison & Correctional Service
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
        'description': 'Served with distinction for 9 years in institutional security and correctional operations. Managed facility-wide security protocols, oversaw inmate management systems, and ensured compliance with national penitentiary standards. Developed expertise in security infrastructure assessment and system optimization.',
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

# Experience 2: Great People Systems (Biometric & CCTV Installations)
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
        'description': 'Specializing in enterprise-grade biometric access control and CCTV surveillance system deployment across commercial and institutional facilities. Lead nationwide multi-site installations with zero downtime deployment strategy. Manage end-to-end system integration, technical documentation, and client training programs.',
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
            'Multi-site Project Management',
            'Hardware & Software Integration',
        ],
        'icon': 'Lock',
        'order': 0,
        'is_active': True,
    }
)

print("✓ Experience section created with 2 roles")

# ═══════════════════════════════════════════════════════════════════════════════
# ADD SECURITY SKILLS TO SKILLS SECTION
# ═══════════════════════════════════════════════════════════════════════════════

skills_section = SkillsSection.objects.first()
if skills_section:
    # Add Security Systems category
    security_category, _ = SkillCategory.objects.get_or_create(
        skills_section=skills_section,
        title='Security Systems',
        defaults={
            'color': '#f87171',  # Rose color for security
            'skills': [
                'Biometric Access Control',
                'CCTV Surveillance',
                'Network Security',
                'Access Management',
                'System Integration',
                'Hardware Configuration',
            ]
        }
    )
    print("✓ Security Systems skills category added")

# ═══════════════════════════════════════════════════════════════════════════════
# ADD CASE STUDY PROJECT: Biometric Deployment
# ═══════════════════════════════════════════════════════════════════════════════

projects_section = ProjectsSection.objects.first()
if projects_section:
    Project.objects.get_or_create(
        id=99,  # Special ID for case study
        defaults={
            'projects_section': projects_section,
            'title': 'Nationwide Biometric Access Control Deployment',
            'description': 'Enterprise-scale deployment of biometric access control and CCTV surveillance systems across 50+ commercial branch locations throughout Zimbabwe. Coordinated multi-site installations, systems integration, user training, and ongoing technical support for 1000+ end-users. Achieved industry-leading 99.8% uptime and zero-downtime deployments.',
            'image': None,
            'github': '',
            'live': '',
            'featured': True,
            'tech': [
                'Biometric Systems',
                'CCTV Technology',
                'Access Control',
                'Network Integration',
                'System Administration',
            ],
            'order': 0,
            'priority': 100,
            'is_active': True,
        }
    )
    print("✓ Case study project added: Biometric Deployment")

# ═══════════════════════════════════════════════════════════════════════════════
# UPDATE ABOUT SECTION WITH PROFESSIONAL NARRATIVE
# ═══════════════════════════════════════════════════════════════════════════════

about_section = AboutSection.objects.first()
if about_section:
    about_section.journey_paragraphs = [
        "Accomplished professional with 9 years of dedicated service in correctional institutions, combined with specialized expertise in enterprise security systems infrastructure. Transitioned from institutional security leadership to specialization in biometric access control and surveillance technology deployment, bringing operational excellence and technical precision to every project.",
        "Led successful implementation of 50+ biometric and CCTV installations across Zimbabwe and surrounding regions, serving enterprise clients with mission-critical security requirements. Demonstrated capability to manage complex multi-site deployments, coordinate technical teams, and deliver systems that meet the highest standards of security and reliability.",
        "Passionate about leveraging technology to enhance security infrastructure and operational efficiency. Committed to continuous learning and professional development, with proven expertise in system design, technical documentation, and stakeholder communication.",
    ]
    about_section.save()
    print("✓ About section narrative updated")

print("\n" + "="*80)
print("✓ Database seeding completed successfully!")
print("="*80)
