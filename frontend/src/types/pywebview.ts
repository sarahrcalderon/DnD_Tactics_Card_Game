interface GameAPI {
  iniciar_jogo(): Promise<{
    success: boolean;
    message: string;
  }>;

  continuar_jogo(): Promise<{
    success: boolean;
    message: string;
  }>;

  sair(): Promise<{
    success: boolean;
  }>;
}

interface PyWebView {
  api: GameAPI;
}

interface Window {
  pywebview: PyWebView;
}