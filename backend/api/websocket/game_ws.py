# backend/api/websocket/game_ws.py
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import json

from core.game import get_game

router = APIRouter()

@router.websocket("/game")
async def websocket_game(websocket: WebSocket):
    await websocket.accept()
    game = get_game()
    print("✅ Cliente WebSocket conectado")
    
    try:
        while True:
            data = await websocket.receive_text()
            
            try:
                message = json.loads(data)
                action = message.get('action')
                
                if action == 'get_character':
                    if game.character:
                        response = {
                            'type': 'character_data',
                            'data': game.character.to_dict()
                        }
                    else:
                        response = {
                            'type': 'error',
                            'message': 'Nenhum personagem encontrado'
                        }
                
                elif action == 'get_battle':
                    if game.battle:
                        response = {
                            'type': 'battle_state',
                            'data': game.battle.get_state()
                        }
                    else:
                        response = {
                            'type': 'error',
                            'message': 'Nenhuma batalha ativa'
                        }
                
                elif action == 'update_character':
                    if 'data' in message and game.character:
                        game.character.update(message['data'])
                        response = {
                            'type': 'character_updated',
                            'data': game.character.to_dict()
                        }
                    else:
                        response = {
                            'type': 'error',
                            'message': 'Dados inválidos ou sem personagem'
                        }
                
                else:
                    response = {
                        'type': 'response',
                        'message': f"Ação '{action}' recebida",
                        'data': message
                    }
                
                await websocket.send_text(json.dumps(response))
                
            except json.JSONDecodeError:
                await websocket.send_text(json.dumps({
                    'type': 'error',
                    'message': 'JSON inválido'
                }))
                
    except WebSocketDisconnect:
        print("❌ Cliente WebSocket desconectado")