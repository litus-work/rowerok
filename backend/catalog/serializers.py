from rest_framework import serializers

from catalog.models import Category, Product, ProductImage


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ("id", "name_uk", "name_en", "slug", "description_uk", "description_en", "parent")


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ("id", "image", "alt_text", "is_main")


class ProductCardSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    main_image = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = (
            "id",
            "slug",
            "name_uk",
            "name_en",
            "brand",
            "price",
            "category",
            "frame_size",
            "wheel_size",
            "frame_material",
            "condition",
            "availability",
            "main_image",
        )

    def get_main_image(self, obj):
        image = obj.images.filter(is_main=True).first() or obj.images.first()
        return image.image if image else None


class ProductDetailSerializer(ProductCardSerializer):
    images = ProductImageSerializer(many=True, read_only=True)

    class Meta(ProductCardSerializer.Meta):
        fields = ProductCardSerializer.Meta.fields + (
            "brake_type",
            "fork_type",
            "gears",
            "description_uk",
            "description_en",
            "created_at",
            "images",
        )
