# backend/api/middleware/cors.py
from fastapi.middleware.cors import CORSMiddleware
from infrastructure.config import get_settings

def setup_cors(app):
    app.add_middleware(
        CORSMiddleware,
        allow_origins=get_settings().cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
