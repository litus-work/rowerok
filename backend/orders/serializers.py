from decimal import Decimal

from django.conf import settings
from django.db import transaction
from rest_framework import serializers

from catalog.models import Product
from orders.models import Order, OrderItem
from orders.tasks import send_order_notifications


class OrderItemInputSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    quantity = serializers.IntegerField(min_value=1)


class OrderItemSerializer(serializers.ModelSerializer):
    product_name_uk = serializers.CharField(source="product.name_uk", read_only=True)
    product_slug = serializers.CharField(source="product.slug", read_only=True)
    product_main_image = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = ("id", "product", "product_name_uk", "product_slug", "product_main_image", "price", "quantity")

    def get_product_main_image(self, obj):
        image = obj.product.images.filter(is_main=True).first() or obj.product.images.first()
        return image.image if image else None


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = (
            "id",
            "user",
            "name",
            "phone",
            "email",
            "delivery_method",
            "city",
            "branch",
            "payment_method",
            "comment",
            "status",
            "total_price",
            "created_at",
            "items",
        )
        read_only_fields = ("user", "status", "total_price", "created_at")


class OrderCreateSerializer(serializers.ModelSerializer):
    items = OrderItemInputSerializer(many=True, write_only=True)

    class Meta:
        model = Order
        fields = (
            "name",
            "phone",
            "email",
            "delivery_method",
            "city",
            "branch",
            "payment_method",
            "comment",
            "items",
        )

    def validate(self, attrs):
        if attrs["delivery_method"] == Order.DeliveryMethod.NOVA_POSHTA:
            if not attrs.get("city") or not attrs.get("branch"):
                raise serializers.ValidationError("City and branch are required for Nova Poshta delivery.")
        return attrs

    @transaction.atomic
    def create(self, validated_data):
        items_data = validated_data.pop("items")
        user = self.context["request"].user if self.context["request"].user.is_authenticated else None
        order = Order.objects.create(user=user, **validated_data)

        total = Decimal("0.00")
        manager_lines = [f"New order #{order.id}", f"Customer: {order.name}", f"Phone: {order.phone}", f"Payment: {order.payment_method}"]
        customer_lines = [f"Your order #{order.id} is accepted.", "Items:"]

        for item in items_data:
            try:
                product = Product.objects.get(id=item["product_id"])
            except Product.DoesNotExist as exc:
                raise serializers.ValidationError(f"Product {item['product_id']} not found.") from exc
            if product.availability != Product.Availability.IN_STOCK:
                raise serializers.ValidationError(f"Product {product.slug} is out of stock.")
            price = product.price
            quantity = item["quantity"]
            total += price * quantity
            OrderItem.objects.create(order=order, product=product, price=price, quantity=quantity)
            manager_lines.append(f"- {product.name_uk} x{quantity} = {price * quantity}")
            customer_lines.append(f"- {product.name_uk} x{quantity}")

        order.total_price = total
        order.save(update_fields=["total_price"])
        manager_lines.append(f"Total: {total}")
        customer_lines.append(f"Total: {total}")

        if settings.ENABLE_ORDER_NOTIFICATIONS:
            send_order_notifications.delay(order.id, order.email, "\n".join(customer_lines), "\n".join(manager_lines))
        return order
