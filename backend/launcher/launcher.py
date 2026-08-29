import sys
import os
import subprocess
import time
import threading
import requests
import signal
from pathlib import Path
import webview
import logging

logging.basicConfig(
    level=logging.INFO,
    format='[%(levelname)s] %(message)s'
)
logger = logging.getLogger(__name__)


class Launcher:
    def __init__(self):
        self.react_process = None
        self.window = None
        self.react_ready = False
        self.shutting_down = False
        self.port = 5173
        self.host = "127.0.0.1"
        self.react_url = f"http://{self.host}:{self.port}"
        # Caminho para o frontend (pasta launcher na raiz)
        self.react_dir = Path(__file__).parent.parent.parent / "launcher"

    def find_npm(self):
        """Encontra o executável do npm"""
        npm_paths = [
            r"C:\Program Files\nodejs\npm.cmd",
            r"C:\Program Files (x86)\nodejs\npm.cmd",
            "npm",
            "npm.cmd"
        ]
        
        for npm in npm_paths:
            try:
                result = subprocess.run(
                    [npm, "--version"],
                    capture_output=True,
                    text=True,
                    shell=True,
                    timeout=5
                )
                if result.returncode == 0:
                    logger.info(f"npm encontrado: {npm}")
                    return npm
            except:
                continue
        
        logger.error("npm não encontrado")
        return None

    def start_react(self):
        """Inicia o servidor React"""
        try:
            npm = self.find_npm()
            if not npm:
                return False

            if not self.react_dir.exists():
                logger.error(f"Diretório React não encontrado: {self.react_dir}")
                return False

            logger.info(f"Iniciando servidor React em: {self.react_dir}")
            
            self.react_process = subprocess.Popen(
                [npm, "run", "dev"],
                cwd=self.react_dir,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                shell=True,
                creationflags=subprocess.CREATE_NO_WINDOW if sys.platform == "win32" else 0
            )

            return True
            
        except Exception as e:
            logger.error(f"Erro ao iniciar React: {e}")
            return False

    def wait_for_react(self, timeout=30):
        """Aguarda o servidor React ficar disponível"""
        start_time = time.time()
        
        while time.time() - start_time < timeout:
            try:
                if self.react_process and self.react_process.poll() is not None:
                    logger.error("Servidor React parou")
                    return False
                
                response = requests.get(self.react_url, timeout=2)
                if response.status_code == 200:
                    logger.info(f"React disponível em {self.react_url}")
                    return True
                    
            except requests.exceptions.RequestException:
                pass
            
            time.sleep(1)
        
        logger.error(f"Timeout aguardando React")
        return False

    def stop_react(self):
        """Para o servidor React"""
        if self.react_process:
            try:
                logger.info("Parando servidor React...")
                self.react_process.terminate()
                self.react_process.wait(timeout=5)
            except:
                try:
                    self.react_process.kill()
                except:
                    pass
            self.react_process = None

    def on_window_closed(self):
        """Callback quando a janela é fechada"""
        logger.info("Janela fechada")
        self.shutting_down = True
        self.stop_react()

    def create_window(self):
        """Cria a janela do pywebview"""
        try:
            logger.info("Criando janela...")
            
            self.window = webview.create_window(
                title="Dungeons & Tactics - Launcher",
                url=self.react_url,
                width=1280,
                height=800,
                resizable=True,
                fullscreen=False,
                min_size=(800, 600),
                confirm_close=True,
                background_color="#0a0810"
            )
            
            logger.info("Iniciando WebView...")
            
            webview.start(
                debug=False,
                http_server=True,
                http_port=0,
                private_mode=False
            )
            
        except Exception as e:
            logger.error(f"Erro ao criar janela: {e}")
            return False
        return True

    def run(self):
        """Executa o launcher"""
        try:
            logger.info("=" * 50)
            logger.info("Iniciando Dungeons & Tactics - Launcher")
            logger.info("=" * 50)
            
            if not self.start_react():
                logger.error("Falha ao iniciar React")
                return 1

            if not self.wait_for_react():
                logger.error("Falha ao iniciar React")
                self.stop_react()
                return 1

            if not self.create_window():
                self.stop_react()
                return 1

            self.stop_react()
            logger.info("Launcher finalizado")
            return 0

        except KeyboardInterrupt:
            logger.info("\nInterrompido pelo usuário")
            self.stop_react()
            return 0
            
        except Exception as e:
            logger.error(f"Erro inesperado: {e}")
            self.stop_react()
            return 1


if __name__ == "__main__":
    launcher = Launcher()
    sys.exit(launcher.run())