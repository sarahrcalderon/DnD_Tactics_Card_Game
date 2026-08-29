import { RaceDefinition } from '../types/character.types';

export const RACE_DEFINITIONS: Record<string, RaceDefinition> = {
  // Exemplo de estrutura:
  //
  // anao: {
  //   id: 'anao',
  //   name: 'Anão',
  //
  //   attributeBonuses: {
  //     str: 2,
  //     wis: 1,
  //   },
  //
  //   statBonuses: {
  //     hp: 10,
  //     deflect: 2,
  //   },
  // },

  default: {
    id: 'default',
    name: 'Raça',

    attributeBonuses: {},
    statBonuses: {},
  },
};