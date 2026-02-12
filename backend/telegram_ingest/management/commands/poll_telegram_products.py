from django.conf import settings
from django.core.management.base import BaseCommand, CommandError

from telegram_ingest.models import TelegramIngestState, TelegramProductDraft
from telegram_ingest.services.llm_parser import parse_caption_with_llm
from telegram_ingest.services.parser import parse_caption_to_product_data
from telegram_ingest.services.telegram_api import TelegramApiClient


class Command(BaseCommand):
    help = "Poll Telegram updates and save product drafts (photo + caption)."

    def add_arguments(self, parser):
        parser.add_argument("--once", action="store_true", help="Poll only one batch and exit.")
        parser.add_argument("--timeout", type=int, default=30)

    def handle(self, *args, **options):
        token = settings.TELEGRAM_BOT_TOKEN
        if not token:
            raise CommandError("TELEGRAM_BOT_TOKEN is empty.")

        allowed_raw = getattr(settings, "TELEGRAM_INGEST_ALLOWED_CHAT_IDS", "")
        allowed_ids = {int(v.strip()) for v in allowed_raw.split(",") if v.strip()} if allowed_raw else set()
        blocked_chat_ids_logged: set[int] = set()

        client = TelegramApiClient(token=token)
        state, _ = TelegramIngestState.objects.get_or_create(name="telegram_updates_offset", defaults={"value": 0})
        if allowed_ids:
            self.stdout.write(f"Allowed chat ids filter is ON: {sorted(allowed_ids)}")
        else:
            self.stdout.write("Allowed chat ids filter is OFF.")

        while True:
            try:
                updates = client.get_updates(offset=state.value + 1, timeout=options["timeout"])
            except TimeoutError:
                self.stdout.write(self.style.WARNING("Telegram poll timeout. Retrying..."))
                if options["once"]:
                    break
                continue
            except Exception as exc:
                self.stdout.write(self.style.ERROR(f"Telegram poll error: {exc}"))
                if options["once"]:
                    break
                continue
            max_update_id = state.value

            messages_for_processing = []
            for update in updates:
                update_id = update.get("update_id", 0)
                if update_id > max_update_id:
                    max_update_id = update_id

                message = (
                    update.get("message")
                    or update.get("channel_post")
                    or update.get("edited_message")
                    or update.get("edited_channel_post")
                    or {}
                )
                if not message:
                    continue

                chat = message.get("chat") or {}
                chat_id = chat.get("id")
                if not chat_id:
                    continue
                if allowed_ids and chat_id not in allowed_ids:
                    if chat_id not in blocked_chat_ids_logged:
                        blocked_chat_ids_logged.add(chat_id)
                        self.stdout.write(
                            self.style.WARNING(
                                f"Skipping message from chat_id={chat_id}. "
                                f"Add it to TELEGRAM_INGEST_ALLOWED_CHAT_IDS if needed."
                            )
                        )
                    continue
                messages_for_processing.append(message)

            # Build album photo maps once per polling batch.
            file_url_cache: dict[str, str] = {}
            media_group_file_ids: dict[tuple[int, str], list[str]] = {}
            for message in messages_for_processing:
                chat = message.get("chat") or {}
                chat_id = chat.get("id")
                media_group_id = message.get("media_group_id")
                photos = message.get("photo") or []
                if not chat_id or not media_group_id or not photos:
                    continue
                file_id = photos[-1].get("file_id", "")
                if not file_id:
                    continue
                key = (chat_id, str(media_group_id))
                media_group_file_ids.setdefault(key, [])
                if file_id not in media_group_file_ids[key]:
                    media_group_file_ids[key].append(file_id)

            def resolve_photo_url(file_id: str) -> str:
                if not file_id:
                    return ""
                if file_id in file_url_cache:
                    return file_url_cache[file_id]
                file_url_cache[file_id] = client.get_file_url(file_id)
                return file_url_cache[file_id]

            for message in messages_for_processing:
                chat = message.get("chat") or {}
                chat_id = chat.get("id")
                photos = message.get("photo") or []
                caption = (message.get("caption") or "").strip()
                message_id = message.get("message_id")
                if not message_id:
                    continue

                if not photos:
                    continue

                # Telegram albums: only one message usually has caption.
                if not caption and message.get("media_group_id"):
                    continue

                if not caption:
                    client.send_message(
                        chat_id,
                        "Send product as: photo + caption with key:value lines (name_uk, price, brand, etc).",
                    )
                    continue

                media_group_id = message.get("media_group_id")
                if media_group_id:
                    group_key = (chat_id, str(media_group_id))
                    group_photo_ids = media_group_file_ids.get(group_key, [])
                else:
                    group_photo_ids = []

                if not group_photo_ids:
                    photo_file_id = photos[-1].get("file_id", "")
                    group_photo_ids = [photo_file_id] if photo_file_id else []

                group_photo_ids = group_photo_ids[:20]
                group_photo_urls = [resolve_photo_url(file_id) for file_id in group_photo_ids if file_id]
                group_photo_urls = [url for url in group_photo_urls if url]

                photo_file_id = group_photo_ids[0] if group_photo_ids else ""
                photo_url = group_photo_urls[0] if group_photo_urls else ""
                parsed_data, errors = parse_caption_to_product_data(caption)

                llm_raw = ""
                use_llm = bool(getattr(settings, "OPENAI_API_KEY", ""))
                if errors and use_llm:
                    llm_data, llm_errors, llm_raw = parse_caption_with_llm(caption)
                    if not llm_errors:
                        parsed_data, errors = llm_data, []
                    elif len(llm_errors) < len(errors):
                        parsed_data, errors = llm_data, llm_errors

                if group_photo_urls:
                    parsed_data["image_urls"] = group_photo_urls
                    parsed_data["image_url"] = group_photo_urls[0]
                    for idx, url in enumerate(group_photo_urls[:20], start=1):
                        parsed_data[f"image_url_{idx}"] = url

                draft, created = TelegramProductDraft.objects.get_or_create(
                    chat_id=chat_id,
                    message_id=message_id,
                    defaults={
                        "photo_file_id": photo_file_id,
                        "photo_url": photo_url,
                        "raw_caption": caption,
                        "parsed_data": parsed_data,
                        "is_valid": len(errors) == 0,
                        "error_message": "; ".join(errors) if not llm_raw else f"{'; '.join(errors)} | llm_raw={llm_raw[:500]}",
                    },
                )
                if not created:
                    draft.photo_file_id = photo_file_id
                    draft.photo_url = photo_url
                    draft.raw_caption = caption
                    draft.parsed_data = parsed_data
                    draft.is_valid = len(errors) == 0
                    draft.error_message = "; ".join(errors) if not llm_raw else f"{'; '.join(errors)} | llm_raw={llm_raw[:500]}"
                    draft.save()

                if errors:
                    client.send_message(chat_id, f"Draft saved with errors: {'; '.join(errors)}")
                else:
                    client.send_message(chat_id, "Draft saved successfully. Ready for CSV export.")

            if max_update_id > state.value:
                state.value = max_update_id
                state.save(update_fields=["value", "updated_at"])

            self.stdout.write(self.style.SUCCESS(f"Processed {len(updates)} updates. Offset={state.value}"))
            if options["once"]:
                break
