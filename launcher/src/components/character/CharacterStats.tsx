import React from 'react';
import {
  StatsGrid,
  StatItem,
  StatLabel,
  StatValue,
  StatModifier,
} from '../../styles/attributeDistStyles';
import { DerivedStats } from '../../types/character.types';

interface CharacterStatsProps {
  stats: DerivedStats;
}

export const CharacterStats: React.FC<CharacterStatsProps> = ({ stats }) => {
  const statItems = [
    { label: 'Defesa', value: stats.defense, modifier: 'Base 10 + DEX' },
    { label: 'Awareness', value: stats.awareness, modifier: 'Base 10 + WIS' },
    { label: 'Crítico', value: `${stats.critical}%`, modifier: '5 + DEX/2' },
    { label: 'Avoidance', value: `${stats.avoidance}%`, modifier: '5 + DEX' },
    { label: 'Deflect', value: `${stats.deflect}%`, modifier: '5 + STR' },
    {
      label: 'Action Points',
      value: stats.actionPoints,
      modifier: '3 + CHA/2',
    },
    {
      label: 'Severidade Crítico',
      value: `${stats.criticalSeverity}%`,
      modifier: '150% + STR*5',
    },
    { label: 'Iniciativa', value: stats.initiative, modifier: 'DEX' },
    { label: 'HP Máximo', value: stats.maxHP, modifier: '10 + CON*5' },
    { label: 'Velocidade', value: `${stats.speed}m`, modifier: '9 + DEX/2' },
  ];

  return (
    <StatsGrid>
      {statItems.map((item) => (
        <StatItem key={item.label}>
          <StatLabel>{item.label}</StatLabel>
          <StatValue>{item.value}</StatValue>
          <StatModifier>{item.modifier}</StatModifier>
        </StatItem>
      ))}
    </StatsGrid>
  );
};
