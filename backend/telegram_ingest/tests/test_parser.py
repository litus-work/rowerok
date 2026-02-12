from django.test import SimpleTestCase

from telegram_ingest.services.parser import parse_caption_to_product_data


class ParserTests(SimpleTestCase):
    def test_parse_caption_success(self):
        caption = """
name_uk: Велосипед Trail One
name_en: Bicycle Trail One
price: 1299
brand: Summit
frame_size: M
wheel_size: 29"
frame_material: Aluminum
brake_type: Hydraulic Disc
fork_type: Air Suspension 120mm
gears: 11
condition: new
availability: in_stock
description_uk: Опис
description_en: Description
"""
        parsed, errors = parse_caption_to_product_data(caption)
        self.assertEqual(errors, [])
        self.assertEqual(parsed["name_uk"], "Велосипед Trail One")
        self.assertEqual(parsed["price"], "1299.00")
        self.assertEqual(parsed["gears"], "11")

    def test_parse_caption_missing_required(self):
        caption = "price: 1000\nbrand: X"
        parsed, errors = parse_caption_to_product_data(caption)
        self.assertEqual(parsed["name_uk"], "")
        self.assertTrue(any("name_uk" in error for error in errors))

    def test_parse_free_form_caption(self):
        caption = """Топовий електро S-Works Turbo Levo SL 2 Карбон 2025

Ціна 10000€

Новий (гарантія вічна)
У двох кольорах
У всіх розмірах
По замовленню в дірект
"""
        parsed, errors = parse_caption_to_product_data(caption)
        self.assertEqual(errors, [])
        self.assertEqual(parsed["name_uk"], "Топовий електро S-Works Turbo Levo SL 2 Карбон 2025")
        self.assertEqual(parsed["price"], "10000.00")
        self.assertEqual(parsed["condition"], "new")
        self.assertEqual(parsed["category_slug"], "e-bike")
