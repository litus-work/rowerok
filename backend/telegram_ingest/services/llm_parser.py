import json
import urllib.request
from typing import Any

from django.conf import settings

from telegram_ingest.services.parser import parse_caption_to_product_data


def _request_openai(payload: dict[str, Any]) -> dict[str, Any]:
    req = urllib.request.Request(
        "https://api.openai.com/v1/chat/completions",
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {settings.OPENAI_API_KEY}",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=60) as response:
        return json.loads(response.read().decode("utf-8"))


def parse_caption_with_llm(caption: str) -> tuple[dict[str, Any], list[str], str]:
    if not settings.OPENAI_API_KEY:
        return {}, ["OPENAI_API_KEY is empty"], ""

    model = settings.OPENAI_MODEL
    prompt = (
        "Extract bicycle product data from caption. "
        "Return only JSON object with keys: "
        "category_slug, category_name_uk, category_name_en, slug, name_uk, name_en, price, brand, "
        "frame_size, wheel_size, frame_material, brake_type, fork_type, gears, condition, availability, "
        "description_uk, description_en, image_alt. "
        "Rules: condition must be new|used, availability in_stock|out_of_stock, price numeric."
    )

    payload = {
        "model": model,
        "temperature": 0,
        "response_format": {"type": "json_object"},
        "messages": [
            {"role": "system", "content": prompt},
            {"role": "user", "content": caption},
        ],
    }

    response = _request_openai(payload)
    content = response["choices"][0]["message"]["content"]
    try:
        llm_data = json.loads(content)
    except json.JSONDecodeError:
        return {}, ["LLM returned invalid JSON"], content

    # Reuse existing normalization/validation logic.
    normalized, errors = parse_caption_to_product_data(
        "\n".join(f"{key}: {value}" for key, value in llm_data.items() if value is not None)
    )
    return normalized, errors, content
