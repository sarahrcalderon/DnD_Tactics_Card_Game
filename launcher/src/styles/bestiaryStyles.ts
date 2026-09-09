import styled, { css } from 'styled-components';

const panel = css`
  background: linear-gradient(
    145deg,
    rgba(30, 27, 52, 0.96),
    rgba(12, 11, 25, 0.96)
  );
  border: 1px solid rgba(218, 173, 74, 0.28);
  box-shadow:
    0 14px 35px rgba(0, 0, 0, 0.34),
    inset 0 1px rgba(255, 239, 174, 0.06);
`;

export const BestiaryShell = styled.main`
  min-height: 100vh;
  min-height: 100dvh;
  box-sizing: border-box;
  padding: clamp(18px, 4vw, 54px);
  color: #e9e6f0;
  background: radial-gradient(
    circle at 50% -10%,
    #3d345e 0,
    #16132a 36%,
    #080711 78%
  );
`;

export const TopBar = styled.header`
  max-width: 1420px;
  margin: 0 auto 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
`;

export const BackButton = styled.button`
  color: #e9d89b;
  border: 1px solid rgba(218, 173, 74, 0.45);
  background: rgba(12, 10, 23, 0.7);
  padding: 9px 14px;
  border-radius: 5px;
  cursor: pointer;
  font-weight: 700;

  &:hover {
    background: rgba(218, 173, 74, 0.14);
  }
`;

export const Heading = styled.div`
  text-align: center;

  h1 {
    margin: 0;
    color: #f5d776;
    font-family: 'Cinzel', serif;
    font-size: clamp(1.7rem, 4vw, 3rem);
    letter-spacing: 0.12em;
    text-transform: uppercase;
  }

  p {
    margin: 7px 0 0;
    color: #aaa5bd;
    font-size: 0.83rem;
    letter-spacing: 0.08em;
  }
`;

export const MonsterCount = styled.div`
  min-width: 92px;
  text-align: right;
  color: #aaa5bd;
  font-size: 0.76rem;

  strong {
    display: block;
    color: #f5d776;
    font: 700 1.45rem 'Cinzel', serif;
  }
`;

export const Layout = styled.section`
  max-width: 1420px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr) 330px;
  gap: 18px;

  @media (max-width: 1120px) {
    grid-template-columns: 230px minmax(0, 1fr);
  }

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`;

export const FilterPanel = styled.aside`
  ${panel};
  height: max-content;
  padding: 18px;
  border-radius: 7px;
`;

export const FilterTitle = styled.h2`
  margin: 0 0 16px;
  color: #e9d89b;
  font: 700 0.78rem 'Cinzel', serif;
  letter-spacing: 0.1em;
  text-transform: uppercase;
`;

export const SearchInput = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 11px;
  color: #f4f1fb;
  background: rgba(0, 0, 0, 0.26);
  border: 1px solid rgba(218, 173, 74, 0.25);
  border-radius: 4px;
  outline: none;

  &:focus {
    border-color: #d6a843;
  }
`;

export const CategoryButton = styled.button<{ $active: boolean }>`
  width: 100%;
  margin-top: 7px;
  padding: 10px;
  color: ${({ $active }) =>
    $active ? '#211a09' : '#c5c0d1'};
  background: ${({ $active }) =>
    $active ? '#d7ae50' : 'transparent'};
  border: 1px solid
    ${({ $active }) =>
      $active ? '#e7ca80' : 'rgba(218, 173, 74, 0.14)'};
  border-radius: 4px;
  text-align: left;
  cursor: pointer;
  font-weight: 700;

  &:hover {
    border-color: #d7ae50;
  }
`;

export const EliteToggle = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 18px;
  color: #c5c0d1;
  font-size: 0.78rem;
  cursor: pointer;

  input {
    accent-color: #d7ae50;
  }
`;

