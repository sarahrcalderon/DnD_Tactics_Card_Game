import React from 'react';
import {
  OptionGroup,
  OptionLabel,
  Slider,
  SliderValue,
  Row,
  Button,
  OptionDescription,
  ToggleContainer,
  Toggle,
  ToggleLabel,
} from '../../styles/optionsStyle';
import { useAudio } from '../../contexts/AudioContext';

export const AudioSection: React.FC = () => {
  const { audioOptions, updateAudioOptions, isMuted, toggleMute, playSound } = useAudio();

  const handleSliderChange =
    (key: keyof typeof audioOptions) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number(e.target.value);
      updateAudioOptions({ [key]: value });
    };

  return (
    <>
      <OptionGroup>
        <ToggleContainer>
          <Toggle
            aria-label="Ativar som"
            active={!isMuted} onClick={toggleMute} />
          <ToggleLabel>
            {isMuted ? ' Som Desativado' : ' Som Ativado'}
          </ToggleLabel>
        </ToggleContainer>
      </OptionGroup>

      <OptionGroup>
        <OptionLabel>Volume Geral</OptionLabel>
        <Row>
          <Slider
            min="0"
            max="100"
            aria-label="Volume Geral"
            value={audioOptions.volumeMaster}
            onChange={handleSliderChange('volumeMaster')}
          />
          <SliderValue>{audioOptions.volumeMaster}%</SliderValue>
        </Row>
      </OptionGroup>

      <OptionGroup>
        <OptionLabel>Música</OptionLabel>
        <Row>
          <Slider
            min="0"
            max="100"
            aria-label="Musica"
            value={audioOptions.volumeMusic}
            onChange={handleSliderChange('volumeMusic')}
          />
          <SliderValue>{audioOptions.volumeMusic}%</SliderValue>
        </Row>
      </OptionGroup>

      <OptionGroup>
        <OptionLabel>Efeitos Sonoros</OptionLabel>
        <Row>
          <Slider
            min="0"
            max="100"
            aria-label="Efeitos Sonoros"
            value={audioOptions.volumeSFX}
            onChange={handleSliderChange('volumeSFX')}
          />
          <SliderValue>{audioOptions.volumeSFX}%</SliderValue>
        </Row>
      </OptionGroup>

      <OptionGroup>
        <OptionLabel>Interface</OptionLabel>
        <Row>
          <Slider
            min="0"
            max="100"
            aria-label="Interface"
            value={audioOptions.volumeInterface}
            onChange={handleSliderChange('volumeInterface')}
          />
          <SliderValue>{audioOptions.volumeInterface}%</SliderValue>
        </Row>
      </OptionGroup>
      <OptionDescription>As alteracoes sao ouvidas imediatamente. Salve para manter ou cancele para desfazer.</OptionDescription>
      <Row>
        <Button onClick={() => playSound('click')}>Testar interface</Button>
        <Button onClick={() => playSound('effect')}>Testar efeitos</Button>
      </Row>
    </>
  );
};
