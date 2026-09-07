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

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 50% 0%, rgba(205, 157, 68, 0.22), transparent 35%), linear-gradient(90deg, rgba(4, 7, 12, 0.82), transparent 26%, transparent 74%, rgba(4, 7, 12, 0.82));
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(4, 7, 13, 0.7) 0%, rgba(8, 10, 17, 0.52) 42%, rgba(4, 5, 9, 0.9) 100%), repeating-linear-gradient(90deg, rgba(255, 214, 132, 0.025) 0 1px, transparent 1px 5px);
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
  padding: clamp(20px, 3vw, 34px);
  border: 1px solid rgba(198, 151, 68, 0.36);
  border-top-color: rgba(239, 204, 126, 0.68);
  background: linear-gradient(135deg, rgba(16, 19, 27, 0.84), rgba(8, 10, 16, 0.8));
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.48), inset 0 0 0 4px rgba(6, 8, 13, 0.38);

  &::before, &::after { content: '◆'; position: absolute; color: #d6ad58; font-size: 0.75rem; text-shadow: 0 0 12px rgba(255, 215, 128, 0.8); }
  &::before { top: 10px; left: 12px; }
  &::after { right: 12px; bottom: 10px; }
`;

export const Header = styled.header`
  width: 100%;
  text-align: center;
  margin-bottom: 32px;
  position: relative;
  &::after { content: ''; display: block; width: min(360px, 76%); height: 1px; margin: 16px auto 0; background: linear-gradient(90deg, transparent, #b98b3e 18%, #f0d188 50%, #b98b3e 82%, transparent); box-shadow: 0 0 10px rgba(232, 191, 105, 0.35); }
`;

export const Title = styled.h1`
  margin: 0 0 8px;
  color: #f4d88f;
  font-family: 'Cinzel', serif;
  font-size: clamp(2rem, 4vw, 2.8rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-shadow: 0 2px 0 #35230e, 0 0 32px rgba(255, 215, 0, 0.3);
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
  background: linear-gradient(145deg, rgba(37, 39, 45, 0.96), rgba(14, 17, 23, 0.98));
  border: 1px solid rgba(190, 148, 73, 0.48);
  border-radius: 3px;
  padding: 24px;
  margin-bottom: 28px;
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.36), inset 0 0 0 3px rgba(0, 0, 0, 0.18);
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
  color: #b7ad9c;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
`;

export const InfoValue = styled.span`
  color: #f2d692;
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
  padding: 18px;
  box-sizing: border-box;
  border: 1px solid rgba(224, 181, 95, 0.35);
  background: rgba(5, 8, 13, 0.38);
`;

export const InputGroup = styled.div`
  width: 100%;
  margin-bottom: 20px;
`;

export const Label = styled.label`
  display: block;
  color: #e9cf93;
  font-family: 'Cinzel', Georgia, serif;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 8px;
`;

export const Input = styled.input`
  width: 100%;
  padding: 14px 18px;
  background: rgba(4, 7, 11, 0.72);
  border: 1px solid rgba(224, 181, 95, 0.42);
  border-radius: 2px;
  color: #fff2d2;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  box-sizing: border-box;

  &::placeholder {
    color: #666677;
  }

  &:focus {
    outline: none;
    border-color: #f2cf7d;
    background: rgba(78, 58, 28, 0.32);
    box-shadow: 0 0 0 3px rgba(242, 207, 125, 0.16), inset 0 0 14px rgba(255, 215, 128, 0.08);
  }

  &:hover {
    border-color: rgba(255, 215, 0, 0.3);
  }

  &[aria-invalid='true'] { border-color: #e46d63; box-shadow: 0 0 0 3px rgba(228, 109, 99, 0.14); }
`;

export const CharacterPreview = styled.div`
  width: 100%;
  max-width: 200px;
  height: 200px;
  margin: 0 auto 24px;
  border-radius: 3px;
  border: 1px solid rgba(224, 181, 95, 0.65);
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
    border-radius: 3px;
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
  color: #f5dfad;
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
  color: #dfc995;
  font-family: 'Cinzel', Georgia, serif;
  background: linear-gradient(180deg, rgba(64, 53, 39, 0.95), rgba(25, 25, 28, 0.95));
  border: 1px solid rgba(216, 176, 98, 0.65);
  border-radius: 2px;
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
  color: ${({ disabled }) => (disabled ? '#888' : '#fff1c4')};
  font-family: 'Cinzel', Georgia, serif;
  background: ${({ disabled }) => disabled ? '#303034' : 'linear-gradient(180deg, #b68435, #72501d)'};
  border: 1px solid ${({ disabled }) => (disabled ? '#4b4b50' : '#f2cf7d')};
  border-radius: 2px;
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
  color: #ff9b91;
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

export const NameCounter = styled.span<{ $isLimit: boolean }>`
  color: ${({ $isLimit }) => ($isLimit ? '#ff6b6b' : '#9999aa')};
  font-size: 0.75rem;
  margin-top: 4px;
  display: block;
  text-align: right;
`;
