import asyncio
import smtplib
from email.message import EmailMessage


class SmtpEmailService:
    def __init__(self, host, port, username, password, sender, use_tls):
        self._host, self._port, self._username = host, port, username
        self._password, self._sender, self._use_tls = password, sender, use_tls

    async def send_password_reset(self, recipient: str, link: str) -> None:
        if not all([self._host, self._username, self._password, self._sender]):
            raise RuntimeError("SMTP is not configured.")
        message = EmailMessage()
        message["Subject"] = "Redefina sua senha — Dungeons Tactics"
        message["From"] = self._sender
        message["To"] = recipient
        message.set_content(f"Abra este link para redefinir sua senha: {link}\n\nO link expira em 30 minutos.")
        await asyncio.to_thread(self._send, message)

    def _send(self, message):
        with smtplib.SMTP(self._host, self._port, timeout=15) as server:
            if self._use_tls:
                server.starttls()
            server.login(self._username, self._password)
            server.send_message(message)
