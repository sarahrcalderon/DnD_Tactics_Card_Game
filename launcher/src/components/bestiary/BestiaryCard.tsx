import type { BestiaryMonster } from '../../types/bestiary.types';

import { getCategoryLabel, getMonsterTier } from '../../utils/bestiaryUtils';

import {
  CardContent,
  CardImage,
  CardMeta,
  CardName,
  MonsterCard,
  TierBadge,
} from '../../styles/bestiaryStyles';

type Props = {
  monster: BestiaryMonster;
  selected: boolean;
  onSelect: (monster: BestiaryMonster) => void;
};

export const BestiaryCard = ({ monster, selected, onSelect }: Props) => (
  <MonsterCard
    type="button"
    $elite={monster.isElite || monster.isBoss}
    $selected={selected}
    onClick={() => onSelect(monster)}
  >
    <CardImage src={monster.image.url} alt={monster.image.alt} />

    <TierBadge $elite={monster.isElite || monster.isBoss}>
      {getMonsterTier(monster)}
    </TierBadge>

    <CardContent>
      <CardName>{monster.name}</CardName>

      <CardMeta>
        {getCategoryLabel(monster.category)} · {monster.role}
      </CardMeta>
    </CardContent>
  </MonsterCard>
);
