from django.contrib import admin

from catalog.models import Category, Product, ProductImage


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "name_uk", "name_en", "slug", "parent")
    list_filter = ("parent",)
    search_fields = ("name_uk", "name_en", "slug")
    prepopulated_fields = {"slug": ("name_en",)}


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ("id", "name_uk", "brand", "category", "price", "condition", "availability", "created_at")
    list_filter = ("category", "brand", "condition", "availability", "frame_material", "brake_type")
    search_fields = ("name_uk", "name_en", "slug", "brand")
    prepopulated_fields = {"slug": ("name_en",)}
    list_select_related = ("category",)
    inlines = [ProductImageInline]


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ("id", "product", "is_main")
    list_filter = ("is_main",)
