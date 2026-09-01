import React from 'react';

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

// ============================================================
// TYPES
// ============================================================

interface Enemy {
  id: string;
  name: string;
  type: string;
  icon: string;
}

// ============================================================
// INIMIGOS DO MAPA
// ============================================================
//
// Futuramente estes dados podem vir de:
// src/data/mapEnemies.ts
//
// Por enquanto permanecem aqui para manter
// o componente funcional e simples.
//

const mapEnemies: Enemy[] = [
  {
    id: 'goblin',
    name: 'Goblin',
    type: 'Humanoide',
    icon: '👺',
  },
  {
    id: 'wolf',
    name: 'Lobo',
    type: 'Besta',
    icon: '🐺',
  },
  {
    id: 'skeleton',
    name: 'Esqueleto',
    type: 'Morto-vivo',
    icon: '💀',
  },
];

// ============================================================
// COMPONENT
// ============================================================

const EnemyMenu: React.FC = () => {
  return (
    <EnemyMenuContainer>
      {' '}
      <EnemyMenuHeader>
        {' '}
        <EnemyMenuTitle>Inimigos </EnemyMenuTitle>
        ```
        <EnemyMenuSubtitle>Encontrados neste mapa</EnemyMenuSubtitle>
      </EnemyMenuHeader>
      <EnemyDivider />
      <EnemyList>
        {mapEnemies.map((enemy) => (
          <EnemyMenuItem key={enemy.id}>
            <EnemyIcon>{enemy.icon}</EnemyIcon>

            <EnemyInfo>
              <EnemyName>{enemy.name}</EnemyName>

              <EnemyType>{enemy.type}</EnemyType>
            </EnemyInfo>
          </EnemyMenuItem>
        ))}
      </EnemyList>
    </EnemyMenuContainer>
  );
};

export default EnemyMenu;
