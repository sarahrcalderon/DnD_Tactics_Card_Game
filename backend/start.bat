@echo off
:: backend/start.bat
title Dungeons & Tactics Launcher
color 0A

echo ========================================
echo    Dungeons & Tactics - Launcher
echo ========================================
echo.

cd /d "%~dp0"

set MAX_RETRIES=3
set RETRY_COUNT=0
set TIMEOUT=30

:retry
set /a RETRY_COUNT+=1
echo [%date% %time:~0,8%] Tentativa %RETRY_COUNT% de %MAX_RETRIES%
echo.

python main.py

if %ERRORLEVEL% NEQ 0 (
    if %RETRY_COUNT% LSS %MAX_RETRIES% (
        echo.
        echo [ERRO] Launcher falhou. Reiniciando em %TIMEOUT% segundos...
        timeout /t %TIMEOUT% /nobreak >nul
        cls
        goto retry
    ) else (
        echo.
        echo [ERRO] Falha apos %MAX_RETRIES% tentativas.
        echo Pressione qualquer tecla para sair...
        pause >nul
        exit /b 1
    )
)

echo.
echo [SUCESSO] Launcher finalizado normalmente.
pause