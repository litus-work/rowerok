from django.core.management.base import BaseCommand, CommandError

from catalog.services.csv_import import import_products_from_text_file


class Command(BaseCommand):
    help = "Import products from CSV file."

    def add_arguments(self, parser):
        parser.add_argument("path", type=str)

    def handle(self, *args, **options):
        path = options["path"]
        try:
            with open(path, "r", encoding="utf-8-sig") as csv_file:
                imported = import_products_from_text_file(csv_file)
        except FileNotFoundError as exc:
            raise CommandError(f"CSV file not found: {path}") from exc

        self.stdout.write(self.style.SUCCESS(f"Import completed successfully. Imported: {imported} products."))
