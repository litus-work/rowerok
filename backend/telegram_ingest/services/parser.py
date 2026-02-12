import re
from decimal import Decimal, InvalidOperation
from typing import Any


FIELD_ALIASES = {
    "category_slug": {"category_slug", "category", "категория", "категорія"},
    "category_name_uk": {"category_name_uk", "категория_укр", "категорія_укр"},
    "category_name_en": {"category_name_en", "category_en"},
    "slug": {"slug"},
    "name_uk": {"name_uk", "name", "название", "назва"},
    "name_en": {"name_en", "nameeng", "name_en_us", "название_en", "назва_en"},
    "price": {"price", "цена", "ціна", "cost"},
    "brand": {"brand", "бренд"},
    "frame_size": {"frame_size", "frame", "рама", "розмір_рами", "размер_рамы"},
    "wheel_size": {"wheel_size", "колесо", "размер_колеса", "розмір_колеса"},
    "frame_material": {"frame_material", "material", "материал", "матеріал"},
    "brake_type": {"brake_type", "brakes", "тормоза", "гальма"},
    "fork_type": {"fork_type", "fork", "вилка"},
    "gears": {"gears", "скорости", "передачи", "передачі"},
    "condition": {"condition", "состояние", "стан"},
    "availability": {"availability", "наличие", "наявність"},
    "description_uk": {"description_uk", "description", "описание", "опис"},
    "description_en": {"description_en"},
    "image_alt": {"image_alt", "alt"},
}


def _normalize_key(raw_key: str) -> str:
    key = raw_key.strip().lower().replace(" ", "_")
    for canonical, aliases in FIELD_ALIASES.items():
        if key in aliases:
            return canonical
    return key


def _normalize_price(value: str) -> str:
    cleaned = re.sub(r"[^\d.,]", "", value).replace(",", ".")
    if not cleaned:
        return "0.00"

    if cleaned.count(".") > 1:
        head, tail = cleaned.rsplit(".", 1)
        cleaned = head.replace(".", "") + "." + tail

    try:
        amount = Decimal(cleaned)
    except (InvalidOperation, ValueError):
        return "0.00"
    return f"{amount:.2f}"


def _normalize_gears(value: str) -> str:
    match = re.search(r"\d+", value)
    return match.group(0) if match else "1"


def _normalize_condition(value: str) -> str:
    v = value.strip().lower()
    if v in {"new", "новый", "новий"}:
        return "new"
    if v in {"used", "б/у", "бу", "вживаний"}:
        return "used"
    return "new"


def _normalize_availability(value: str) -> str:
    v = value.strip().lower()
    if v in {"in_stock", "instock", "в наличии", "в наявності", "yes", "true"}:
        return "in_stock"
    if v in {"out_of_stock", "outofstock", "нет", "немає", "no", "false"}:
        return "out_of_stock"
    return "in_stock"


def _extract_price_from_text(lines: list[str], text_all: str) -> str:
    marker_line = next(
        (line for line in lines if re.search(r"\b(ціна|цена|price|cost)\b", line.lower())),
        "",
    )
    if marker_line:
        marker_match = re.search(r"(\d[\d\s.,]{1,14})", marker_line)
        if marker_match:
            normalized = _normalize_price(marker_match.group(1))
            try:
                if Decimal(normalized) > 0:
                    return normalized
            except InvalidOperation:
                pass

    best = Decimal("0")
    best_str = "0.00"
    for candidate in re.findall(r"\d[\d\s.,]{1,14}", text_all):
        normalized = _normalize_price(candidate)
        try:
            value = Decimal(normalized)
        except (InvalidOperation, ValueError):
            continue
        if value >= 100 and value > best:
            best = value
            best_str = normalized
    return best_str


def _infer_category(parsed: dict[str, Any], lower_text: str) -> None:
    if parsed.get("category_slug"):
        return

    if any(marker in lower_text for marker in ["електро", "электро", "e-bike", "ebike"]):
        parsed["category_slug"] = "e-bike"
        parsed["category_name_uk"] = "Електровелосипеди"
        parsed["category_name_en"] = "E-bike"
    elif any(marker in lower_text for marker in ["gravel", "грав"]):
        parsed["category_slug"] = "gravel"
        parsed["category_name_uk"] = "Гравійні"
        parsed["category_name_en"] = "Gravel"
    elif any(marker in lower_text for marker in ["road", "шосе", "шосс"]):
        parsed["category_slug"] = "road"
        parsed["category_name_uk"] = "Шосейні"
        parsed["category_name_en"] = "Road"
    elif any(marker in lower_text for marker in ["city", "міськ", "городск"]):
        parsed["category_slug"] = "city"
        parsed["category_name_uk"] = "Міські"
        parsed["category_name_en"] = "City"
    else:
        parsed["category_slug"] = "mtb"
        parsed["category_name_uk"] = "Гірські"
        parsed["category_name_en"] = "MTB"


