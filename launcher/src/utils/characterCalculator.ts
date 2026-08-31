import { 
  Attributes, 
  DerivedStats, 
  Equipment
} from '../types/character.types';
import { CLASS_BASE_ATTRIBUTES, CLASS_BASE_STATS } from '../data/classData';

const getModifier = (value: number): number => {
  return Math.floor((value - 10) / 2);
};

export const getModifierDisplay = (value: number): string => {
  const mod = getModifier(value);
  return mod >= 0 ? `+${mod}` : `${mod}`;
};

export const calculateTotalAttributes = (
  classId: string,
  equipment: Record<string, Equipment | null>
): { base: Attributes; bonus: Attributes; total: Attributes } => {
  const baseAttributes = CLASS_BASE_ATTRIBUTES[classId] || CLASS_BASE_ATTRIBUTES.paladino;
  
  const bonusAttributes: Attributes = {
    str: 0,
    dex: 0,
    con: 0,
    int: 0,
    wis: 0,
    cha: 0,
  };

  Object.values(equipment).forEach((item) => {
    if (!item || !item.stats) return;
    if (item.stats.str) bonusAttributes.str += item.stats.str;
    if (item.stats.dex) bonusAttributes.dex += item.stats.dex;
    if (item.stats.con) bonusAttributes.con += item.stats.con;
    if (item.stats.int) bonusAttributes.int += item.stats.int;
    if (item.stats.wis) bonusAttributes.wis += item.stats.wis;
    if (item.stats.cha) bonusAttributes.cha += item.stats.cha;
  });

  return {
    base: baseAttributes,
    bonus: bonusAttributes,
    total: {
      str: baseAttributes.str + bonusAttributes.str,
      dex: baseAttributes.dex + bonusAttributes.dex,
      con: baseAttributes.con + bonusAttributes.con,
      int: baseAttributes.int + bonusAttributes.int,
      wis: baseAttributes.wis + bonusAttributes.wis,
      cha: baseAttributes.cha + bonusAttributes.cha,
    },
  };
};

export const calculateTotalDerivedStats = (
  classId: string,
  totalAttributes: Attributes,
  equipment: Record<string, Equipment | null>
): { base: DerivedStats; bonus: DerivedStats; total: DerivedStats } => {
  const baseStats = CLASS_BASE_STATS[classId] || CLASS_BASE_STATS.paladino;
  
  const strMod = getModifier(totalAttributes.str);
  const dexMod = getModifier(totalAttributes.dex);
  const conMod = getModifier(totalAttributes.con);
  const intMod = getModifier(totalAttributes.int);
  const wisMod = getModifier(totalAttributes.wis);
  const chaMod = getModifier(totalAttributes.cha);

  // Cálculo de MANA baseado em INT, WIS e CHA
  const baseMaxMana = 10 + (intMod * 2);
  const baseManaRegen = 1 + Math.floor(wisMod / 2);
  const baseManaPower = 5 + chaMod;

  const bonusStats: DerivedStats = {
    defense: 0,
    awareness: 0,
    critical: 0,
    avoidance: 0,
    deflect: 0,
    actionPoints: 0,
    criticalSeverity: 0,
    initiative: 0,
    maxHP: 0,
    speed: 0,
    maxMana: 0,
    manaRegen: 0,
    manaPower: 0,
  };

  Object.values(equipment).forEach((item) => {
    if (!item || !item.stats) return;
    if (item.stats.defense) bonusStats.defense += item.stats.defense;
    if (item.stats.awareness) bonusStats.awareness += item.stats.awareness;
    if (item.stats.critical) bonusStats.critical += item.stats.critical;
    if (item.stats.avoidance) bonusStats.avoidance += item.stats.avoidance;
    if (item.stats.deflect) bonusStats.deflect += item.stats.deflect;
    if (item.stats.actionPoints) bonusStats.actionPoints += item.stats.actionPoints;
    if (item.stats.criticalSeverity) bonusStats.criticalSeverity += item.stats.criticalSeverity;
    if (item.stats.initiative) bonusStats.initiative += item.stats.initiative;
    if (item.stats.hp) bonusStats.maxHP += item.stats.hp;
    if (item.stats.speed) bonusStats.speed += item.stats.speed;
    if (item.stats.int) bonusStats.maxMana += item.stats.int * 2;
    if (item.stats.wis) bonusStats.manaRegen += Math.floor(item.stats.wis / 2);
    if (item.stats.cha) bonusStats.manaPower += item.stats.cha;
  });

  const base: DerivedStats = {
    defense: Math.max(1, baseStats.defense + dexMod),
    awareness: Math.max(1, baseStats.awareness + wisMod),
    critical: Math.max(0, baseStats.critical + Math.floor(dexMod / 2)),
    avoidance: Math.max(0, baseStats.avoidance + dexMod),
    deflect: Math.max(0, baseStats.deflect + strMod),
    actionPoints: Math.max(1, baseStats.actionPoints + Math.floor(chaMod / 2)),
    criticalSeverity: Math.max(100, baseStats.criticalSeverity + (strMod * 5)),
    initiative: baseStats.initiative + dexMod,
    maxHP: Math.max(1, baseStats.hp + (conMod * 5)),
    speed: Math.max(1, baseStats.speed + Math.floor(dexMod / 2)),
    maxMana: Math.max(1, baseMaxMana),
    manaRegen: Math.max(0, baseManaRegen),
    manaPower: Math.max(1, baseManaPower),
  };

  return {
    base,
    bonus: bonusStats,
    total: {
      defense: Math.max(1, base.defense + bonusStats.defense),
      awareness: Math.max(1, base.awareness + bonusStats.awareness),
      critical: Math.max(0, base.critical + bonusStats.critical),
      avoidance: Math.max(0, base.avoidance + bonusStats.avoidance),
      deflect: Math.max(0, base.deflect + bonusStats.deflect),
      actionPoints: Math.max(1, base.actionPoints + bonusStats.actionPoints),
      criticalSeverity: Math.max(100, base.criticalSeverity + bonusStats.criticalSeverity),
      initiative: base.initiative + bonusStats.initiative,
      maxHP: Math.max(1, base.maxHP + bonusStats.maxHP),
      speed: Math.max(1, base.speed + bonusStats.speed),
      maxMana: Math.max(1, base.maxMana + bonusStats.maxMana),
      manaRegen: Math.max(0, base.manaRegen + bonusStats.manaRegen),
      manaPower: Math.max(1, base.manaPower + bonusStats.manaPower),
    },
  };
};

export const calculateCharacter = (
  classId: string,
  equipment: Record<string, Equipment | null>
): {
  attributes: { base: Attributes; bonus: Attributes; total: Attributes };
  derivedStats: { base: DerivedStats; bonus: DerivedStats; total: DerivedStats };
} => {
  const attributes = calculateTotalAttributes(classId, equipment);
  const derivedStats = calculateTotalDerivedStats(classId, attributes.total, equipment);

  return { attributes, derivedStats };
};