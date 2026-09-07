import React from 'react';
import {
  Actions,
  BackButton,
  SelectedDeityInfo,
  SelectedDeityLabel,
  SelectedDeityName,
  ConfirmButton,
} from '../../styles/deitySelectStyles';

interface DeityActionsProps {
  onBack: () => void;
  selectedDeity: { id: string; name: string; color: string } | null;
  onConfirm: () => void;
  disabled?: boolean;
}

export const DeityActions: React.FC<DeityActionsProps> = ({
  onBack,
  selectedDeity,
  onConfirm,
  disabled = false,
}) => {
  return (
    <Actions>
      <BackButton type="button" onClick={onBack}>
        ← Voltar
      </BackButton>

      <SelectedDeityInfo>
        <SelectedDeityLabel>Divindade escolhida</SelectedDeityLabel>
        <SelectedDeityName color={selectedDeity?.color || '#c9a96e'}>
          {selectedDeity?.name || 'Nenhuma'}
        </SelectedDeityName>
      </SelectedDeityInfo>

      <ConfirmButton
        type="button"
        disabled={!selectedDeity || disabled}
        onClick={onConfirm}
      >
        {selectedDeity
          ? `Confirmar ${selectedDeity.name}`
          : 'Selecione uma Divindade'}
      </ConfirmButton>
    </Actions>
  );
};