export const GridPanel = styled.section`
  ${panel};
  min-height: 650px;
  padding: 18px;
  border-radius: 7px;
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
  gap: 14px;
`;

export const MonsterCard = styled.button<{
  $elite: boolean;
  $selected: boolean;
}>`
  position: relative;
  min-height: 254px;
  overflow: hidden;
  padding: 0;
  color: inherit;
  text-align: left;
  cursor: pointer;
  border: 1px solid
    ${({ $selected, $elite }) =>
      $selected
        ? '#f4d878'
        : $elite
          ? '#b98234'
          : 'rgba(214, 206, 242, 0.18)'};
  border-radius: 5px;
  background: #151225;
  transition:
    transform 0.18s,
    border-color 0.18s,
    box-shadow 0.18s;

  &:hover {
    transform: translateY(-4px);
    border-color: #e1bd5d;
    box-shadow: 0 10px 22px rgba(0, 0, 0, 0.44);
  }
`;

export const CardImage = styled.img`
  width: 100%;
  height: 142px;
  object-fit: cover;
  display: block;
  opacity: 0.88;
`;

export const CardContent = styled.div`
  padding: 11px;
`;

export const CardName = styled.h3`
  margin: 0;
  color: #f4f1fb;
  font: 700 0.9rem 'Cinzel', serif;
`;

export const CardMeta = styled.p`
  margin: 6px 0 0;
  color: #aaa5bd;
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const TierBadge = styled.span<{ $elite: boolean }>`
  position: absolute;
  top: 9px;
  right: 9px;
  padding: 4px 7px;
  color: ${({ $elite }) =>
    $elite ? '#241407' : '#16131e'};
  background: ${({ $elite }) =>
    $elite ? '#e0a949' : '#d0cad8'};
  border-radius: 3px;
  font-size: 0.58rem;
  font-weight: 800;
  text-transform: uppercase;
`;

export const EmptyState = styled.p`
  margin: 70px 0;
  color: #aaa5bd;
  text-align: center;
`;

export const DetailPanel = styled.aside`
  ${panel};
  min-height: 500px;
  padding: 20px;
  border-radius: 7px;

  @media (max-width: 1120px) {
    grid-column: 1 / -1;
  }
`;

export const DetailImage = styled.img`
  width: 100%;
  max-height: 190px;
  object-fit: cover;
  border-radius: 4px;
  opacity: 0.9;
`;

export const DetailName = styled.h2`
  margin: 16px 0 5px;
  color: #f4d878;
  font: 700 1.25rem 'Cinzel', serif;
`;

export const DetailMeta = styled.p`
  margin: 0;
  color: #aaa5bd;
  font-size: 0.72rem;
  text-transform: uppercase;
`;

export const Description = styled.p`
  color: #d0ccda;
  font: 0.85rem/1.55 Georgia, serif;
`;

export const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 7px;
  margin: 16px 0;
`;

export const Stat = styled.div`
  padding: 8px 4px;
  text-align: center;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(218, 173, 74, 0.15);

  small {
    display: block;
    color: #9993ad;
    font-size: 0.58rem;
  }

  strong {
    color: #f0db9e;
    font-size: 0.95rem;
  }
`;

export const DetailSection = styled.section`
  margin-top: 16px;

  h3 {
    margin: 0 0 8px;
    color: #e9d89b;
    font: 700 0.7rem 'Cinzel', serif;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }
`;

export const Entry = styled.div`
  padding: 8px 0;
  border-top: 1px solid rgba(218, 173, 74, 0.12);

  strong {
    color: #f2eff8;
    font-size: 0.76rem;
  }

  p {
    margin: 3px 0 0;
    color: #b8b2c6;
    font-size: 0.73rem;
    line-height: 1.4;
  }
`;

export const Placeholder = styled.div`
  display: grid;
  min-height: 440px;
  place-items: center;
  color: #918ba1;
  text-align: center;
  font-size: 0.85rem;
`;