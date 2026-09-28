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
import { AccessibilityOptions } from '../../types/options.types';

interface AccessibilitySectionProps {
  accessibility: AccessibilityOptions;
  onUpdate: (updates: Partial<AccessibilityOptions>) => void;
}

export const AccessibilitySection: React.FC<AccessibilitySectionProps> = ({
  accessibility,
  onUpdate,
}) => {
  return (
    <>
      <OptionGroup>
        <OptionLabel>Modo Daltonico</OptionLabel>
        <Select
          aria-label="Modo Daltonico"
          value={accessibility.colorblindMode}
          onChange={(e) => onUpdate({ colorblindMode: e.target.value })}
        >
          <option value="none">Desativado</option>
          <option value="protanopia">Protanopia</option>
          <option value="deuteranopia">Deuteranopia</option>
          <option value="tritanopia">Tritanopia</option>
        </Select>
        <OptionDescription>Usa uma paleta alternativa nos títulos, seleções e indicadores de foco. Os estados também mantêm seus textos e ícones.</OptionDescription>
      </OptionGroup>

      <OptionGroup>
        <ToggleContainer>
          <Toggle
            aria-label="Alto Contraste"
            active={accessibility.highContrast}
            onClick={() =>
              onUpdate({ highContrast: !accessibility.highContrast })
            }
          />
          <ToggleLabel>Alto Contraste</ToggleLabel>
        </ToggleContainer>
        <OptionDescription>Aumenta o contraste da interface</OptionDescription>
      </OptionGroup>

      <OptionGroup>
        <ToggleContainer>
          <Toggle
            aria-label="Reduzir Movimento"
            active={accessibility.reduceMotion}
            onClick={() =>
              onUpdate({ reduceMotion: !accessibility.reduceMotion })
            }
          />
          <ToggleLabel>Reduzir Movimento</ToggleLabel>
        </ToggleContainer>
        <OptionDescription>
          Reduz animacoes e movimento na interface
        </OptionDescription>
      </OptionGroup>
    </>
  );
};
