import React from 'react';
import {
  OptionGroup,
  OptionLabel,
  Slider,
  SliderValue,
  Row,
  ToggleContainer,
  Toggle,
  ToggleLabel,
} from '../../styles/optionsStyle';
import { useAudio } from '../../contexts/AudioContext';

export const AudioSection: React.FC = () => {
  const { audioOptions, updateAudioOptions, isMuted, toggleMute } = useAudio();

  const handleSliderChange =
    (key: keyof typeof audioOptions) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number(e.target.value);
      updateAudioOptions({ [key]: value });
    };

  return (
    <>
      <OptionGroup>
        <ToggleContainer onClick={toggleMute}>
          <Toggle active={!isMuted} />
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
            value={audioOptions.volumeInterface}
            onChange={handleSliderChange('volumeInterface')}
          />
          <SliderValue>{audioOptions.volumeInterface}%</SliderValue>
        </Row>
      </OptionGroup>
    </>
  );
};
