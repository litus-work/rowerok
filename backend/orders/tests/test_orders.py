from unittest.mock import patch

from django.test import TestCase, override_settings
from rest_framework.test import APIClient

from catalog.models import Category, Product
from orders.models import Order


@override_settings(CELERY_TASK_ALWAYS_EAGER=True)
class OrderTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        category = Category.objects.create(name_uk="Road", name_en="Road", slug="road")
        self.product = Product.objects.create(
            name_uk="Road X",
            name_en="Road X",
            slug="road-x",
            category=category,
            price=1200,
            brand="BrandX",
            frame_size="M",
            wheel_size="700c",
            frame_material="Carbon",
            brake_type="Disc",
            fork_type="Rigid",
            gears=11,
            condition="new",
            availability="in_stock",
            description_uk="d",
            description_en="d",
        )

    def test_create_order(self):
        payload = {
            "name": "Test User",
            "phone": "+380000000000",
            "email": "user@example.com",
            "delivery_method": "pickup",
            "city": "Kyiv",
            "branch": "",
            "payment_method": "cash",
            "comment": "",
            "items": [{"product_id": self.product.id, "quantity": 2}],
        }
        response = self.client.post("/api/orders/", payload, format="json")
        self.assertEqual(response.status_code, 201)
        order = Order.objects.get()
        self.assertEqual(order.total_price, self.product.price * 2)
        self.assertEqual(order.items.count(), 1)

    @override_settings(ENABLE_ORDER_NOTIFICATIONS=True)
    @patch("orders.serializers.send_order_notifications.delay")
    def test_create_order_triggers_notifications(self, delay_mock):
        payload = {
            "name": "Test User",
            "phone": "+380000000000",
            "email": "user@example.com",
            "delivery_method": "pickup",
            "city": "Kyiv",
            "branch": "",
            "payment_method": "cash",
            "comment": "",
            "items": [{"product_id": self.product.id, "quantity": 1}],
        }
        response = self.client.post("/api/orders/", payload, format="json")
        self.assertEqual(response.status_code, 201)
        delay_mock.assert_called_once()
