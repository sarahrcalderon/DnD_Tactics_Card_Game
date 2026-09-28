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
        <Select aria-label="Idioma" value="pt-BR" disabled>
          <option value="pt-BR">Portugues (Brasil)</option>
        </Select>
        <OptionDescription>Outros idiomas ainda nao possuem traducao.</OptionDescription>
      </OptionGroup>

      <OptionGroup>
        <OptionLabel>Escala da UI</OptionLabel>
        <Row>
          <Slider
          aria-label="Escala da UI"
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
          aria-label="Tamanho da Fonte"
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
            aria-label="Mostrar Dicas"
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
            aria-label="Animações"
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
          aria-label="Velocidade das Animações"
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
