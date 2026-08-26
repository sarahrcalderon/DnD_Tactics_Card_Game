import os
import sys
import time
import shutil
import subprocess
import threading

import requests
import webview


class Launcher:
    def __init__(self):
        self.window = None

        # --------------------------------------------------------
        # Caminhos
        # --------------------------------------------------------

        self.project_root = os.path.dirname(
            os.path.dirname(
                os.path.dirname(
                    os.path.abspath(__file__)
                )
            )
        )

        self.launcher_dir = os.path.join(
            self.project_root,
            "launcher"
        )

        self.react_port = 5173
        self.react_url = f"http://127.0.0.1:{self.react_port}"

        self.react_process = None

        # --------------------------------------------------------
        # Node / npm
        # --------------------------------------------------------

        self.npm_command = self.find_npm()

    # ============================================================
    # LOCALIZAR NPM
    # ============================================================

    def find_npm(self):
        """
        Localiza o npm no Windows sem depender de PATH perfeito.
        """

        possible_commands = [
            "npm.cmd",
            "npm",
        ]

        for command in possible_commands:
            path = shutil.which(command)

            if path:
                print(f"[launcher] npm encontrado: {path}")
                return path

        # Caminhos comuns do Node.js no Windows
        possible_paths = [
            os.path.join(
                os.environ.get("ProgramFiles", ""),
                "nodejs",
                "npm.cmd",
            ),

            os.path.join(
                os.environ.get("ProgramFiles(x86)", ""),
                "nodejs",
                "npm.cmd",
            ),

            os.path.join(
                os.environ.get("APPDATA", ""),
                "npm",
                "npm.cmd",
            ),
        ]

        for path in possible_paths:
            if path and os.path.exists(path):
                print(f"[launcher] npm encontrado: {path}")
                return path

        return None

    # ============================================================
    # VERIFICAR NODE
    # ============================================================

    def check_node(self):
        if not self.npm_command:
            raise RuntimeError(
                "npm não foi encontrado no sistema. "
                "Instale o Node.js ou adicione o Node/npm ao PATH."
            )

        try:
            result = subprocess.run(
                [self.npm_command, "--version"],
                cwd=self.launcher_dir,
                capture_output=True,
                text=True,
                timeout=10,
                shell=False,
            )

            if result.returncode != 0:
                raise RuntimeError(
                    f"npm não pôde ser executado:\n"
                    f"{result.stderr}"
                )

            print(
                f"[launcher] npm versão: "
                f"{result.stdout.strip()}"
            )

        except FileNotFoundError:
            raise RuntimeError(
                "O executável npm não foi encontrado."
            )

    # ============================================================
    # INICIAR REACT
    # ============================================================

    def start_react(self):
        print("[launcher] Iniciando servidor React...")

        try:
            if not os.path.isdir(self.launcher_dir):
                raise RuntimeError(
                    f"Diretório do React não encontrado:\n"
                    f"{self.launcher_dir}"
                )

            package_json = os.path.join(
                self.launcher_dir,
                "package.json"
            )

            if not os.path.isfile(package_json):
                raise RuntimeError(
                    f"package.json não encontrado em:\n"
                    f"{self.launcher_dir}"
                )

            print(
                f"[launcher] Diretório React: "
                f"{self.launcher_dir}"
            )

            # ----------------------------------------------------
            # Verifica npm
            # ----------------------------------------------------

            self.check_node()

            # ----------------------------------------------------
            # Instala dependências somente se necessário
            # ----------------------------------------------------

            node_modules = os.path.join(
                self.launcher_dir,
                "node_modules"
            )

            if not os.path.isdir(node_modules):
                print(
                    "[launcher] node_modules não encontrado."
                )

                print(
                    "[launcher] Instalando dependências..."
                )

                result = subprocess.run(
                    [self.npm_command, "install"],
                    cwd=self.launcher_dir,
                    shell=False,
                    check=False,
                )

                if result.returncode != 0:
                    raise RuntimeError(
                        "npm install falhou."
                    )

            # ----------------------------------------------------
            # Inicia Vite
            # ----------------------------------------------------

            print(
                "[launcher] Iniciando Vite..."
            )

            creationflags = 0

            if sys.platform == "win32":
                creationflags = (
                    subprocess.CREATE_NEW_PROCESS_GROUP
                )

            self.react_process = subprocess.Popen(
                [
                    self.npm_command,
                    "run",
                    "dev",
                    "--",
                    "--host",
                    "127.0.0.1",
                    "--port",
                    str(self.react_port),
                ],
                cwd=self.launcher_dir,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                shell=False,
                creationflags=creationflags,
            )

            # ----------------------------------------------------
            # Thread para mostrar logs do Vite
            # ----------------------------------------------------

            threading.Thread(
                target=self.read_react_output,
                daemon=True,
            ).start()

            # ----------------------------------------------------
            # Espera o React responder
            # ----------------------------------------------------

            print(
                f"[launcher] Aguardando React em "
                f"{self.react_url}..."
            )

            for _ in range(60):
                if self.react_process.poll() is not None:
                    raise RuntimeError(
                        "O processo do React encerrou antes "
                        "de ficar disponível."
                    )

                try:
                    response = requests.get(
                        self.react_url,
                        timeout=1,
                    )

                    if response.status_code == 200:
                        print(
                            f"[launcher] React disponível em "
                            f"{self.react_url}"
                        )
                        return True

                except requests.RequestException:
                    pass

                time.sleep(0.5)

            raise RuntimeError(
                "React não respondeu dentro do tempo esperado."
            )

        except Exception as e:
            print(
                f"[launcher] Erro ao iniciar React: {e}"
            )

            self.stop_react()

            raise

    # ============================================================
    # LOG DO REACT
    # ============================================================

    def read_react_output(self):
        """
        Mostra o output do Vite sem bloquear a interface.
        """

        if not self.react_process:
            return

        stdout = self.react_process.stdout

        if stdout is None:
            return

        try:
            for line in iter(stdout.readline, ""):
                line = line.rstrip()

                if line:
                    print(f"[vite] {line}")

        except Exception:
            pass

    # ============================================================
    # PARAR REACT
    # ============================================================

    def stop_react(self):
        if not self.react_process:
            return

        try:
            if self.react_process.poll() is None:
                print(
                    "[launcher] Encerrando servidor React..."
                )

                self.react_process.terminate()

                try:
                    self.react_process.wait(
                        timeout=5
                    )
                except subprocess.TimeoutExpired:
                    self.react_process.kill()

        except Exception as e:
            print(
                f"[launcher] Erro ao encerrar React: {e}"
            )

        finally:
            self.react_process = None

    # ============================================================
    # API
    # ============================================================

    def start_game(self):
        print("[launcher] Iniciando jogo...")

        return {
            "success": True,
            "message": "Jogo iniciado!",
        }

    def load_game(self):
        print("[launcher] Carregando jogo...")

        return {
            "success": True,
            "message": "Jogo carregado!",
        }

    def save_game(self):
        print("[launcher] Salvando jogo...")

        return {
            "success": True,
            "message": "Jogo salvo!",
        }

    def quit_app(self):
        print("[launcher] Fechando launcher...")

        self.stop_react()

        if self.window:
            try:
                self.window.destroy()
            except Exception:
                pass

    # ============================================================
    # RUN
    # ============================================================

    def run(self):
        print("[launcher] Iniciando launcher...")

        # --------------------------------------------------------
        # React é iniciado ANTES da janela
        # --------------------------------------------------------

        self.start_react()

        # --------------------------------------------------------
        # Cria a janela somente quando o React estiver disponível
        # --------------------------------------------------------

        print("[launcher] Criando janela...")

        self.window = webview.create_window(
            title="D&D Tactics - Launcher",
            url=self.react_url,

            # Tamanho inicial.
            # NÃO limita o usuário a esse tamanho.
            width=1024,
            height=768,

            resizable=True,
            fullscreen=False,

            # Permite reduzir, mas não impede maximização.
            min_size=(800, 600),

            confirm_close=True,

            js_api=self,
        )

        try:
            print("[launcher] Iniciando WebView...")

            webview.start(
                debug=True,
                http_server=False,
            )

        finally:
            self.stop_react()


# ================================================================
# MAIN
# ================================================================

def main():
    try:
        launcher = Launcher()
        launcher.run()

    except Exception as e:
        import traceback

        print(
            f"❌ Erro fatal: {e}"
        )

        traceback.print_exc()

        sys.exit(1)


if __name__ == "__main__":
    main()