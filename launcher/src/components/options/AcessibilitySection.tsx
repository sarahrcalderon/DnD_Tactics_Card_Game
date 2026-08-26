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
          value={accessibility.colorblindMode}
          onChange={(e) => onUpdate({ colorblindMode: e.target.value })}
        >
          <option value="none">Desativado</option>
          <option value="protanopia">Protanopia</option>
          <option value="deuteranopia">Deuteranopia</option>
          <option value="tritanopia">Tritanopia</option>
        </Select>
        <OptionDescription>Ajusta cores para daltonicos</OptionDescription>
      </OptionGroup>

      <OptionGroup>
        <ToggleContainer>
          <Toggle
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
