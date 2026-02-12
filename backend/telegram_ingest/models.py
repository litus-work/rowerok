from django.db import models


class TelegramIngestState(models.Model):
    name = models.CharField(max_length=64, unique=True)
    value = models.BigIntegerField(default=0)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self) -> str:
        return f"{self.name}={self.value}"


class TelegramProductDraft(models.Model):
    chat_id = models.BigIntegerField(db_index=True)
    message_id = models.BigIntegerField(db_index=True)
    photo_file_id = models.CharField(max_length=255, blank=True)
    photo_url = models.URLField(blank=True)
    raw_caption = models.TextField(blank=True)
    parsed_data = models.JSONField(default=dict)
    is_valid = models.BooleanField(default=False)
    error_message = models.TextField(blank=True)
    exported_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("chat_id", "message_id")
        ordering = ("-created_at",)

    def __str__(self) -> str:
        status = "valid" if self.is_valid else "invalid"
        return f"Draft {self.chat_id}:{self.message_id} ({status})"
