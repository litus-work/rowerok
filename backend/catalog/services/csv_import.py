import csv
from decimal import Decimal
from io import StringIO
from typing import BinaryIO, TextIO

from django.utils.text import slugify

from catalog.models import Category, Product, ProductImage


def _import_reader(reader: csv.DictReader) -> int:
    imported = 0
    for row in reader:
        category_slug = row["category_slug"]
        category, _ = Category.objects.get_or_create(
            slug=category_slug,
            defaults={
                "name_uk": row.get("category_name_uk", category_slug),
                "name_en": row.get("category_name_en", category_slug),
            },
        )

        product, _ = Product.objects.update_or_create(
            slug=row.get("slug") or slugify(row["name_en"]),
            defaults={
                "name_uk": row["name_uk"],
                "name_en": row["name_en"],
                "category": category,
                "price": Decimal(row["price"]),
                "brand": row["brand"],
                "frame_size": row["frame_size"],
                "wheel_size": row["wheel_size"],
                "frame_material": row["frame_material"],
                "brake_type": row["brake_type"],
                "fork_type": row["fork_type"],
                "gears": int(row["gears"]),
                "condition": row["condition"],
                "availability": row["availability"],
                "description_uk": row.get("description_uk", ""),
                "description_en": row.get("description_en", ""),
            },
        )

        image_urls = []
        if row.get("image_urls"):
            image_urls = [url.strip() for url in row["image_urls"].split("|") if url.strip()]
        elif row.get("image_url"):
            image_urls = [row["image_url"].strip()]

        if image_urls:
            ProductImage.objects.filter(product=product).delete()
            for idx, image_url in enumerate(image_urls):
                ProductImage.objects.create(
                    product=product,
                    image=image_url,
                    alt_text=row.get("image_alt", product.name_en),
                    is_main=idx == 0,
                )

        imported += 1

    return imported


def import_products_from_text_file(file_obj: TextIO) -> int:
    reader = csv.DictReader(file_obj)
    return _import_reader(reader)


def import_products_from_upload(file_obj: BinaryIO) -> int:
    content = file_obj.read().decode("utf-8-sig")
    reader = csv.DictReader(StringIO(content))
    return _import_reader(reader)
