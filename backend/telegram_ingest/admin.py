from django.contrib import admin

from telegram_ingest.models import TelegramIngestState, TelegramProductDraft


@admin.register(TelegramProductDraft)
class TelegramProductDraftAdmin(admin.ModelAdmin):
    list_display = ("id", "chat_id", "message_id", "is_valid", "exported_at", "created_at")
    list_filter = ("is_valid", "exported_at", "created_at")
    search_fields = ("chat_id", "message_id", "raw_caption", "error_message")
    readonly_fields = ("created_at", "updated_at")


@admin.register(TelegramIngestState)
class TelegramIngestStateAdmin(admin.ModelAdmin):
    list_display = ("name", "value", "updated_at")
    readonly_fields = ("updated_at",)
