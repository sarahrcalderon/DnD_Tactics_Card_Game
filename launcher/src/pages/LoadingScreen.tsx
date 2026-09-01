import { useState, useEffect } from 'react';

import {
  BackgroundImage,
  LoadingContainer,
  LoadingTitle,
  LoadingSubtitle,
  LoadingBarWrapper,
  LoadingBarFill,
  LoadingProgress,
  LoadingStatus,
} from '../styles/loadingStyles';

interface LoadingScreenProps {
  onComplete: () => void;
}

const LOADING_MESSAGES = [
  'Carregando mapa de Blackmoor...',
  'Preparando o campo de batalha...',
  'Reunindo os heróis...',
  'Traçando a rota da campanha...',
  'Posicionando as tropas...',
  'Tudo pronto!',
];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + Math.random() * 4 + 1;

        if (next >= 100) {
          clearInterval(interval);

          setTimeout(() => {
            onComplete();
          }, 500);

          return 100;
        }

        return next;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [onComplete]);

  useEffect(() => {
    const msgInterval = setInterval(() => {
      setMessageIndex((prev) => {
        const next = prev + 1;

        if (next >= LOADING_MESSAGES.length) {
          clearInterval(msgInterval);

          return LOADING_MESSAGES.length - 1;
        }

        return next;
      });
    }, 600);

    return () => clearInterval(msgInterval);
  }, []);

  return (
    <>
      <BackgroundImage />

      <LoadingContainer>
        <LoadingTitle>DUNGEONS TACTICS</LoadingTitle>

        <LoadingSubtitle>Carregando Campanha Blackmoor</LoadingSubtitle>

        <LoadingBarWrapper>
          <LoadingBarFill $progress={progress} />

          <LoadingProgress>{Math.round(progress)}%</LoadingProgress>
        </LoadingBarWrapper>

        <LoadingStatus>{LOADING_MESSAGES[messageIndex]}</LoadingStatus>
      </LoadingContainer>
    </>
  );
};
