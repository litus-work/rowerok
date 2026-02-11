from django.db import models
from django.utils.text import slugify


class Category(models.Model):
    name_uk = models.CharField(max_length=255)
    name_en = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    description_uk = models.TextField(blank=True)
    description_en = models.TextField(blank=True)
    parent = models.ForeignKey("self", null=True, blank=True, on_delete=models.SET_NULL, related_name="children")

    class Meta:
        verbose_name_plural = "categories"
        ordering = ("name_uk",)

    def __str__(self) -> str:
        return self.name_uk


class Product(models.Model):
    class Condition(models.TextChoices):
        NEW = "new", "New"
        USED = "used", "Used"

    class Availability(models.TextChoices):
        IN_STOCK = "in_stock", "In stock"
        OUT_OF_STOCK = "out_of_stock", "Out of stock"

    name_uk = models.CharField(max_length=255)
    name_en = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name="products")
    price = models.DecimalField(max_digits=12, decimal_places=2)
    brand = models.CharField(max_length=128, db_index=True)
    frame_size = models.CharField(max_length=64, db_index=True)
    wheel_size = models.CharField(max_length=64, db_index=True)
    frame_material = models.CharField(max_length=128, db_index=True)
    brake_type = models.CharField(max_length=128, db_index=True)
    fork_type = models.CharField(max_length=128, db_index=True)
    gears = models.PositiveIntegerField(db_index=True)
    condition = models.CharField(max_length=16, choices=Condition.choices, db_index=True)
    availability = models.CharField(max_length=16, choices=Availability.choices, db_index=True)
    description_uk = models.TextField()
    description_en = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("-created_at",)
        indexes = [
            models.Index(fields=("category", "price")),
            models.Index(fields=("brand", "price")),
            models.Index(fields=("availability", "condition")),
        ]

    def __str__(self) -> str:
        return self.name_uk

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name_en)[:50]
        super().save(*args, **kwargs)


class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="images")
    image = models.URLField()
    alt_text = models.CharField(max_length=255, blank=True)
    is_main = models.BooleanField(default=False)

    class Meta:
        ordering = ("-is_main", "id")

    def __str__(self) -> str:
        return f"Image for {self.product_id}"
