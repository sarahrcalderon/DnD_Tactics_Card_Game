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
        <Select
          value={performance.fpsLimit}
          onChange={(e) => onUpdate({ fpsLimit: Number(e.target.value) })}
        >
          <option value="30">30 FPS</option>
          <option value="60">60 FPS</option>
          <option value="120">120 FPS</option>
          <option value="144">144 FPS</option>
          <option value="0">Ilimitado</option>
        </Select>
      </OptionGroup>

      <OptionGroup>
        <ToggleContainer>
          <Toggle
            active={performance.lowPowerMode}
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
          value={performance.visualEffects}
          onChange={(e) => onUpdate({ visualEffects: e.target.value })}
        >
          <option value="low">Baixa</option>
          <option value="medium">Media</option>
          <option value="high">Alta</option>
          <option value="ultra">Ultra</option>
        </Select>
      </OptionGroup>

      <OptionGroup>
        <OptionLabel>Qualidade dos Efeitos</OptionLabel>
        <Select
          value={performance.effectQuality}
          onChange={(e) => onUpdate({ effectQuality: e.target.value })}
        >
          <option value="low">Baixa</option>
          <option value="medium">Media</option>
          <option value="high">Alta</option>
        </Select>
      </OptionGroup>

      <OptionGroup>
        <ToggleContainer>
          <Toggle
            active={performance.reduceParticles}
            onClick={() =>
              onUpdate({ reduceParticles: !performance.reduceParticles })
            }
          />
          <ToggleLabel>Reduzir Efeitos/Particulas</ToggleLabel>
        </ToggleContainer>
        <OptionDescription>
          Reduz o numero de particulas e efeitos visuais
        </OptionDescription>
      </OptionGroup>
    </>
  );
};
