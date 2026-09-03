import { useCallback, useState } from 'react';

interface UseDeityConfirmationProps<T> {
  onConfirm?: (deity: T) => void;
}

export function useDeityConfirmation<T>({
  onConfirm,
}: UseDeityConfirmationProps<T> = {}) {
  const [isConfirming, setIsConfirming] = useState(false);

  // ============================================================
  // ABRIR CONFIRMAÇÃO
  // ============================================================

  const openConfirmation = useCallback(() => {
    setIsConfirming(true);
  }, []);

  // ============================================================
  // CANCELAR CONFIRMAÇÃO
  // ============================================================

  const cancelConfirmation = useCallback(() => {
    setIsConfirming(false);
  }, []);

  // ============================================================
  // CONFIRMAR DIVINDADE
  // ============================================================

  const confirmDeity = useCallback(
    (deity: T) => {
      onConfirm?.(deity);

      setIsConfirming(false);
    },
    [onConfirm],
  );

  return {
    isConfirming,

    openConfirmation,
    cancelConfirmation,
    confirmDeity,
  };
}