from django.contrib import admin
from django.contrib import messages
from django.shortcuts import redirect, render
from django.urls import path
from django.utils.html import format_html

from catalog.models import Category, Product, ProductImage
from catalog.services.csv_import import import_products_from_upload


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 0
    can_delete = True
    show_change_link = True
    fields = ("preview", "image", "alt_text", "is_main")
    readonly_fields = ("preview",)

    @admin.display(description="Preview")
    def preview(self, obj):
        if not obj or not obj.image:
            return "No image"
        return format_html(
            '<img src="{}" alt="{}" style="max-height: 80px; border-radius: 6px;" />',
            obj.image,
            obj.alt_text or "Product image",
        )


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
    readonly_fields = ("created_at",)
    fields = (
        "name_uk",
        "name_en",
        "slug",
        "category",
        "price",
        "brand",
        "frame_size",
        "wheel_size",
        "frame_material",
        "brake_type",
        "fork_type",
        "gears",
        "condition",
        "availability",
        "description_uk",
        "description_en",
        "created_at",
    )

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

    def save_formset(self, request, form, formset, change):
        instances = formset.save(commit=False)
        for obj in formset.deleted_objects:
            obj.delete()
        for instance in instances:
            instance.save()
        formset.save_m2m()

        if formset.model is ProductImage:
            images = ProductImage.objects.filter(product=form.instance).order_by("id")
            if not images.exists():
                return

            main_images = images.filter(is_main=True)
            if main_images.count() == 0:
                first = images.first()
                first.is_main = True
                first.save(update_fields=["is_main"])
            elif main_images.count() > 1:
                keeper = main_images.first()
                images.exclude(pk=keeper.pk).filter(is_main=True).update(is_main=False)


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):
    list_display = ("id", "preview", "product", "is_main")
    list_filter = ("is_main",)
    search_fields = ("product__name_uk", "product__name_en", "product__slug", "alt_text", "image")
    readonly_fields = ("preview",)
    fields = ("product", "preview", "image", "alt_text", "is_main")

    @admin.display(description="Preview")
    def preview(self, obj):
        if not obj or not obj.image:
            return "No image"
        return format_html(
            '<img src="{}" alt="{}" style="max-height: 140px; border-radius: 8px;" />',
            obj.image,
            obj.alt_text or "Product image",
        )
