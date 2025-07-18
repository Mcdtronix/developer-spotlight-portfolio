from rest_framework import serializers
from .models import (
    AboutSection, AboutHighlight,
    ContactSection, ContactMethod, SocialLink,
    HeroSection, HeroAction,
    Navigation, NavItem,
    ProjectsSection, Project,
    SkillsSection, SkillCategory
)

class AboutHighlightSerializer(serializers.ModelSerializer):
    class Meta:
        model = AboutHighlight
        fields = ['icon', 'title', 'description']

class AboutSectionSerializer(serializers.ModelSerializer):
    highlights = AboutHighlightSerializer(many=True, read_only=True)
    class Meta:
        model = AboutSection
        fields = [
            'section_title', 'section_subtitle', 'section_description',
            'journey_title', 'journey_paragraphs', 'highlights'
        ]

class ContactMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMethod
        fields = ['type', 'label', 'value', 'description', 'icon']

class SocialLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialLink
        fields = ['platform', 'url', 'icon']

class ContactSectionSerializer(serializers.ModelSerializer):
    methods = ContactMethodSerializer(many=True, read_only=True)
    social_links = SocialLinkSerializer(many=True, read_only=True)
    class Meta:
        model = ContactSection
        fields = [
            'section_title', 'section_subtitle', 'section_description',
            'cta_title', 'cta_description', 'location', 'location_note',
            'methods', 'social_links'
        ]

class HeroActionSerializer(serializers.ModelSerializer):
    class Meta:
        model = HeroAction
        fields = ['label', 'icon', 'action']

class HeroSectionSerializer(serializers.ModelSerializer):
    main_actions = HeroActionSerializer(many=True, read_only=True)
    class Meta:
        model = HeroSection
        fields = [
            'profile_image', 'initials', 'name', 'title', 'description', 'main_actions'
        ]

class NavItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = NavItem
        fields = ['name', 'href']

class NavigationSerializer(serializers.ModelSerializer):
    nav_items = NavItemSerializer(many=True, read_only=True)
    class Meta:
        model = Navigation
        fields = ['brand', 'resume_url', 'nav_items']

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = [
            'title', 'description', 'image', 'tech', 'github', 'live', 'featured'
        ]

class ProjectsSectionSerializer(serializers.ModelSerializer):
    projects = ProjectSerializer(many=True, read_only=True)
    class Meta:
        model = ProjectsSection
        fields = [
            'section_title', 'section_subtitle', 'section_description',
            'view_all_url', 'projects'
        ]

class SkillCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SkillCategory
        fields = ['title', 'color', 'skills']

class SkillsSectionSerializer(serializers.ModelSerializer):
    categories = SkillCategorySerializer(many=True, read_only=True)
    class Meta:
        model = SkillsSection
        fields = [
            'section_title', 'section_subtitle', 'section_description', 'categories'
        ]
