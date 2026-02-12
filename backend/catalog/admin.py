from django.contrib import admin
from django.contrib import messages
from django.shortcuts import redirect, render
from django.urls import path

from catalog.models import Category, Product, ProductImage
from catalog.services.csv_import import import_products_from_upload


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
    change_list_template = "admin/catalog/product/change_list.html"

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path(
                "import-csv/",
                self.admin_site.admin_view(self.import_csv_view),
                name="catalog_product_import_csv",
            ),
        ]
        return custom_urls + urls

    def import_csv_view(self, request):
        if request.method == "POST":
            csv_file = request.FILES.get("csv_file")
            if not csv_file:
                self.message_user(request, "Please choose a CSV file.", level=messages.ERROR)
                return redirect("..")
            try:
                imported = import_products_from_upload(csv_file)
            except Exception as exc:
                self.message_user(request, f"Import failed: {exc}", level=messages.ERROR)
                return redirect("..")
            self.message_user(request, f"CSV imported successfully. Imported {imported} products.", level=messages.SUCCESS)
            return redirect("..")

        context = {
            **self.admin_site.each_context(request),
            "opts": self.model._meta,
            "title": "Import products from CSV",
        }
        return render(request, "admin/catalog/product/import_csv.html", context)


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ("id", "product", "is_main")
    list_filter = ("is_main",)
