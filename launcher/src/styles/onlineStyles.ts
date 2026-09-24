import styled from 'styled-components';
import { colors } from './colors';
import { fontFamilies } from './typography';

export const World = styled.div`
  min-height: 100vh;
  background: linear-gradient(110deg, rgba(7, 9, 13, 0.94), rgba(7, 9, 13, 0.78)),
    url('/assets/images/backgrounds/launcher_wallpaper.jpg') center / cover fixed;
  color: ${colors.text.primary};

  a {
    color: #e6c785;
    text-underline-offset: 4px;
  }

  button,
  input,
  select,
  a {
    &:focus-visible {
      outline: 2px solid #e6c785;
      outline-offset: 3px;
    }
  }

  input,
  select {
    color-scheme: dark;
  }
`;

export const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 22px clamp(20px, 5vw, 72px);
  border-bottom: 1px solid #635035;
  background: rgba(9, 11, 15, 0.85);
  flex-wrap: wrap;
`;

export const Brand = styled.div`
  font-family: ${fontFamilies.display};
  color: #e6c785;
  letter-spacing: 0.14em;
  font-size: 1.05rem;

  small {
    display: block;
    font-family: ${fontFamilies.ui};
    color: #999d9f;
    letter-spacing: 0.25em;
    font-size: 0.6rem;
    margin-top: 5px;
  }
`;

export const Layout = styled.div`
  display: grid;
  grid-template-columns: 210px minmax(0, 1fr);
  gap: 36px;
  max-width: 1440px;
  margin: auto;
  padding: 36px clamp(20px, 4vw, 56px) 70px;

  @media (max-width: 850px) {
    grid-template-columns: 1fr;
    gap: 24px;
    padding-top: 20px;
  }
`;

export const Navigation = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-self: start;

  a {
    padding: 13px 16px;
    text-decoration: none;
    color: #b7b5ae;
    border-left: 2px solid transparent;
  }

  a.active {
    background: linear-gradient(90deg, #70502d55, transparent);
    color: #f1d79e;
    border-color: #d0a255;
  }

  a:hover {
    background-color: #b9934a15;
  }

  @media (max-width: 850px) {
    flex-direction: row;
    flex-wrap: wrap;

    a {
      padding: 9px 12px;
    }
  }
`;

export const Main = styled.main`
  min-width: 0;
`;

export const PageHeading = styled.div`
  margin-bottom: 28px;

  h1 {
    font-family: ${fontFamilies.display};
    color: #e6c785;
    font-size: clamp(1.7rem, 3vw, 2.5rem);
    font-weight: 600;
  }

  p {
    color: #b6b8bd;
    margin-top: 10px;
    line-height: 1.6;
  }
`;

export const Panel = styled.section`
  padding: clamp(20px, 3vw, 30px);
  margin-bottom: 24px;
  border: 1px solid #655035;
  border-top-color: #a18046;
  border-radius: 3px;
  background: linear-gradient(125deg, rgba(29, 30, 34, 0.95), rgba(14, 17, 23, 0.96));
  box-shadow: 0 12px 35px #0004, inset 0 0 0 3px #0a0c1155;

  h2 {
    font-family: ${fontFamilies.display};
    font-size: 1.2rem;
    color: #e0c490;
    margin-bottom: 16px;
  }

  p {
    line-height: 1.6;
  }
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
`;

export const Spread = styled(Row)`
  justify-content: space-between;
`;

export const Stack = styled.div`
  display: grid;
  gap: 18px;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 265px), 1fr));
  gap: 22px;
`;

export const Muted = styled.p`
  color: #b6b8bd;
  font-size: 0.9rem;
  line-height: 1.6;
`;

export const Field = styled.label`
  display: grid;
  gap: 8px;
  font-size: 0.85rem;
  color: #d8c7a7;
  min-width: 0;

  input,
  select {
    font: inherit;
    min-height: 44px;
    padding: 11px 12px;
    width: 100%;
    min-width: 0;
    background: #090c12;
    border: 1px solid #5c5648;
    border-radius: 3px;
    color: #f0ede4;
  }

  input:disabled,
  select:disabled {
    opacity: 0.5;
  }
`;

export const InputWithIcon = styled.div`
  position: relative;

  span {
    position: absolute;
    left: 13px;
    top: 50%;
    transform: translateY(-50%);
    color: #d8b56e;
    pointer-events: none;
  }

  input {
    padding-left: 42px;
  }
`;

export const Form = styled.form`
  display: grid;
  gap: 20px;
`;

export const Notice = styled.div<{ $error?: boolean }>`
  padding: 14px 18px;
  margin-bottom: 18px;
  border-left: 3px solid
    ${({ $error }) => ($error ? '#d87b78' : '#c8a45d')};
  background: ${({ $error }) => ($error ? '#3b2024' : '#322d20')};
  color: ${({ $error }) => ($error ? '#ffd3cb' : '#f0dfb9')};
  line-height: 1.6;
`;

export const ListRow = styled.div`
  padding: 18px 0;
  border-bottom: 1px solid #3d3c36;

  &:last-child {
    border-bottom: 0;
  }
`;

export const Tag = styled.span<{ $good?: boolean }>`
  display: inline-block;
  padding: 4px 9px;
  border: 1px solid ${({ $good }) => ($good ? '#527b60' : '#665638')};
  background: ${({ $good }) => ($good ? '#20342a' : '#29251e')};
  color: ${({ $good }) => ($good ? '#b9e3c5' : '#decb9e')};
  border-radius: 3px;
  font-size: 0.75rem;
`;

export const Hero = styled(Panel)`
  padding: 42px;
  min-height: 220px;
  display: grid;
  gap: 20px;
  align-content: center;
  background: linear-gradient(90deg, #101217f5, #1615158a),
    url('/assets/images/backgrounds/menuWallpaper.png') center / cover;

  h2 {
    font-size: 1.8rem;
    margin: 0;
  }

  @media (max-width: 600px) {
    padding: 25px;
  }
`;

export const AuthCard = styled(Panel)`
  width: min(100% - 32px, 460px);
  margin: 8vh auto 0;
`;

export const Choice = styled.button<{ $selected: boolean }>`
  text-align: left;
  padding: 22px;
  border: 1px solid ${({ $selected }) => ($selected ? '#e3bd70' : '#514839')};
  background: ${({ $selected }) => ($selected ? '#51402366' : '#11151c')};
  color: #e7e4dc;
  border-radius: 3px;

  strong {
    display: block;
    font-family: ${fontFamilies.display};
    font-size: 1.15rem;
    color: #ead5a6;
    margin-bottom: 8px;
  }

  span {
    font-size: 0.85rem;
    line-height: 1.6;
    color: #b6b8bd;
  }
`;
