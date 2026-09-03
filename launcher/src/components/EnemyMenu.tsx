import React, { useState } from 'react';
import { ENEMIES } from '../data/enemiesBlackmoor';
import { ENEMY_DETAILS, EnemyDetail } from '../data/enemyDetails';
import type { Enemy } from '../types/enemiesBlackmoor.types';
import EnemyDetailModal from './EnemyDetailModal';
import {
  EnemyMenuContainer,
  EnemyMenuHeader,
  EnemyMenuTitle,
  EnemyMenuSubtitle,
  EnemyDivider,
  EnemyList,
  EnemyMenuItem,
  EnemyIcon,
  EnemyInfo,
  EnemyName,
  EnemyType,
} from '../styles/enemyMenuStyles';

const TYPE_TO_SVG: Record<string, string> = {
  Humanoide: '/assets/images/enemy/humanoide.svg',
  Monstro: '/assets/images/enemy/monstruoso.svg',
  Animal: '/assets/images/enemy/bestas.svg',
  Elite: '/assets/images/enemy/elite.svg',
  Boss: '/assets/images/enemy/boss.svg',
};

const EnemyMenu: React.FC = () => {
  const [selectedEnemy, setSelectedEnemy] = useState<EnemyDetail | null>(null);

  // Agrupar por tipo
  const grouped = ENEMIES.reduce<Record<string, Enemy[]>>((acc, enemy) => {
    const key = enemy.type;
    if (!acc[key]) acc[key] = [];
    acc[key].push(enemy);
    return acc;
  }, {});

  const typeOrder = ['Humanoide', 'Monstro', 'Animal', 'Elite', 'Boss'];

  const getIcon = (enemy: Enemy): string => {
    return TYPE_TO_SVG[enemy.type] || enemy.icon;
  };

  const isImagePath = (src: string): boolean => {
    return src.startsWith('/') || src.startsWith('http');
  };

  const handleEnemyClick = (enemyId: string) => {
    const detail = ENEMY_DETAILS[enemyId];
    if (detail) {
      setSelectedEnemy(detail);
    }
  };

  const handleCloseModal = () => {
    setSelectedEnemy(null);
  };

  return (
    <>
      <EnemyMenuContainer>
        <EnemyMenuHeader>
          <EnemyMenuTitle> Inimigos</EnemyMenuTitle>
          <EnemyMenuSubtitle>Bestiário de Blackmoor</EnemyMenuSubtitle>
        </EnemyMenuHeader>

        <EnemyDivider />

        <EnemyList>
          {typeOrder.map((type) => {
            const enemies = grouped[type] || [];
            if (enemies.length === 0) return null;

            return (
              <React.Fragment key={type}>
                {/* Cabeçalho do tipo */}
                <div
                  style={{
                    padding: '10px 0 4px',
                    fontWeight: 800,
                    color: '#3b2412',
                    fontFamily: "'Cinzel', serif",
                    fontSize: '0.7rem',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    borderBottom: '1px solid rgba(60, 32, 14, 0.15)',
                    marginBottom: '4px',
                  }}
                >
                  {type}
                </div>

                {enemies.map((enemy) => {
                  const isElite = enemy.type === 'Elite';
                  const isBoss = enemy.type === 'Boss';
                  const iconSrc = getIcon(enemy);

                  return (
                    <EnemyMenuItem
                      key={enemy.id}
                      $isElite={isElite}
                      $isBoss={isBoss}
                      onClick={() => handleEnemyClick(enemy.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <EnemyIcon>
                        {isImagePath(iconSrc) ? (
                          <img
                            src={iconSrc}
                            alt={enemy.type}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'contain',
                              display: 'block',
                            }}
                          />
                        ) : (
                          <span style={{ fontSize: '1.4rem' }}>{iconSrc}</span>
                        )}
                      </EnemyIcon>
                      <EnemyInfo>
                        <EnemyName>{enemy.name}</EnemyName>
                        <EnemyType>{enemy.type}</EnemyType>
                        {/* Função (role) exibida como texto adicional */}
                        <div
                          style={{
                            fontSize: '0.5rem',
                            color: 'rgba(59, 36, 18, 0.5)',
                            marginTop: '2px',
                          }}
                        >
                          {enemy.role}
                        </div>
                      </EnemyInfo>
                    </EnemyMenuItem>
                  );
                })}
                <EnemyDivider />
              </React.Fragment>
            );
          })}
        </EnemyList>
      </EnemyMenuContainer>

      <EnemyDetailModal enemy={selectedEnemy} onClose={handleCloseModal} />
    </>
  );
};

export default EnemyMenu;
