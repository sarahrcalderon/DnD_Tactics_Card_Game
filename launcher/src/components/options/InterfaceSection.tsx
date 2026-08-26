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
import { InterfaceOptions } from '../../types/options.types';

interface InterfaceSectionProps {
  interfaceOptions: InterfaceOptions;
  onUpdate: (updates: Partial<InterfaceOptions>) => void;
}

export const InterfaceSection: React.FC<InterfaceSectionProps> = ({
  interfaceOptions,
  onUpdate,
}) => {
  return (
    <>
      <OptionGroup>
        <OptionLabel>Idioma</OptionLabel>
        <Select
          value={interfaceOptions.language || 'pt-BR'}
          onChange={(e) => onUpdate({ language: e.target.value })}
        >
          <option value="pt-BR">Portugues (Brasil)</option>
          <option value="en-US">English (US)</option>
          <option value="es-ES">Espanol</option>
          <option value="fr-FR">Francais</option>
          <option value="de-DE">Deutsch</option>
          <option value="ja-JP">Japanese</option>
          <option value="zh-CN">Chinese</option>
        </Select>
      </OptionGroup>

      <OptionGroup>
        <OptionLabel>Escala da UI</OptionLabel>
        <Row>
          <Slider
            type="range"
            min="50"
            max="150"
            value={interfaceOptions.uiScale}
            onChange={(e) => onUpdate({ uiScale: Number(e.target.value) })}
          />
          <SliderValue>{interfaceOptions.uiScale}%</SliderValue>
        </Row>
      </OptionGroup>

      <OptionGroup>
        <OptionLabel>Tamanho da Fonte</OptionLabel>
        <Row>
          <Slider
            type="range"
            min="12"
            max="24"
            value={interfaceOptions.fontSize}
            onChange={(e) => onUpdate({ fontSize: Number(e.target.value) })}
          />
          <SliderValue>{interfaceOptions.fontSize}px</SliderValue>
        </Row>
      </OptionGroup>

      <OptionGroup>
        <ToggleContainer>
          <Toggle
            active={interfaceOptions.showTips}
            onClick={() => onUpdate({ showTips: !interfaceOptions.showTips })}
          />
          <ToggleLabel>Mostrar Dicas</ToggleLabel>
        </ToggleContainer>
        <OptionDescription>Exibir dicas durante o jogo</OptionDescription>
      </OptionGroup>

      <OptionGroup>
        <ToggleContainer>
          <Toggle
            active={interfaceOptions.animations}
            onClick={() =>
              onUpdate({ animations: !interfaceOptions.animations })
            }
          />
          <ToggleLabel>Animações</ToggleLabel>
        </ToggleContainer>
        <OptionDescription>
          Ativar/desativar animações da interface
        </OptionDescription>
      </OptionGroup>

      <OptionGroup>
        <OptionLabel>Velocidade das Animações</OptionLabel>
        <Row>
          <Slider
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={interfaceOptions.animationSpeed}
            onChange={(e) =>
              onUpdate({ animationSpeed: Number(e.target.value) })
            }
          />
          <SliderValue>{interfaceOptions.animationSpeed}x</SliderValue>
        </Row>
      </OptionGroup>
    </>
  );
};
