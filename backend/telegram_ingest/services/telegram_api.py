import json
import urllib.parse
import urllib.request
from typing import Any


class TelegramApiClient:
    def __init__(self, token: str):
        self.token = token
        self.base_url = f"https://api.telegram.org/bot{token}/"

    def _request(self, method: str, payload: dict[str, Any] | None = None, timeout: int = 30) -> dict[str, Any]:
        data = None
        headers = {}
        if payload is not None:
            data = json.dumps(payload).encode("utf-8")
            headers["Content-Type"] = "application/json"
        req = urllib.request.Request(
            url=urllib.parse.urljoin(self.base_url, method),
            data=data,
            headers=headers,
            method="POST" if payload is not None else "GET",
        )
        with urllib.request.urlopen(req, timeout=timeout) as response:
            return json.loads(response.read().decode("utf-8"))

    def get_updates(self, offset: int, timeout: int = 30) -> list[dict[str, Any]]:
        method = f"getUpdates?offset={offset}&timeout={timeout}"
        # Read timeout must exceed Telegram long-poll timeout.
        result = self._request(method, timeout=timeout + 15)
        return result.get("result", [])

    def get_file_url(self, file_id: str) -> str:
        result = self._request(f"getFile?file_id={urllib.parse.quote(file_id)}")
        file_path = result.get("result", {}).get("file_path")
        if not file_path:
            return ""
        return f"https://api.telegram.org/file/bot{self.token}/{file_path}"

    def send_message(self, chat_id: int, text: str) -> None:
        self._request("sendMessage", {"chat_id": chat_id, "text": text})
