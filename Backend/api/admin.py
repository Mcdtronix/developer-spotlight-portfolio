from django.contrib import admin
from .models import (
    AboutSection, AboutHighlight,
    ContactSection, ContactMethod, SocialLink,
    HeroSection, HeroAction,
    Navigation, NavItem,
    ProjectsSection, Project,
    SkillsSection, SkillCategory,
    ExperienceSection, Experience
)

class AboutHighlightInline(admin.TabularInline):
    model = AboutHighlight
    extra = 1

@admin.register(AboutSection)
class AboutSectionAdmin(admin.ModelAdmin):
    inlines = [AboutHighlightInline]
    list_display = ('section_title', 'section_subtitle')

class ContactMethodInline(admin.TabularInline):
    model = ContactMethod
    extra = 1

class SocialLinkInline(admin.TabularInline):
    model = SocialLink
    extra = 1

@admin.register(ContactSection)
class ContactSectionAdmin(admin.ModelAdmin):
    inlines = [ContactMethodInline, SocialLinkInline]
    list_display = ('section_title', 'section_subtitle', 'location')

class HeroActionInline(admin.TabularInline):
    model = HeroAction
    extra = 1

@admin.register(HeroSection)
class HeroSectionAdmin(admin.ModelAdmin):
    inlines = [HeroActionInline]
    list_display = ('name', 'title')

class NavItemInline(admin.TabularInline):
    model = NavItem
    extra = 1

@admin.register(Navigation)
class NavigationAdmin(admin.ModelAdmin):
    inlines = [NavItemInline]
    list_display = ('brand', 'resume_url')

class ProjectInline(admin.TabularInline):
    model = Project
    extra = 1
    fields = (
        'order', 'title', 'description', 'image', 'tech',
        'github', 'live', 'featured', 'is_active', 'priority'
    )
    ordering = ('order', 'id')

@admin.register(ProjectsSection)
class ProjectsSectionAdmin(admin.ModelAdmin):
    inlines = [ProjectInline]
    list_display = ('section_title', 'section_subtitle')

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('order', 'title', 'featured', 'is_active', 'priority', 'display_date')
    list_display_links = ['title']
    list_editable = ('order', 'featured', 'is_active', 'priority')
    list_filter = ('is_active', 'featured')
    search_fields = ('title', 'description')
    ordering = ('order', 'id')

class SkillCategoryInline(admin.TabularInline):
    model = SkillCategory
    extra = 1

@admin.register(SkillsSection)
class SkillsSectionAdmin(admin.ModelAdmin):
    inlines = [SkillCategoryInline]
    list_display = ('section_title', 'section_subtitle')

class ExperienceInline(admin.TabularInline):
    model = Experience
    extra = 1

@admin.register(ExperienceSection)
class ExperienceSectionAdmin(admin.ModelAdmin):
    inlines = [ExperienceInline]
    list_display = ('section_title', 'section_subtitle')

@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = ('title', 'company', 'location', 'is_current', 'start_date', 'order', 'is_active')
    list_filter = ('is_current', 'is_active', 'employment_type', 'start_date')
    search_fields = ('title', 'company', 'location')
    ordering = ('-is_current', '-start_date', 'order')
