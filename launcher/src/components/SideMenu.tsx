import React from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import {
  SideMenuContainer,
  SideMenuItem,
  SideMenuIcon,
  SideMenuLabel,
  SideMenuDivider,
} from '../styles/mapStyles';

const SideMenu: React.FC = () => {
  const navigate = useNavigate();

  const handleDeck = () => {
    const savedData = localStorage.getItem('characterData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        const deckId = parsed.deckId;
        const classId = parsed.classId || parsed.className?.toLowerCase() || '';
        if (deckId) {
          navigate('/deck-view', {
            state: {
              deckId,
              className: classId,
              raceName: parsed.raceName || '',
              raceImage: parsed.raceImage || '',
              raceIcon: parsed.raceIcon || '',
            },
          });
          return;
        }
      } catch {
        // ignore
      }
    }
    toast('Nenhum deck encontrado');
    navigate('/deck-select');
  };

  const handleBag = () => {
    navigate('/bag', { state: { fromMap: true } });
  };

  const handleEquipment = () => {
    navigate('/equipment');
  };

  const handleCharacterSheet = () => {
    navigate('/character-sheet');
  };

  const handleBestiary = () => {
    toast('📖 Bestiário em desenvolvimento', { duration: 2000 });
  };

  const handleRanking = () => {
    toast('🏆 Ranking em desenvolvimento', { duration: 2000 });
  };

  const handleMaps = () => {
    toast('🗺️ Mapas em desenvolvimento', { duration: 2000 });
  };

  return (
    <SideMenuContainer>
      <SideMenuItem onClick={handleDeck}>
        <SideMenuIcon>📜</SideMenuIcon>
        <SideMenuLabel>Deck</SideMenuLabel>
      </SideMenuItem>

      <SideMenuItem onClick={handleBag}>
        <SideMenuIcon>🎒</SideMenuIcon>
        <SideMenuLabel>Bolsa</SideMenuLabel>
      </SideMenuItem>

      <SideMenuItem onClick={handleEquipment}>
        <SideMenuIcon>⚔️</SideMenuIcon>
        <SideMenuLabel>Equipamentos</SideMenuLabel>
      </SideMenuItem>

      <SideMenuItem onClick={handleCharacterSheet}>
        <SideMenuIcon>🧙</SideMenuIcon>
        <SideMenuLabel>Ficha</SideMenuLabel>
      </SideMenuItem>

      <SideMenuDivider />

      <SideMenuItem onClick={handleBestiary} disabled>
        <SideMenuIcon>📖</SideMenuIcon>
        <SideMenuLabel>Bestiário</SideMenuLabel>
      </SideMenuItem>

      <SideMenuItem onClick={handleRanking} disabled>
        <SideMenuIcon>🏆</SideMenuIcon>
        <SideMenuLabel>Ranking</SideMenuLabel>
      </SideMenuItem>

      <SideMenuItem onClick={handleMaps} disabled>
        <SideMenuIcon>🗺️</SideMenuIcon>
        <SideMenuLabel>Mapas</SideMenuLabel>
      </SideMenuItem>
    </SideMenuContainer>
  );
};

export default SideMenu;
