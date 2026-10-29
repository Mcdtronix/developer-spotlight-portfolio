from django.test import TestCase
from django.urls import reverse


class HealthEndpointTests(TestCase):
    def test_health_reports_ok(self):
        response = self.client.get(reverse("health"))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"status": "ok", "database": "ok"})


class PublicApiSmokeTests(TestCase):
    """Every endpoint the frontend calls must answer 200, even with an empty DB."""

    endpoints = ["about", "contact", "hero", "navigation", "projects", "skills", "experience"]

    def test_endpoints_respond(self):
        for name in self.endpoints:
            with self.subTest(endpoint=name):
                response = self.client.get(f"/api/{name}/")
                self.assertEqual(response.status_code, 200)
