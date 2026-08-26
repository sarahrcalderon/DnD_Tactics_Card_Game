import styled from 'styled-components';

export const Container = styled.main`
  width: 100%;
  min-height: 100vh;
  min-height: 100dvh;
  padding: 30px 20px 40px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow-y: auto;
  overflow-x: hidden;
  background: linear-gradient(135deg, #0a0810 0%, #151126 45%, #1a1530 100%);

  scrollbar-width: thin;
  scrollbar-color: rgba(255, 215, 0, 0.3) transparent;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 215, 0, 0.3);
    border-radius: 10px;
  }
`;

export const BackgroundImage = styled.div`
  position: fixed;
  inset: 0;
  z-index: 0;
  background-image: url('/assets/images/backgrounds/background_classe.jfif');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  pointer-events: none;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.8);
  }
`;

export const ContentWrapper = styled.div`
  width: 100%;
  max-width: 700px;
  min-height: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;
  padding: 20px;
`;

export const Header = styled.header`
  width: 100%;
  text-align: center;
  margin-bottom: 32px;
`;

export const Title = styled.h1`
  margin: 0 0 8px;
  color: #ffd700;
  font-family: 'Cinzel', serif;
  font-size: clamp(2rem, 4vw, 2.8rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: 0.5px;
  text-shadow: 0 0 40px rgba(255, 215, 0, 0.2);
`;

export const Subtitle = styled.p`
  margin: 0;
  color: #dcdce5;
  font-size: clamp(0.9rem, 1.5vw, 1.1rem);
  line-height: 1.5;
  opacity: 0.8;
`;

export const InfoCard = styled.div`
  width: 100%;
  background: rgba(27, 24, 51, 0.85);
  border: 1px solid rgba(255, 215, 0, 0.15);
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 28px;
  backdrop-filter: blur(10px);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 8px;
    padding: 18px;
  }
`;

export const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const InfoLabel = styled.span`
  color: #9999aa;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
`;

export const InfoValue = styled.span`
  color: #ffd700;
  font-size: 1rem;
  font-weight: 600;
`;

export const InfoValueLight = styled.span`
  color: #dcdce5;
  font-size: 0.95rem;
`;

export const FormContainer = styled.div`
  width: 100%;
  max-width: 500px;
`;

export const InputGroup = styled.div`
  width: 100%;
  margin-bottom: 20px;
`;

export const Label = styled.label`
  display: block;
  color: #dcdce5;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 8px;
`;

export const Input = styled.input`
  width: 100%;
  padding: 14px 18px;
  background: rgba(255, 255, 255, 0.06);
  border: 2px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  color: #ffffff;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  box-sizing: border-box;

  &::placeholder {
    color: #666677;
  }

  &:focus {
    outline: none;
    border-color: #ffd700;
    background: rgba(255, 215, 0, 0.05);
    box-shadow: 0 0 30px rgba(255, 215, 0, 0.05);
  }

  &:hover {
    border-color: rgba(255, 215, 0, 0.3);
  }
`;

export const CharacterPreview = styled.div`
  width: 100%;
  max-width: 200px;
  height: 200px;
  margin: 0 auto 24px;
  border-radius: 50%;
  border: 3px solid rgba(255, 215, 0, 0.2);
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    box-shadow: inset 0 0 40px rgba(0, 0, 0, 0.5);
    pointer-events: none;
  }
`;

export const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const PreviewPlaceholder = styled.div`
  font-size: 4rem;
  opacity: 0.3;
`;

export const CharacterName = styled.h2`
  color: #ffd700;
  font-size: 1.8rem;
  font-family: 'Cinzel', serif;
  margin: 0 0 4px;
  text-align: center;
  min-height: 45px;
  text-shadow: 0 0 30px rgba(255, 215, 0, 0.15);
`;

export const CharacterInfo = styled.p`
  color: #9999aa;
  font-size: 0.9rem;
  text-align: center;
  margin: 0 0 24px;
  opacity: 0.7;
`;

export const Actions = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 16px;
  padding: 8px 0;
  margin-top: 8px;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 10px;
  }
`;

export const BackButton = styled.button`
  min-width: clamp(140px, 15vw, 180px);
  padding: 12px 32px;
  color: #dcdce5;
  background: rgba(255, 255, 255, 0.05);
  border: 1.5px solid rgba(255, 255, 255, 0.12);
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    color: #ffd700;
    background: rgba(255, 215, 0, 0.08);
    border-color: #ffd700;
  }

  @media (max-width: 480px) {
    width: 100%;
    min-width: unset;
  }
`;

interface ConfirmButtonProps {
  disabled: boolean;
}

export const ConfirmButton = styled.button<ConfirmButtonProps>`
  min-width: clamp(180px, 20vw, 240px);
  padding: 12px 36px;
  color: ${({ disabled }) => (disabled ? '#888' : '#0a0810')};
  background: ${({ disabled }) => (disabled ? '#444' : '#ffd700')};
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    transform: scale(1.02);
    box-shadow: 0 6px 28px rgba(255, 215, 0, 0.3);
  }

  &:active:not(:disabled) {
    transform: scale(0.97);
  }

  @media (max-width: 480px) {
    width: 100%;
    min-width: unset;
  }
`;

export const ErrorText = styled.span`
  color: #ff6b6b;
  font-size: 0.8rem;
  margin-top: 4px;
  display: block;
`;

export const LoadingText = styled.div`
  width: 100%;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 60px 0;
  color: #dcdce5;
  font-size: 1.2rem;

  &::after {
    content: '';
    width: 24px;
    height: 24px;
    border: 3px solid #ffd700;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export const NameCounter = styled.span<{ isLimit: boolean }>`
  color: ${({ isLimit }) => (isLimit ? '#ff6b6b' : '#9999aa')};
  font-size: 0.75rem;
  margin-top: 4px;
  display: block;
  text-align: right;
`;