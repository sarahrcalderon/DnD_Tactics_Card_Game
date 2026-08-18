import { useNavigate } from 'react-router-dom';

export function LauncherPage() {
  const navigate = useNavigate();

  async function iniciarJogo() {
    const result = await window.pywebview.api.iniciar_jogo();

    if (result.success) {
      navigate('/class-select');
    }
  }

  async function continuarJogo() {
    const result = await window.pywebview.api.continuar_jogo();

    console.log(result);
  }

  async function sair() {
    await window.pywebview.api.sair();
  }

  return (
    <div className="launcher">
      <h1>D&D TACTICS</h1>

      <p>⚔️ Card Game ⚔️</p>

      <button onClick={iniciarJogo}>⚔️ Iniciar Jogo</button>

      <button onClick={continuarJogo}>📂 Continuar Jogo</button>

      <button>💾 Salvar Jogo</button>

      <button>⚙️ Opções</button>

      <button onClick={sair}>🚪 Sair</button>
    </div>
  );
}
