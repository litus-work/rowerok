from decimal import Decimal

from django.core.management.base import BaseCommand

from catalog.models import Category, Product, ProductImage


SEED_PRODUCTS = [
    {
        "name_uk": "Summit Pro Carbon MTB",
        "name_en": "Summit Pro Carbon MTB",
        "slug": "summit-pro-carbon-mtb",
        "category_slug": "mtb",
        "category_name_uk": "Гiрськi",
        "category_name_en": "MTB",
        "price": Decimal("2499.00"),
        "brand": "Summit",
        "frame_size": "L",
        "wheel_size": '29"',
        "frame_material": "Carbon",
        "brake_type": "Hydraulic Disc",
        "fork_type": "Air Suspension 140mm",
        "gears": 12,
        "condition": "new",
        "availability": "in_stock",
        "description_uk": "Премiум MTB для агресивних трейлiв.",
        "description_en": "Premium MTB for aggressive trails.",
        "images": [
            "https://images.unsplash.com/photo-1648783531108-7c4f89060dc6?auto=format&fit=crop&w=1080&q=80",
            "https://images.unsplash.com/photo-1752883819721-a369b7b3e469?auto=format&fit=crop&w=1080&q=80",
        ],
    },
    {
        "name_uk": "Veloce Road Master",
        "name_en": "Veloce Road Master",
        "slug": "veloce-road-master",
        "category_slug": "road",
        "category_name_uk": "Шосейні",
        "category_name_en": "Road",
        "price": Decimal("3200.00"),
        "brand": "Veloce",
        "frame_size": "56cm",
        "wheel_size": "700c",
        "frame_material": "Carbon",
        "brake_type": "Rim",
        "fork_type": "Carbon Rigid",
        "gears": 22,
        "condition": "new",
        "availability": "in_stock",
        "description_uk": "Аеродинамiчний велосипед для високої швидкостi.",
        "description_en": "Aerodynamic road bike for high speed.",
        "images": [
            "https://images.unsplash.com/photo-1764067521927-9fc70adc5a31?auto=format&fit=crop&w=1080&q=80",
        ],
    },
    {
        "name_uk": "Terra Gravel Explorer",
        "name_en": "Terra Gravel Explorer",
        "slug": "terra-gravel-explorer",
        "category_slug": "gravel",
        "category_name_uk": "Гравiйнi",
        "category_name_en": "Gravel",
        "price": Decimal("1850.00"),
        "brand": "Terra",
        "frame_size": "M",
        "wheel_size": "700c",
        "frame_material": "Aluminum",
        "brake_type": "Mechanical Disc",
        "fork_type": "Carbon Rigid",
        "gears": 11,
        "condition": "new",
        "availability": "in_stock",
        "description_uk": "Універсальний велосипед для асфальту i гравiю.",
        "description_en": "Versatile bike for tarmac and gravel.",
        "images": [
            "https://images.unsplash.com/photo-1761936316762-d80f2fa85627?auto=format&fit=crop&w=1080&q=80",
        ],
    },
]


class Command(BaseCommand):
    help = "Create development seed data."

    def handle(self, *args, **options):
        for payload in SEED_PRODUCTS:
            category, _ = Category.objects.get_or_create(
                slug=payload["category_slug"],
                defaults={"name_uk": payload["category_name_uk"], "name_en": payload["category_name_en"]},
            )
            product, _ = Product.objects.update_or_create(
                slug=payload["slug"],
                defaults={
                    "name_uk": payload["name_uk"],
                    "name_en": payload["name_en"],
                    "category": category,
                    "price": payload["price"],
                    "brand": payload["brand"],
                    "frame_size": payload["frame_size"],
                    "wheel_size": payload["wheel_size"],
                    "frame_material": payload["frame_material"],
                    "brake_type": payload["brake_type"],
                    "fork_type": payload["fork_type"],
                    "gears": payload["gears"],
                    "condition": payload["condition"],
                    "availability": payload["availability"],
                    "description_uk": payload["description_uk"],
                    "description_en": payload["description_en"],
                },
            )
            ProductImage.objects.filter(product=product).delete()
            for idx, image in enumerate(payload["images"]):
                ProductImage.objects.create(
                    product=product,
                    image=image,
                    alt_text=product.name_en,
                    is_main=idx == 0,
                )
        self.stdout.write(self.style.SUCCESS("Seed data created."))
