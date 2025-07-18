from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import (
    AboutSectionViewSet, ContactSectionViewSet, HeroSectionViewSet,
    NavigationViewSet, ProjectsSectionViewSet, SkillsSectionViewSet
)

router = DefaultRouter()
router.register(r'about', AboutSectionViewSet, basename='about')
router.register(r'contact', ContactSectionViewSet, basename='contact')
router.register(r'hero', HeroSectionViewSet, basename='hero')
router.register(r'navigation', NavigationViewSet, basename='navigation')
router.register(r'projects', ProjectsSectionViewSet, basename='projects')
router.register(r'skills', SkillsSectionViewSet, basename='skills')

urlpatterns = [
    path('', include(router.urls)),
]
