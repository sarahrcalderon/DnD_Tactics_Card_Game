from dataclasses import dataclass
from uuid import UUID


@dataclass(frozen=True)
class BattleAction:
    type: str
    card_id: str | None = None
    target_player_id: UUID | None = None
    target_card_id: str | None = None
