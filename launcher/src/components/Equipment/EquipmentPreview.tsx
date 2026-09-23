import React from 'react';
import {
  EquipmentPreview as PreviewContainer, PreviewTitle, PreviewRarity, PreviewStats,
  PreviewStat, PreviewStatLabel, PreviewStatValue, PreviewHeader, PreviewImage,
  PreviewMeta, PreviewDescription, PreviewSectionTitle,
} from '../../styles/equipmentStyles';
import { Equipment, DerivedStats } from '../../types/character.types';
import { formatStatBonus, formatStatValue, StatValueFormat } from '../../utils/statFormat';

interface EquipmentPreviewProps { equipment: Equipment; currentStats: DerivedStats; }

const STAT_NAMES: Record<string, string> = {
  attack: 'ATAQUE', str: 'FORÇA', dex: 'DESTREZA', con: 'CONSTITUIÇÃO', int: 'INTELIGÊNCIA', wis: 'SABEDORIA', cha: 'CARISMA', defense: 'DEFESA', awareness: 'PERCEPÇÃO', critical: 'CRÍTICO', avoidance: 'EVASÃO', deflect: 'BLOQUEIO', actionPoints: 'PONTOS DE AÇÃO', criticalSeverity: 'SEV. CRÍTICA', initiative: 'INICIATIVA', hp: 'VIDA MÁX.', speed: 'VELOCIDADE', maxMana: 'MANA MÁX.', manaRegen: 'REG. DE MANA', manaPower: 'POTÊNCIA MÁGICA',
};
const STAT_TO_DERIVED: Record<string, keyof DerivedStats> = {
  defense: 'defense', awareness: 'awareness', critical: 'critical', avoidance: 'avoidance', deflect: 'deflect', actionPoints: 'actionPoints', criticalSeverity: 'criticalSeverity', initiative: 'initiative', hp: 'maxHP', speed: 'speed', maxMana: 'maxMana', manaRegen: 'manaRegen', manaPower: 'manaPower',
};
const getFormat = (key: string): StatValueFormat => {
  if (['critical', 'avoidance', 'deflect', 'criticalSeverity'].includes(key)) return 'percentage';
  if (key === 'speed') return 'distance';
  return 'decimal';
};

export const EquipmentPreview: React.FC<EquipmentPreviewProps> = ({ equipment, currentStats }) => {
  const statsEntries = Object.entries(equipment.stats || {}).filter(([, value]) => Number(value) !== 0);
  return <PreviewContainer role="status" aria-live="polite">
    <PreviewHeader><PreviewImage src={equipment.image || equipment.icon} alt="" /><div><PreviewTitle>{equipment.name}</PreviewTitle><PreviewMeta>{equipment.type} · Nível {equipment.level}</PreviewMeta><PreviewRarity $rarity={equipment.rarity}>{equipment.rarity}</PreviewRarity></div></PreviewHeader>
    <PreviewDescription>{equipment.description || 'Sem descrição disponível.'}</PreviewDescription>
    <PreviewSectionTitle>Bônus do equipamento</PreviewSectionTitle>
    {statsEntries.length ? <PreviewStats>{statsEntries.map(([key, value]) => {
      const format = getFormat(key); const derivedKey = STAT_TO_DERIVED[key]; const total = derivedKey ? currentStats[derivedKey] : null;
      return <PreviewStat key={key} $isPositive={Number(value) > 0}><PreviewStatLabel>{STAT_NAMES[key] || key.toUpperCase()}</PreviewStatLabel><PreviewStatValue $isPositive={Number(value) > 0}>{formatStatBonus(Number(value), format)}{total !== null && <small>Total: {formatStatValue(total, format)}</small>}</PreviewStatValue></PreviewStat>;
    })}</PreviewStats> : <PreviewMeta>Este item não concede bônus de atributos.</PreviewMeta>}
    <PreviewMeta>{equipment.isEquipped ? 'Equipado atualmente' : 'Disponível para equipar'}</PreviewMeta>
  </PreviewContainer>;
};

export default EquipmentPreview;
