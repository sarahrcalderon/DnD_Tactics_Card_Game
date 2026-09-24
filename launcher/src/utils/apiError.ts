import axios from 'axios';

export function apiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return 'Não foi possível alcançar o servidor. Verifique sua conexão e tente novamente.';
    }

    const detail: unknown = error.response.data?.detail;

    if (typeof detail === 'string') return detail;

    if (Array.isArray(detail)) {
      return detail
        .map(
          (item: { msg?: string }) =>
            item.msg || 'Confira os campos do formulário.',
        )
        .join(' ');
    }

    if (error.response.status === 401) {
      return 'Sua sessão expirou. Entre novamente.';
    }

    return 'Não foi possível concluir a ação. Tente novamente.';
  }

  return error instanceof Error
    ? error.message
    : 'Não foi possível concluir a ação.';
}