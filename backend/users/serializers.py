from django.contrib.auth import authenticate
from rest_framework import serializers
from rest_framework.authtoken.models import Token

from catalog.serializers import ProductCardSerializer
from users.models import CartItem, Comparison, Favorite, User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username", "email", "first_name", "last_name", "phone")


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ("username", "email", "password", "first_name", "last_name", "phone")

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        Token.objects.get_or_create(user=user)
        return user


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    token = serializers.CharField(read_only=True)
    user = UserSerializer(read_only=True)

    def validate(self, attrs):
        user = authenticate(username=attrs["username"], password=attrs["password"])
        if not user:
            raise serializers.ValidationError("Invalid credentials.")
        token, _ = Token.objects.get_or_create(user=user)
        return {"token": token.key, "user": user}


class FavoriteSerializer(serializers.ModelSerializer):
    product = ProductCardSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Favorite
        fields = ("id", "product", "product_id", "created_at")

    def create(self, validated_data):
        user = self.context["request"].user
        favorite, _ = Favorite.objects.get_or_create(user=user, product_id=validated_data["product_id"])
        return favorite


class ComparisonSerializer(serializers.ModelSerializer):
    product = ProductCardSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Comparison
        fields = ("id", "product", "product_id", "created_at")

    def create(self, validated_data):
        user = self.context["request"].user
        if Comparison.objects.filter(user=user).count() >= 4:
            raise serializers.ValidationError("Maximum 4 products allowed in comparison.")
        comparison, _ = Comparison.objects.get_or_create(user=user, product_id=validated_data["product_id"])
        return comparison


class CartItemSerializer(serializers.ModelSerializer):
    product = ProductCardSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = CartItem
        fields = ("id", "product", "product_id", "quantity", "updated_at")

    def create(self, validated_data):
        user = self.context["request"].user
        item, created = CartItem.objects.get_or_create(user=user, product_id=validated_data["product_id"], defaults={"quantity": validated_data["quantity"]})
        if not created:
            item.quantity = validated_data["quantity"]
            item.save(update_fields=["quantity", "updated_at"])
        return item
