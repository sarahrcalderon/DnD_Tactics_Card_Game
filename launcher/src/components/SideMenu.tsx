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

const ICON_PATHS: Record<string, string> = {
  deck: '/assets/images/icons/deck.svg',
  bag: '/assets/images/icons/bag.svg',
  equipment: '/assets/images/icons/equipamentos.svg',
  character: '/assets/images/icons/ficha.svg',
  bestiary: '/assets/images/icons/monstruario.svg',
  ranking: '/assets/images/icons/ranking.svg',
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
              fromMap: true,
            },
          });
          return;
        }
      } catch {}
    }
    toast('Nenhum deck encontrado');
    navigate('/deck-select');
  };

  const handleBag = () => {
    navigate('/bag', { state: { fromMap: true } });
  };

  const handleEquipment = () => {
    const savedData = localStorage.getItem('characterData');
    if (!savedData) {
      toast.error('Nenhum personagem salvo encontrado');
      return;
    }

    try {
      const parsed = JSON.parse(savedData);
      const classId = parsed.classId || parsed.className?.toLowerCase();
      if (!classId || !parsed.attributes) {
        toast.error('Dados do personagem est\u00e3o incompletos');
        return;
      }

      navigate('/equipment', {
        state: {
          name: parsed.name || parsed.characterName || '',
          characterName: parsed.name || parsed.characterName || '',
          classId,
          className: parsed.className || '',
          raceId: parsed.raceId || '',
          raceName: parsed.raceName || '',
          raceImage: parsed.raceImage || '',
          raceIcon: parsed.raceIcon || '',
          deityId: parsed.deityId || '',
          deityName: parsed.deityName || '',
          level: parsed.level || 1,
          attributes: parsed.attributes,
          derivedStats: parsed.derivedStats,
          equipment: parsed.equipment || {},
          deckId: parsed.deckId || '',
          deckName: parsed.deckName || '',
          pointsRemaining: parsed.pointsRemaining ?? 0,
          totalPoints: parsed.totalPoints ?? 5,
          isSaved: parsed.isSaved || parsed.isFinalized || false,
          isFinalized: parsed.isFinalized || false,
          saveId: parsed.saveId || null,
          progress: parsed.progress || 0,
          location: parsed.location || 'Acampamento Inicial',
          createdAt: parsed.createdAt,
          fromMap: true,
        },
      });
    } catch {
      toast.error('N\u00e3o foi poss\u00edvel carregar o personagem');
    }
  };

  const handleCharacterSheet = () => {
    const savedData = localStorage.getItem('characterData');
    if (!savedData) {
      toast.error('Nenhum personagem salvo encontrado');
      return;
    }

    try {
      const parsed = JSON.parse(savedData);
      const classId = parsed.classId || parsed.className?.toLowerCase();
      if (!classId || !parsed.attributes) {
        toast.error('Dados do personagem est\u00e3o incompletos');
        return;
      }

      navigate('/attribute-dist', {
        state: {
          classId,
          raceId: parsed.raceId || '',
          raceName: parsed.raceName || '',
          raceImage: parsed.raceImage || '',
          raceIcon: parsed.raceIcon || '',
          deityId: parsed.deityId || '',
          deityName: parsed.deityName || '',
          characterName: parsed.name || parsed.characterName || '',
          attributes: parsed.attributes,
          derivedStats: parsed.derivedStats,
          deckId: parsed.deckId || '',
          deckName: parsed.deckName || '',
          saveId: parsed.saveId || '',
          isSaved: parsed.isSaved || parsed.isFinalized || false,
          pointsRemaining: parsed.pointsRemaining ?? 0,
          fromMap: true,
        },
      });
    } catch {
      toast.error('N\u00e3o foi poss\u00edvel carregar o personagem');
    }
  };

  const handleBestiary = () => {};

  const handleRanking = () => {};

  const handleMaps = () => {};

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
