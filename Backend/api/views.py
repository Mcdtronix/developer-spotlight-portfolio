from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from .models import (
    AboutSection, ContactSection, HeroSection, Navigation, ProjectsSection, SkillsSection
)
from .serializers import (
    AboutSectionSerializer, ContactSectionSerializer, HeroSectionSerializer,
    NavigationSerializer, ProjectsSectionSerializer, SkillsSectionSerializer
)

# Create your views here.

class AboutSectionViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint for viewing About section content."""
    queryset = AboutSection.objects.all()
    serializer_class = AboutSectionSerializer
    permission_classes = [AllowAny]

class ContactSectionViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint for viewing Contact section content."""
    queryset = ContactSection.objects.all()
    serializer_class = ContactSectionSerializer
    permission_classes = [AllowAny]

class HeroSectionViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint for viewing Hero section content."""
    queryset = HeroSection.objects.all()
    serializer_class = HeroSectionSerializer
    permission_classes = [AllowAny]

class NavigationViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint for viewing Navigation content."""
    queryset = Navigation.objects.all()
    serializer_class = NavigationSerializer
    permission_classes = [AllowAny]

class ProjectsSectionViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint for viewing Projects section content."""
    queryset = ProjectsSection.objects.all()
    serializer_class = ProjectsSectionSerializer
    permission_classes = [AllowAny]

class SkillsSectionViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint for viewing Skills section content."""
    queryset = SkillsSection.objects.all()
    serializer_class = SkillsSectionSerializer
    permission_classes = [AllowAny]
