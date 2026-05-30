from django.db import models

class AboutSection(models.Model):
    section_title = models.CharField(max_length=200)
    section_subtitle = models.CharField(max_length=200)
    section_description = models.TextField()
    journey_title = models.CharField(max_length=200)
    # You can use a JSONField for paragraphs or a related model
    journey_paragraphs = models.JSONField(default=list)

class AboutHighlight(models.Model):
    ICON_CHOICES = [
        ("Code2", "Code2"),
        ("Rocket", "Rocket"),
        ("Users", "Users"),
        ("Zap", "Zap"),
        # Add more as needed
    ]
    about_section = models.ForeignKey(AboutSection, related_name="highlights", on_delete=models.CASCADE)
    icon = models.CharField(max_length=50, choices=ICON_CHOICES)
    title = models.CharField(max_length=100)
    description = models.CharField(max_length=255)

class ContactSection(models.Model):
    section_title = models.CharField(max_length=200)
    section_subtitle = models.CharField(max_length=200)
    section_description = models.TextField()
    cta_title = models.CharField(max_length=200)
    cta_description = models.TextField()
    location = models.CharField(max_length=200)
    location_note = models.CharField(max_length=255)

class ContactMethod(models.Model):
    TYPE_CHOICES = [
        ("email", "Email"),
        ("phone", "Phone"),
    ]
    ICON_CHOICES = [
        ("Mail", "Mail"),
        ("Phone", "Phone"),
    ]
    contact_section = models.ForeignKey(ContactSection, related_name="methods", on_delete=models.CASCADE)
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    label = models.CharField(max_length=100)
    value = models.CharField(max_length=100)
    description = models.CharField(max_length=255)
    icon = models.CharField(max_length=50, choices=ICON_CHOICES)

class SocialLink(models.Model):
    PLATFORM_CHOICES = [
        ("github", "GitHub"),
        ("linkedin", "LinkedIn"),
        ("email", "Email"),
    ]
    ICON_CHOICES = [
        ("Github", "Github"),
        ("Linkedin", "Linkedin"),
        ("Mail", "Mail"),
    ]
    contact_section = models.ForeignKey(ContactSection, related_name="social_links", on_delete=models.CASCADE)
    platform = models.CharField(max_length=20, choices=PLATFORM_CHOICES)
    url = models.URLField()
    icon = models.CharField(max_length=50, choices=ICON_CHOICES)

class HeroSection(models.Model):
    profile_image = models.ImageField(upload_to='projects/images/', blank=True, null=True)
    initials = models.CharField(max_length=10)
    name = models.CharField(max_length=100)
    title = models.CharField(max_length=100)
    description = models.TextField()

class HeroAction(models.Model):
    hero_section = models.ForeignKey(HeroSection, related_name="main_actions", on_delete=models.CASCADE)
    label = models.CharField(max_length=100)
    icon = models.CharField(max_length=50, blank=True, null=True)
    action = models.CharField(max_length=255)

class Navigation(models.Model):
    brand = models.CharField(max_length=100)
    resume_url = models.URLField()

class NavItem(models.Model):
    navigation = models.ForeignKey(Navigation, related_name="nav_items", on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    href = models.CharField(max_length=100)

class ProjectsSection(models.Model):
    section_title = models.CharField(max_length=200)
    section_subtitle = models.CharField(max_length=200)
    section_description = models.TextField()
    view_all_url = models.URLField()

class Project(models.Model):
    projects_section = models.ForeignKey(ProjectsSection, related_name="projects", on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField()
    image = models.ImageField(upload_to='projects/images/', blank=True, null=True)
    github = models.URLField()
    live = models.URLField()
    featured = models.BooleanField(default=False)
    tech = models.JSONField(default=list)  # List of technologies
    
    # ── Ordering Fields ──
    order = models.PositiveIntegerField(default=0, help_text="Display order (0 = first)")
    priority = models.PositiveIntegerField(default=0, help_text="Optional internal priority marker")
    
    # ── Display Control ──
    is_active = models.BooleanField(default=True, help_text="Show/hide project on portfolio")
    display_date = models.DateTimeField(auto_now_add=True, help_text="When project was added")
    
    class Meta:
        ordering = ['order', 'id']
        indexes = [
            models.Index(fields=['order']),
            models.Index(fields=['priority']),
            models.Index(fields=['featured', 'is_active']),
        ]

class SkillsSection(models.Model):
    section_title = models.CharField(max_length=200)
    section_subtitle = models.CharField(max_length=200)
    section_description = models.TextField()

class SkillCategory(models.Model):
    skills_section = models.ForeignKey(SkillsSection, related_name="categories", on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    color = models.CharField(max_length=100)
    skills = models.JSONField(default=list)  # List of skills

class ExperienceSection(models.Model):
    section_title = models.CharField(max_length=200)
    section_subtitle = models.CharField(max_length=200)
    section_description = models.TextField()

class Experience(models.Model):
    EMPLOYMENT_TYPE_CHOICES = [
        ("full-time", "Full-time"),
        ("part-time", "Part-time"),
        ("contract", "Contract"),
        ("hybrid-remote", "Hybrid Remote"),
        ("remote", "Remote"),
    ]
    
    experience_section = models.ForeignKey(ExperienceSection, related_name="experiences", on_delete=models.CASCADE)
    title = models.CharField(max_length=150, help_text="Job title")
    company = models.CharField(max_length=150)
    employment_type = models.CharField(max_length=30, choices=EMPLOYMENT_TYPE_CHOICES)
    location = models.CharField(max_length=150)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True, help_text="Leave blank if current role")
    is_current = models.BooleanField(default=False)
    description = models.TextField(help_text="Main role description")
    achievements = models.JSONField(default=list, help_text="List of key achievements")
    skills = models.JSONField(default=list, help_text="List of relevant skills")
    icon = models.CharField(max_length=50, default="Briefcase", help_text="Lucide icon name")
    
    # Display control
    order = models.PositiveIntegerField(default=0, help_text="Display order (0 = first)")
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['-is_current', '-start_date', 'order']
        indexes = [
            models.Index(fields=['is_active', '-start_date']),
        ]
