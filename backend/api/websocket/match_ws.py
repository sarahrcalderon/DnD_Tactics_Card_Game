import asyncio
from contextlib import suppress
from typing import Literal
from uuid import UUID

from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from pydantic import BaseModel, ConfigDict, StrictBool, ValidationError, model_validator

from domain.exceptions import AuthenticationError, ConflictError, DomainError, ResourceNotFoundError
from infrastructure.container import container
from application.dtos.battle import BattleAction

router = APIRouter()


class MatchCommand(BaseModel):
    model_config = ConfigDict(extra="forbid")

    type: Literal["get_state", "set_ready", "start_match", "ping", "play_card", "end_turn", "attack", "defend"]
    ready: StrictBool | None = None
    card_id: str | None = None
    target_player_id: UUID | None = None
    target_card_id: str | None = None

    @model_validator(mode="after")
    def validate_command(self):
        allowed = {"type"}
        if self.type == "set_ready":
            allowed.add("ready")
            if self.ready is None:
                raise ValueError("ready is required")
        if self.type == "play_card":
            allowed.update({"card_id", "target_player_id", "target_card_id"})
            if not self.card_id:
                raise ValueError("card_id is required")
        if self.type == "attack":
            allowed.add("target_player_id")
        if self.model_fields_set - allowed:
            raise ValueError("Unexpected command fields")
        return self


class WebSocketMatchConnection:
    def __init__(self, websocket: WebSocket):
        self._websocket = websocket
        self._send_lock = asyncio.Lock()

    async def send(self, message: dict) -> None:
        try:
            async with asyncio.timeout(5):
                async with self._send_lock:
                    await self._websocket.send_json(message)
        except (WebSocketDisconnect, OSError, RuntimeError, TimeoutError) as error:
            with suppress(WebSocketDisconnect, OSError, RuntimeError, TimeoutError):
                async with asyncio.timeout(1):
                    await self._websocket.close(code=1011)
            raise ConnectionError("WebSocket unavailable") from error


async def _error(connection: WebSocketMatchConnection, code: str, message: str) -> None:
    await connection.send({"type": "error", "code": code, "message": message})


@router.websocket("/matches/{match_id}")
async def websocket_match(websocket: WebSocket, match_id: UUID):
    await websocket.accept()
    connection = WebSocketMatchConnection(websocket)
    user = None
    realtime = None
    try:
        try:
            async with asyncio.timeout(10):
                authentication = await websocket.receive_json()
            if (
                not isinstance(authentication, dict)
                or authentication.get("type") != "authenticate"
                or not isinstance(authentication.get("token"), str)
            ):
                raise AuthenticationError("Autenticação necessária.")
            user = await container.auth.get_authenticated_user(authentication["token"])
        except (AuthenticationError, ResourceNotFoundError, ValueError, TimeoutError, KeyError):
            await _error(connection, "authentication_required", "Autenticação inválida ou ausente.")
            await websocket.close(code=4401)
            return
        realtime = container.match_realtime
        try:
            await realtime.connect(match_id, user.id, connection)
        except ResourceNotFoundError:
            await _error(connection, "match_access_denied", "Partida indisponível para este jogador.")
            await websocket.close(code=4403)
            return
        while True:
            try:
                command = MatchCommand.model_validate(await websocket.receive_json())
                if command.type == "get_state":
                    await connection.send({
                        "type": "match_state", "match_id": str(match_id),
                        "data": await realtime.get_state_for_player(match_id, user.id),
                    })
                elif command.type == "set_ready":
                    if command.ready is None:
                        raise ValueError("ready is required")
                    await realtime.set_ready(match_id, user.id, command.ready)
                elif command.type == "start_match":
                    await realtime.start(match_id, user.id)
                elif command.type in {"play_card", "end_turn", "attack", "defend"}:
                    await realtime.battle_action(match_id, user.id, BattleAction(
                        command.type, command.card_id, command.target_player_id, command.target_card_id,
                    ))
                else:
                    await connection.send({"type": "pong", "match_id": str(match_id)})
            except (ValidationError, ValueError, KeyError):
                await _error(connection, "invalid_message", "Mensagem ou comando inválido.")
            except ResourceNotFoundError as error:
                await _error(connection, "not_found", str(error))
            except ConflictError as error:
                await _error(connection, "conflict", str(error))
            except DomainError as error:
                await _error(connection, "invalid_action", str(error))
    except (WebSocketDisconnect, ConnectionError):
        pass
    finally:
        if user is not None and realtime is not None:
            await realtime.disconnect(match_id, user.id, connection)
