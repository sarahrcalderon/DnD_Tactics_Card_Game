export interface TutorialItem {
  title: string;
  description: string;
  formula: string;
}

export const TUTORIAL_DATA: TutorialItem[] = [
  {
    title: 'Defesa',
    description:
      'Sua capacidade de evitar dano físico. Quanto maior, menos dano você recebe.',
    formula: '10 + Modificador de DEX',
  },
  {
    title: 'Awareness',
    description:
      'Sua percepção do campo de batalha. Afeta a ordem de ação e detecção de armadilhas.',
    formula: '10 + Modificador de WIS',
  },
  {
    title: 'Crítico',
    description:
      'Chance de causar dano crítico. Um acerto crítico dobra o dano base.',
    formula: '5% + DEX/2',
  },
  {
    title: 'Avoidance',
    description:
      'Sua agilidade para desviar de ataques. Reduz a chance de ser atingido.',
    formula: '5% + DEX',
  },
  {
    title: 'Deflect',
    description:
      'Sua habilidade de desviar ou bloquear ataques com força bruta.',
    formula: '5% + STR',
  },
  {
    title: 'Action Points',
    description:
      'Pontos de ação disponíveis por turno. Use para habilidades especiais e magias.',
    formula: '3 + CHA/2',
  },
  {
    title: 'Severidade Crítico',
    description:
      'Multiplicador de dano crítico. Quanto maior, mais dano causa.',
    formula: '150% + STR*5',
  },
  {
    title: 'Iniciativa',
    description:
      'Sua velocidade de reação. Define quem age primeiro no combate.',
    formula: 'Modificador de DEX',
  },
  {
    title: 'HP Máximo',
    description:
      'Seus pontos de vida máximos. Se chegar a 0, você fica inconsciente.',
    formula: '10 + CON*5',
  },
  {
    title: 'Velocidade',
    description: 'Sua velocidade de movimento por turno em metros.',
    formula: '9m + DEX/2',
  },
];