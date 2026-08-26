import styled from 'styled-components';

export const Container = styled.div`
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  background: #0a0810;
`;

export const BackgroundImage = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('/assets/images/backgrounds/menuWallpaper.png') center/cover no-repeat;
  opacity: 0.6;
  z-index: 0;
`;

export const ContentWrapper = styled.div`
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 2rem;
  background: rgba(0, 0, 0, 0.5);
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
`;

export const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: #ffd700;
  margin: 0;
  text-shadow: 0 0 30px rgba(255, 215, 0, 0.3);
  font-family: 'Cinzel', serif;
  letter-spacing: 2px;
`;

export const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: #aaa;
  font-size: 2rem;
  cursor: pointer;
  padding: 0.5rem 1rem;
  transition: all 0.2s;
  border-radius: 8px;

  &:hover {
    color: #fff;
    transform: scale(1.1);
    background: rgba(255, 255, 255, 0.1);
  }
`;

export const MainContent = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
  padding: 2rem;
  gap: 2rem;
`;

export const Sidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 200px;
  padding-right: 2rem;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  overflow-y: auto;
  flex-shrink: 0;
`;

export const SectionButton = styled.button<{ active: boolean }>`
  background: ${props => props.active ? 'rgba(255, 215, 0, 0.15)' : 'transparent'};
  border: none;
  color: ${props => props.active ? '#ffd700' : '#aaa'};
  padding: 0.75rem 1.5rem;
  text-align: left;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s;
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  border: 1px solid ${props => props.active ? 'rgba(255, 215, 0, 0.3)' : 'transparent'};

  &:hover {
    background: rgba(255, 215, 0, 0.1);
    color: #fff;
  }
`;

export const Panel = styled.div`
  flex: 1;
  overflow-y: auto;
  padding-right: 1rem;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 215, 0, 0.3);
    border-radius: 3px;
  }
`;

export const SectionTitle = styled.h2`
  color: #fff;
  font-size: 1.5rem;
  margin: 0 0 1.5rem 0;
  font-family: 'Cinzel', serif;
  letter-spacing: 1px;
`;

export const OptionGroup = styled.div`
  margin-bottom: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

export const OptionLabel = styled.label`
  display: block;
  color: #dcdce5;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

export const OptionDescription = styled.span`
  display: block;
  color: #888;
  font-size: 0.8rem;
  margin-top: 0.25rem;
`;

export const Select = styled.select`
  width: 100%;
  max-width: 300px;
  padding: 0.6rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }

  &:focus {
    outline: none;
    border-color: #ffd700;
  }

  option {
    background: #1a1a1a;
    color: #fff;
  }
`;

export const Slider = styled.input.attrs({ type: 'range' })`
  width: 100%;
  max-width: 300px;
  height: 6px;
  -webkit-appearance: none;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
  outline: none;
  transition: all 0.2s;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #ffd700;
    cursor: pointer;
    transition: all 0.2s;
  }

  &::-webkit-slider-thumb:hover {
    transform: scale(1.1);
  }

  &::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #ffd700;
    cursor: pointer;
    border: none;
  }
`;

export const SliderValue = styled.span`
  color: #aaa;
  font-size: 0.9rem;
  margin-left: 1rem;
  min-width: 40px;
  display: inline-block;
`;

export const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  padding: 0.25rem 0;
`;

export const Toggle = styled.div<{ active: boolean }>`
  width: 48px;
  height: 26px;
  background: ${props => props.active ? '#ffd700' : 'rgba(255, 255, 255, 0.2)'};
  border-radius: 13px;
  position: relative;
  transition: all 0.3s;
  flex-shrink: 0;
  cursor: pointer;

  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${props => props.active ? '24px' : '2px'};
    width: 22px;
    height: 22px;
    background: white;
    border-radius: 50%;
    transition: all 0.3s;
  }
`;

export const ToggleLabel = styled.span`
  color: #dcdce5;
  font-size: 0.95rem;
`;

export const ShortcutGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 0.75rem;
  margin-top: 0.5rem;
`;

export const ShortcutItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
`;

export const ShortcutAction = styled.span`
  color: #dcdce5;
  font-size: 0.9rem;
`;

export const ShortcutKey = styled.span`
  color: #fff;
  background: rgba(255, 215, 0, 0.2);
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.85rem;
  font-family: monospace;
  border: 1px solid rgba(255, 215, 0, 0.3);
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 215, 0, 0.3);
  }
`;

export const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding: 1.5rem 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
`;

export const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
  font-family: 'Cinzel', serif;

  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background: #ffd700;
          color: #0a0810;
          &:hover {
            background: #f0c800;
            transform: translateY(-2px);
            box-shadow: 0 4px 20px rgba(255, 215, 0, 0.3);
          }
        `;
      case 'danger':
        return `
          background: #ff4444;
          color: white;
          &:hover {
            background: #cc3333;
            transform: translateY(-2px);
          }
        `;
      default:
        return `
          background: rgba(255, 255, 255, 0.1);
          color: #dcdce5;
          &:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: translateY(-2px);
          }
        `;
    }
  }}
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

export const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;