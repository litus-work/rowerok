import csv
from pathlib import Path

from django.core.management.base import BaseCommand
from django.utils import timezone

from telegram_ingest.models import TelegramProductDraft


EXPORT_COLUMNS = [
    "category_slug",
    "category_name_uk",
    "category_name_en",
    "slug",
    "name_uk",
    "name_en",
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
    "image_url",
    *[f"image_url_{idx}" for idx in range(1, 21)],
    "image_alt",
]


class Command(BaseCommand):
    help = "Export valid telegram drafts to CSV for product import."

    def add_arguments(self, parser):
        parser.add_argument("--output", type=str, default="telegram_products_export.csv")
        parser.add_argument("--include-exported", action="store_true")

    def handle(self, *args, **options):
        output_path = Path(options["output"]).resolve()
        qs = TelegramProductDraft.objects.filter(is_valid=True)
        if not options["include_exported"]:
            qs = qs.filter(exported_at__isnull=True)
        drafts = list(qs.order_by("created_at"))

        with output_path.open("w", encoding="utf-8", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=EXPORT_COLUMNS)
            writer.writeheader()
            for draft in drafts:
                data = draft.parsed_data or {}
                row = {key: data.get(key, "") for key in EXPORT_COLUMNS}

                image_urls = data.get("image_urls")
                if not isinstance(image_urls, list):
                    image_urls = []

                if not image_urls:
                    image_urls = [data.get(f"image_url_{idx}", "") for idx in range(1, 21)]
                    image_urls = [url for url in image_urls if url]

                if not image_urls and data.get("image_url"):
                    image_urls = [data["image_url"]]

                if not image_urls and draft.photo_url:
                    image_urls = [draft.photo_url]

                if image_urls:
                    row["image_url"] = image_urls[0]
                    for idx, url in enumerate(image_urls[:20], start=1):
                        row[f"image_url_{idx}"] = url
                writer.writerow(row)

        now = timezone.now()
        qs.update(exported_at=now)
        self.stdout.write(self.style.SUCCESS(f"Exported {len(drafts)} drafts to {output_path}"))
