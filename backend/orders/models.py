from decimal import Decimal

from django.db import models


class Order(models.Model):
    class DeliveryMethod(models.TextChoices):
        NOVA_POSHTA = "nova_poshta", "Nova Poshta"
        PICKUP = "pickup", "Pickup"

    class PaymentMethod(models.TextChoices):
        CASH = "cash", "Cash"
        BANK_TRANSFER = "bank_transfer", "Bank transfer"

    class Status(models.TextChoices):
        NEW = "new", "New"
        PROCESSING = "processing", "Processing"
        CONFIRMED = "confirmed", "Confirmed"
        SHIPPED = "shipped", "Shipped"
        COMPLETED = "completed", "Completed"
        CANCELLED = "cancelled", "Cancelled"

    user = models.ForeignKey("users.User", null=True, blank=True, on_delete=models.SET_NULL, related_name="orders")
    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=32)
    email = models.EmailField()
    delivery_method = models.CharField(max_length=32, choices=DeliveryMethod.choices)
    city = models.CharField(max_length=255, blank=True)
    branch = models.CharField(max_length=255, blank=True)
    payment_method = models.CharField(max_length=32, choices=PaymentMethod.choices)
    comment = models.TextField(blank=True)
    status = models.CharField(max_length=32, choices=Status.choices, default=Status.NEW, db_index=True)
    total_price = models.DecimalField(max_digits=12, decimal_places=2, default=Decimal("0.00"))
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("-created_at",)

    def __str__(self) -> str:
        return f"Order #{self.pk}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey("catalog.Product", on_delete=models.PROTECT, related_name="+")
    price = models.DecimalField(max_digits=12, decimal_places=2)
    quantity = models.PositiveIntegerField()

    class Meta:
        ordering = ("id",)

    def __str__(self) -> str:
        return f"{self.product_id} x{self.quantity}"
