import React from 'react';
import {
  EquipmentPreview as PreviewContainer,
  PreviewTitle,
  PreviewRarity,
  PreviewStats,
  PreviewStat,
  PreviewStatLabel,
  PreviewStatValue,
} from '../../styles/equipmentStyles';
import { Equipment, DerivedStats } from '../../types/character.types';

interface EquipmentPreviewProps {
  equipment: Equipment;
  currentStats: DerivedStats;
}

const getStatName = (key: string): string => {
  const names: Record<string, string> = {
    str: 'FORÇA',
    dex: 'DESTREZA',
    con: 'CONSTITUIÇÃO',
    int: 'INTELIGÊNCIA',
    wis: 'SABEDORIA',
    cha: 'CARISMA',
    defense: 'DEFESA',
    awareness: 'AWARENESS',
    critical: 'CRÍTICO',
    avoidance: 'AVOIDANCE',
    deflect: 'DEFLECT',
    actionPoints: 'ACTION POINTS',
    criticalSeverity: 'SEV. CRÍTICO',
    initiative: 'INICIATIVA',
    hp: 'HP',
    speed: 'VELOCIDADE',
    maxMana: 'MANA MÁXIMA',
    manaRegen: 'REG. MANA',
    manaPower: 'POTÊNCIA MÁGICA',
  };
  return names[key] || key.toUpperCase();
};

const getCurrentValue = (stats: DerivedStats, key: string): number => {
  const map: Record<string, keyof DerivedStats> = {
    defense: 'defense',
    awareness: 'awareness',
    critical: 'critical',
    avoidance: 'avoidance',
    deflect: 'deflect',
    actionPoints: 'actionPoints',
    criticalSeverity: 'criticalSeverity',
    initiative: 'initiative',
    hp: 'maxHP',
    speed: 'speed',
    maxMana: 'maxMana',
    manaRegen: 'manaRegen',
    manaPower: 'manaPower',
  };

  const statKey = map[key];
  if (statKey && statKey in stats) {
    return stats[statKey] as number;
  }
  return 0;
};

export const EquipmentPreview: React.FC<EquipmentPreviewProps> = ({
  equipment,
  currentStats,
}) => {
  if (!equipment || !equipment.stats) return null;

  const statsEntries = Object.entries(equipment.stats).filter(
    ([, value]) => value && value > 0,
  );

  if (statsEntries.length === 0) {
    return (
      <PreviewContainer>
        <PreviewTitle>{equipment.name}</PreviewTitle>
        <div
          style={{ color: '#666677', fontSize: '0.75rem', marginTop: '4px' }}
        >
          Este item não concede bônus de atributos.
        </div>
      </PreviewContainer>
    );
  }

  return (
    <PreviewContainer>
      <PreviewTitle>
        {equipment.name}
        <PreviewRarity $rarity={equipment.rarity}>
          {equipment.rarity}
        </PreviewRarity>
      </PreviewTitle>
      <PreviewStats>
        {statsEntries.map(([key, value]) => {
          const currentValue = getCurrentValue(currentStats, key);
          const newValue = currentValue + value;
          const isPositive = value > 0;

          return (
            <PreviewStat key={key} $isPositive={isPositive}>
              <PreviewStatLabel>{getStatName(key)}</PreviewStatLabel>
              <PreviewStatValue $isPositive={isPositive}>
                {currentValue} → {newValue}
                <span
                  style={{
                    fontSize: '0.6rem',
                    marginLeft: '2px',
                    color: isPositive ? '#2ecc71' : '#ff6b6b',
                  }}
                >
                  {isPositive ? `(+${value})` : `(${value})`}
                </span>
              </PreviewStatValue>
            </PreviewStat>
          );
        })}
        to
      </PreviewStats>
    </PreviewContainer>
  );
};

export default EquipmentPreview;