def parse_caption_to_product_data(caption: str) -> tuple[dict[str, Any], list[str]]:
    parsed: dict[str, Any] = {}
    errors: list[str] = []

    lines = [line.strip() for line in caption.splitlines() if line.strip()]
    text_all = " ".join(lines)
    lower_text = text_all.lower()

    for line in lines:
        if ":" not in line:
            continue
        raw_key, value = line.split(":", 1)
        key = _normalize_key(raw_key)
        parsed[key] = value.strip()

    first_line = next((line for line in lines if ":" not in line), "")
    if not parsed.get("name_uk") and first_line:
        parsed["name_uk"] = first_line
    if not parsed.get("name_en") and parsed.get("name_uk"):
        parsed["name_en"] = parsed["name_uk"]

    current_price = _normalize_price(str(parsed.get("price", "0")))
    try:
        current_price_value = Decimal(current_price)
    except (InvalidOperation, ValueError):
        current_price_value = Decimal("0")

    if current_price_value <= 0:
        parsed["price"] = _extract_price_from_text(lines, text_all)
    else:
        parsed["price"] = current_price

    _infer_category(parsed, lower_text)

    if not parsed.get("frame_material"):
        if any(marker in lower_text for marker in ["карбон", "carbon"]):
            parsed["frame_material"] = "Carbon"
        elif any(marker in lower_text for marker in ["steel", "сталь"]):
            parsed["frame_material"] = "Steel"
        else:
            parsed["frame_material"] = "Aluminum"

    if not parsed.get("condition"):
        if any(marker in lower_text for marker in ["новий", "новый", "new"]):
            parsed["condition"] = "new"
        elif any(marker in lower_text for marker in ["б/у", "вжив", "used"]):
            parsed["condition"] = "used"
        else:
            parsed["condition"] = "new"

    if not parsed.get("availability"):
        if any(marker in lower_text for marker in ["немає", "нет", "out of stock"]):
            parsed["availability"] = "out_of_stock"
        else:
            parsed["availability"] = "in_stock"

    if any(marker in lower_text for marker in ["по замовлен", "під замовлен"]):
        parsed["availability"] = "in_stock"

    if not parsed.get("brand"):
        brand_match = re.search(
            r"\b(s-works|specialized|trek|giant|scott|cannondale|cube|merida|orbea|focus)\b",
            lower_text,
        )
        if brand_match:
            parsed["brand"] = brand_match.group(1).title()

    if parsed.get("gears"):
        parsed["gears"] = _normalize_gears(str(parsed["gears"]))
    if parsed.get("condition"):
        parsed["condition"] = _normalize_condition(str(parsed["condition"]))
    if parsed.get("availability"):
        parsed["availability"] = _normalize_availability(str(parsed["availability"]))

    defaults = {
        "category_slug": "telegram-import",
        "category_name_uk": "Telegram імпорт",
        "category_name_en": "Telegram import",
        "name_uk": "",
        "name_en": "",
        "price": "0.00",
        "brand": "Unknown",
        "frame_size": "M",
        "wheel_size": '29"',
        "frame_material": "Aluminum",
        "brake_type": "Mechanical Disc",
        "fork_type": "Rigid",
        "gears": "1",
        "condition": "new",
        "availability": "in_stock",
        "description_uk": "",
        "description_en": "",
        "image_alt": "",
    }
    for key, value in defaults.items():
        parsed.setdefault(key, value)

    if not parsed["name_uk"]:
        errors.append("Missing required field: name_uk")

    if not parsed["name_en"]:
        parsed["name_en"] = parsed["name_uk"]

    try:
        if Decimal(parsed["price"]) <= 0:
            errors.append("Price must be greater than 0")
    except (InvalidOperation, ValueError):
        errors.append("Price must be greater than 0")
        parsed["price"] = "0.00"

    return parsed, errors
