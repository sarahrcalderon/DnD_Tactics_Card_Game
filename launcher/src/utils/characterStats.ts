import { Attributes, DerivedStats } from '../types/character.types';

const getModifier = (value: number): number => {
  return Math.floor((value - 10) / 2);
};

export const calculateDerivedStats = (attributes: Attributes): DerivedStats => {
  const strMod = getModifier(attributes.str);
  const dexMod = getModifier(attributes.dex);
  const conMod = getModifier(attributes.con);
  const intMod = getModifier(attributes.int);
  const wisMod = getModifier(attributes.wis);
  const chaMod = getModifier(attributes.cha);

  const baseDefense = 10 + dexMod;
  const baseAwareness = 10 + wisMod;
  const baseCritical = 5 + Math.floor(dexMod / 2);
  const baseAvoidance = 5 + dexMod;
  const baseDeflect = 5 + strMod;
  const baseActionPoints = 3 + Math.floor(chaMod / 2);
  const baseCriticalSeverity = 150 + (strMod * 5);
  const baseInitiative = dexMod;
  const baseMaxHP = 10 + (conMod * 5) + (attributes.con > 14 ? 5 : 0);
  const baseSpeed = 9 + Math.floor(dexMod / 2);

  return {
    defense: baseDefense,
    awareness: baseAwareness,
    critical: baseCritical,
    avoidance: baseAvoidance,
    deflect: baseDeflect,
    actionPoints: baseActionPoints,
    criticalSeverity: baseCriticalSeverity,
    initiative: baseInitiative,
    maxHP: baseMaxHP,
    speed: baseSpeed,
  };
};

export const getModifierDisplay = (value: number): string => {
  const mod = getModifier(value);
  return mod >= 0 ? `+${mod}` : `${mod}`;
};

export const getAttributeModifier = getModifier;