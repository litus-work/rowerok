import csv
from decimal import Decimal

from django.core.management.base import BaseCommand, CommandError
from django.utils.text import slugify

from catalog.models import Category, Product


class Command(BaseCommand):
    help = "Import products from CSV file."

    def add_arguments(self, parser):
        parser.add_argument("path", type=str)

    def handle(self, *args, **options):
        path = options["path"]
        try:
            with open(path, "r", encoding="utf-8") as csv_file:
                reader = csv.DictReader(csv_file)
                for row in reader:
                    category_slug = row["category_slug"]
                    category, _ = Category.objects.get_or_create(
                        slug=category_slug,
                        defaults={
                            "name_uk": row.get("category_name_uk", category_slug),
                            "name_en": row.get("category_name_en", category_slug),
                        },
                    )

                    Product.objects.update_or_create(
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
        except FileNotFoundError as exc:
            raise CommandError(f"CSV file not found: {path}") from exc

        self.stdout.write(self.style.SUCCESS("Import completed successfully."))
