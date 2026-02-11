from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient

from catalog.models import Category, Product


class ProductFilteringTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.category = Category.objects.create(name_uk="MTB", name_en="MTB", slug="mtb")
        Product.objects.create(
            name_uk="Bike 1",
            name_en="Bike 1",
            slug="bike-1",
            category=self.category,
            price=1000,
            brand="A",
            frame_size="M",
            wheel_size='29"',
            frame_material="Carbon",
            brake_type="Hydraulic",
            fork_type="Air",
            gears=12,
            condition="new",
            availability="in_stock",
            description_uk="d",
            description_en="d",
        )
        Product.objects.create(
            name_uk="Bike 2",
            name_en="Bike 2",
            slug="bike-2",
            category=self.category,
            price=500,
            brand="B",
            frame_size="L",
            wheel_size='27.5"',
            frame_material="Aluminum",
            brake_type="Mechanical",
            fork_type="Spring",
            gears=10,
            condition="used",
            availability="out_of_stock",
            description_uk="d",
            description_en="d",
        )

    def test_filter_by_price_and_brand(self):
        response = self.client.get("/api/catalog/products/", {"price_min": 700, "brand": "A"})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["count"], 1)
        self.assertEqual(response.data["results"][0]["slug"], "bike-1")
