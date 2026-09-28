import React from 'react';
import {
  OptionGroup,
  OptionLabel,
  OptionDescription,
  Slider,
  SliderValue,
  Select,
  ToggleContainer,
  Toggle,
  ToggleLabel,
  Row,
} from '../../styles/optionsStyle';
import { PerformanceOptions } from '../../types/options.types';

interface PerformanceSectionProps {
  performance: PerformanceOptions;
  onUpdate: (updates: Partial<PerformanceOptions>) => void;
}

export const PerformanceSection: React.FC<PerformanceSectionProps> = ({
  performance,
  onUpdate,
}) => {
  return (
    <>
      <OptionGroup>
        <OptionLabel>Limite de FPS</OptionLabel>
        <Select aria-label="Limite de FPS" value="auto" disabled>
          <option value="auto">Automatico (navegador)</option>
        </Select>
        <OptionDescription>O navegador controla os quadros desta interface. Use baixo consumo para reduzir animacoes e efeitos.</OptionDescription>
      </OptionGroup>

      <OptionGroup>
        <ToggleContainer>
          <Toggle aria-label="Modo de Baixo Consumo"             active={performance.lowPowerMode}
            onClick={() =>
              onUpdate({ lowPowerMode: !performance.lowPowerMode })
            }
          />
          <ToggleLabel>Modo de Baixo Consumo</ToggleLabel>
        </ToggleContainer>
        <OptionDescription>
          Reduz uso de recursos para economizar bateria
        </OptionDescription>
      </OptionGroup>

      <OptionGroup>
        <OptionLabel>Qualidade dos Efeitos Visuais</OptionLabel>
        <Select
aria-label="Qualidade dos Efeitos Visuais"           value={performance.visualEffects}
          onChange={(e) => onUpdate({ visualEffects: e.target.value })}
        >
          <option value="low">Baixa</option>
          <option value="medium">Media</option>
          <option value="high">Alta</option>
        </Select>
      </OptionGroup>

      <OptionGroup>
        <OptionLabel>Qualidade dos Efeitos</OptionLabel>
        <Select
aria-label="Qualidade dos Efeitos"           value={performance.effectQuality}
          onChange={(e) => onUpdate({ effectQuality: e.target.value })}
        >
          <option value="low">Baixa</option>
          <option value="medium">Media</option>
          <option value="high">Alta</option>
        </Select>
      </OptionGroup>

      <OptionGroup>
        <ToggleContainer>
          <Toggle aria-label="Reduzir Efeitos/Particulas"             active={performance.reduceParticles}
            onClick={() =>
              onUpdate({ reduceParticles: !performance.reduceParticles })
            }
          />
          <ToggleLabel>Reduzir Efeitos/Particulas</ToggleLabel>
        </ToggleContainer>
        <OptionDescription>
          Oculta brilhos decorativos do mapa, preservando os indicadores de jogo
        </OptionDescription>
      </OptionGroup>
    </>
  );
};
