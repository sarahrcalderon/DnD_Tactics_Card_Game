import { Attributes, DerivedStats } from '../types/character.types';
import { CLASS_BASE_ATTRIBUTES } from '../data/classes';

const getModifier = (value: number): number => {
  return Math.floor((value - 10) / 2);
};

const MAGIC_CLASSES = new Set(['mago', 'bruxo', 'clerigo']);

export const calculateDerivedStats = (
  attributes: Attributes,
  classId = 'paladino',
): DerivedStats => {
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
  const classBaseAttributes =
    CLASS_BASE_ATTRIBUTES[classId] || CLASS_BASE_ATTRIBUTES.paladino;
  const baseMaxHP = MAGIC_CLASSES.has(classId) ? 15 : 20;
  const maxHP =
    baseMaxHP + Math.max(0, attributes.con - classBaseAttributes.con) * 2;
  const baseSpeed = 9 + Math.floor(dexMod / 2);
  const baseMaxMana = MAGIC_CLASSES.has(classId) ? 15 : 5;

  return {
    defense: baseDefense,
    awareness: baseAwareness,
    critical: baseCritical,
    avoidance: baseAvoidance,
    deflect: baseDeflect,
    actionPoints: baseActionPoints,
    criticalSeverity: baseCriticalSeverity,
    initiative: baseInitiative,
    maxHP,
    speed: baseSpeed,
    maxMana: baseMaxMana + Math.max(0, intMod) * 2,
    manaRegen: Math.max(0, 1 + Math.floor(wisMod / 2)),
    manaPower: Math.max(1, 5 + chaMod),
  };
};

export const getModifierDisplay = (value: number): string => {
  const mod = getModifier(value);
  return mod >= 0 ? `+${mod}` : `${mod}`;
};

export const getAttributeModifier = getModifier;