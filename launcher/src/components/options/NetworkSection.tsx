import { API_URL } from '../../api/client';
import React from 'react';
import {
  OptionGroup,
  OptionLabel,
  Select,
  ToggleContainer,
  Toggle,
  ToggleLabel,
  OptionDescription,
} from '../../styles/optionsStyle';
import { NetworkOptions } from '../../types/options.types';

interface NetworkSectionProps {
  network: NetworkOptions;
  onUpdate: (updates: Partial<NetworkOptions>) => void;
}

export const NetworkSection: React.FC<NetworkSectionProps> = ({
  network,
  onUpdate,
}) => {
  return (
    <>
      <OptionGroup>
        <OptionLabel>Regiao</OptionLabel>
        <Select aria-label="Regiao" value="auto" disabled>
          <option value="auto">Servidor configurado</option>
        </Select>
        <OptionDescription>Esta versao usa um unico servidor. Selecao regional indisponivel.</OptionDescription>
      </OptionGroup>
      <OptionGroup>
        <OptionLabel>Servidor</OptionLabel>
        <OptionDescription>{new URL(API_URL, window.location.origin).host}</OptionDescription>
      </OptionGroup>

      <OptionGroup>
        <ToggleContainer>
          <Toggle
            aria-label="Mostrar Ping"
            active={network.showPing}
            onClick={() => onUpdate({ showPing: !network.showPing })}
          />
          <ToggleLabel>Mostrar Ping</ToggleLabel>
        </ToggleContainer>
        <OptionDescription>Exibir ping na interface do jogo</OptionDescription>
      </OptionGroup>
    </>
  );
};
