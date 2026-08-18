# backend/launcher/launcher.py

import webview
import threading
import subprocess
import sys
import os
import time
import socket


class Launcher:
    """Launcher do D&D Tactics usando pywebview + React + FastAPI."""

    def __init__(self):
        self.window = None

        # React/Vite
        self.react_host = "127.0.0.1"
        self.react_port = 5173
        self.react_url = (
            f"http://{self.react_host}:{self.react_port}"
        )

        # FastAPI
        self.api_host = "127.0.0.1"
        self.api_port = 8000
        self.api_url = (
            f"http://{self.api_host}:{self.api_port}"
        )

        self.react_process = None
        self.api_thread = None

        print("✅ Launcher inicializado!")

    # ==========================================================
    # FASTAPI
    # ==========================================================

    def start_api(self):
        """Inicia a API FastAPI em segundo plano."""

        try:
            from api.server import app

            print(
                f"🚀 API iniciando em "
                f"{self.api_url}"
            )

            import uvicorn

            uvicorn.run(
                app,
                host=self.api_host,
                port=self.api_port,
                log_level="warning",
            )

        except Exception as e:
            print(f"❌ Erro ao iniciar API: {e}")

            import traceback
            traceback.print_exc()

    # ==========================================================
    # REACT
    # ==========================================================

    def get_react_dir(self):
        """
        Retorna o diretório do React.

        Estrutura esperada:

        DnD_Tactics_Card_Game/
        ├── backend/
        │   └── launcher/
        │       └── launcher.py
        │
        └── launcher/
            ├── package.json
            └── src/
        """

        backend_dir = os.path.dirname(
            os.path.dirname(
                os.path.abspath(__file__)
            )
        )

        project_root = os.path.dirname(
            backend_dir
        )

        react_dir = os.path.join(
            project_root,
            "launcher"
        )

        return os.path.abspath(react_dir)

    def is_port_open(self, host, port):
        """Verifica se existe algum servidor escutando na porta."""

        try:
            with socket.create_connection(
                (host, port),
                timeout=0.5
            ):
                return True

        except OSError:
            return False

    def wait_for_react(self, timeout=20):
        """Espera o Vite ficar disponível."""

        print(
            f"⏳ Aguardando React em "
            f"{self.react_url}..."
        )

        start_time = time.time()

        while (
            time.time() - start_time
            < timeout
        ):

            if self.is_port_open(
                self.react_host,
                self.react_port
            ):
                print(
                    f"✅ React disponível em "
                    f"{self.react_url}"
                )

                return True

            time.sleep(0.2)

        print(
            "❌ React não iniciou dentro "
            f"do limite de {timeout}s."
        )

        return False

    def start_react(self):
        """Inicia o Vite em segundo plano."""

        try:

            react_dir = self.get_react_dir()

            print(
                f"📂 Diretório do React: "
                f"{react_dir}"
            )

            if not os.path.exists(
                os.path.join(
                    react_dir,
                    "package.json"
                )
            ):
                print(
                    "❌ package.json não encontrado:"
                )

                print(react_dir)

                return False

            # --------------------------------------------------
            # Verifica se já existe algo na porta
            # --------------------------------------------------

            if self.is_port_open(
                self.react_host,
                self.react_port
            ):

                print(
                    f"⚠️ Porta {self.react_port} "
                    "já está em uso."
                )

                print(
                    "Assumindo que o React já "
                    "está rodando."
                )

                return True

            # --------------------------------------------------
            # Instala dependências se necessário
            # --------------------------------------------------

            node_modules = os.path.join(
                react_dir,
                "node_modules"
            )

            if not os.path.exists(
                node_modules
            ):

                print(
                    "📦 node_modules não encontrado."
                )

                print(
                    "📦 Instalando dependências..."
                )

                subprocess.run(
                    ["npm.cmd", "install"],
                    cwd=react_dir,
                    check=True
                )

            # --------------------------------------------------
            # Inicia Vite
            # --------------------------------------------------

            print("🚀 Iniciando Vite...")

            self.react_process = subprocess.Popen(
                [
                    "npm.cmd",
                    "run",
                    "dev",
                    "--",
                    "--host",
                    self.react_host,
                    "--port",
                    str(self.react_port),
                    "--strictPort",
                ],
                cwd=react_dir,
                shell=False,
            )

            # --------------------------------------------------
            # Espera o Vite realmente iniciar
            # --------------------------------------------------

            return self.wait_for_react()

        except Exception as e:

            print(
                f"❌ Erro ao iniciar React: {e}"
            )

            import traceback
            traceback.print_exc()

            return False

    # ==========================================================
    # CLEANUP
    # ==========================================================

    def cleanup(self):
        """Encerra processos iniciados pelo launcher."""

        print("🧹 Encerrando launcher...")

        if self.react_process:

            try:
                self.react_process.terminate()

                print(
                    "🛑 Processo React encerrado."
                )

            except Exception:
                pass

    # ==========================================================
    # RUN
    # ==========================================================

    def run(self):

        # ------------------------------------------------------
        # API
        # ------------------------------------------------------

        self.api_thread = threading.Thread(
            target=self.start_api,
            daemon=True
        )

        self.api_thread.start()

        print("🚀 API iniciada!")

        # ------------------------------------------------------
        # React
        # ------------------------------------------------------

        react_started = self.start_react()

        if not react_started:

            print(
                "❌ Não foi possível iniciar "
                "o React."
            )

            self.cleanup()

            sys.exit(1)

        print("🚀 React iniciado!")

        # ------------------------------------------------------
        # WebView
        # ------------------------------------------------------

        print(
            f"🖥️ Abrindo janela do launcher..."
        )

        print(
            f"🌐 URL: {self.react_url}"
        )

        self.window = webview.create_window(
            title="D&D Tactics - Launcher",
            url=self.react_url,
            width=1024,
            height=768,
            resizable=True,
            fullscreen=False,
            min_size=(800, 600),
            confirm_close=True,
        )

        try:

            webview.start(
                debug=True
            )

        finally:

            self.cleanup()


def main():

    try:

        launcher = Launcher()
        launcher.run()

    except Exception as e:

        print(f"❌ Erro fatal: {e}")

        import traceback
        traceback.print_exc()

        sys.exit(1)


if __name__ == "__main__":
    main()