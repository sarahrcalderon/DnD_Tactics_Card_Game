from datetime import datetime, timezone
from uuid import uuid4

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from infrastructure.database.base import Base


class MatchModel(Base):
    __tablename__ = "matches"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=lambda: str(uuid4()))
    status: Mapped[str] = mapped_column(String(16), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    started_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    finished_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    winner_side: Mapped[str | None] = mapped_column(String(16), nullable=True)


class MatchPlayerModel(Base):
    __tablename__ = "match_players"

    match_id: Mapped[str] = mapped_column(ForeignKey("matches.id", ondelete="CASCADE"), primary_key=True)
    user_id: Mapped[str] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    side: Mapped[str] = mapped_column(String(16), nullable=False)
    slot: Mapped[int] = mapped_column(Integer, nullable=False)
    ready: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    connected: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    character_id: Mapped[str | None] = mapped_column(String(36), nullable=True)
    deck_id: Mapped[str | None] = mapped_column(String(36), nullable=True)
