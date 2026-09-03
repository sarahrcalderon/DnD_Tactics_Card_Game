// src/components/SideMenu.tsx

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

// ============================================================
// MAPEAMENTO DE ÍCONES PARA SVGs
// ============================================================

const ICON_PATHS: Record<string, string> = {
  deck: '/assets/images/icons/deck.svg',
  bag: '/assets/images/icons/bag.svg',
  equipment: '/assets/images/icons/equipamentos.svg',
  character: '/assets/images/icons/ficha.svg',
  bestiary: '/assets/images/icons/monstruario.svg',
  ranking: '/assets/images/icons/mapa.svg', // fallback (não há ícone específico)
  maps: '/assets/images/icons/mapa.svg',
};

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
        <SideMenuIcon>
          <img
            src={ICON_PATHS.deck}
            alt="Deck"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </SideMenuIcon>
        <SideMenuLabel>Deck</SideMenuLabel>
      </SideMenuItem>

      <SideMenuItem onClick={handleBag}>
        <SideMenuIcon>
          <img
            src={ICON_PATHS.bag}
            alt="Bolsa"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </SideMenuIcon>
        <SideMenuLabel>Bolsa</SideMenuLabel>
      </SideMenuItem>

      <SideMenuItem onClick={handleEquipment}>
        <SideMenuIcon>
          <img
            src={ICON_PATHS.equipment}
            alt="Equipamentos"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </SideMenuIcon>
        <SideMenuLabel>Equipamentos</SideMenuLabel>
      </SideMenuItem>

      <SideMenuItem onClick={handleCharacterSheet}>
        <SideMenuIcon>
          <img
            src={ICON_PATHS.character}
            alt="Ficha"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </SideMenuIcon>
        <SideMenuLabel>Ficha</SideMenuLabel>
      </SideMenuItem>

      <SideMenuDivider />

      <SideMenuItem onClick={handleBestiary} disabled>
        <SideMenuIcon>
          <img
            src={ICON_PATHS.bestiary}
            alt="Bestiário"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </SideMenuIcon>
        <SideMenuLabel>Bestiário</SideMenuLabel>
      </SideMenuItem>

      <SideMenuItem onClick={handleRanking} disabled>
        <SideMenuIcon>
          <img
            src={ICON_PATHS.ranking}
            alt="Ranking"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </SideMenuIcon>
        <SideMenuLabel>Ranking</SideMenuLabel>
      </SideMenuItem>

      <SideMenuItem onClick={handleMaps} disabled>
        <SideMenuIcon>
          <img
            src={ICON_PATHS.maps}
            alt="Mapas"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />
        </SideMenuIcon>
        <SideMenuLabel>Mapas</SideMenuLabel>
      </SideMenuItem>
    </SideMenuContainer>
  );
};

export default SideMenu;
