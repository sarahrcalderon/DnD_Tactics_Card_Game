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
        <Select
          value={network.region}
          onChange={(e) => onUpdate({ region: e.target.value })}
        >
          <option value="auto">Automatica</option>
          <option value="na">America do Norte</option>
          <option value="sa">America do Sul</option>
          <option value="eu">Europa</option>
          <option value="asia">Asia</option>
          <option value="oceania">Oceania</option>
        </Select>
        <OptionDescription>Seleciona a regiao do servidor</OptionDescription>
      </OptionGroup>

      <OptionGroup>
        <OptionLabel>Servidor</OptionLabel>
        <Select
          value={network.server}
          onChange={(e) => onUpdate({ server: e.target.value })}
        >
          <option value="auto">Automatico</option>
          <option value="server1">Servidor 1</option>
          <option value="server2">Servidor 2</option>
          <option value="server3">Servidor 3</option>
        </Select>
      </OptionGroup>

      <OptionGroup>
        <ToggleContainer>
          <Toggle
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
