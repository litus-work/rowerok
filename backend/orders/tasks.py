import json
import urllib.request

from django.conf import settings
from django.core.mail import send_mail

from config.celery import app


@app.task
def send_order_notifications(order_id: int, customer_email: str, customer_message: str, manager_message: str) -> None:
    send_mail(
        subject=f"Rower Ok: Order #{order_id} confirmed",
        message=customer_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[customer_email],
        fail_silently=True,
    )
    send_mail(
        subject=f"Rower Ok: New order #{order_id}",
        message=manager_message,
        from_email=settings.DEFAULT_FROM_EMAIL,
        recipient_list=[settings.MANAGER_EMAIL],
        fail_silently=True,
    )
    send_telegram_message.delay(manager_message)


@app.task
def send_telegram_message(message: str) -> None:
    if not settings.TELEGRAM_BOT_TOKEN or not settings.TELEGRAM_CHAT_ID:
        return
    url = f"https://api.telegram.org/bot{settings.TELEGRAM_BOT_TOKEN}/sendMessage"
    payload = {"chat_id": settings.TELEGRAM_CHAT_ID, "text": message}
    request = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        urllib.request.urlopen(request, timeout=10)
    except Exception:
        return
