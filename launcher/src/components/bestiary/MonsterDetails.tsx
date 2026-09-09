import { useBestiary } from '../../hooks/useBestiary';

import {
  formatDamage,
  getCategoryLabel,
  getMonsterTier,
} from '../../utils/bestiaryUtils';

import {
  Description,
  DetailImage,
  DetailMeta,
  DetailName,
  DetailPanel,
  DetailSection,
  Entry,
  Placeholder,
  Stat,
  Stats,
} from '../../styles/bestiaryStyles';

export const MonsterDetails = () => {
  const { selectedMonster: monster } = useBestiary();

  if (!monster) {
    return (
      <DetailPanel>
        <Placeholder>
          Selecione uma criatura para consultar suas informações de combate.
        </Placeholder>
      </DetailPanel>
    );
  }

  return (
    <DetailPanel>
      <DetailImage src={monster.image.url} alt={monster.image.alt} />

      <DetailName>{monster.name}</DetailName>

      <DetailMeta>
        {getCategoryLabel(monster.category)} · {monster.dnd.size} ·{' '}
        {getMonsterTier(monster)}
      </DetailMeta>

      <Description>{monster.description}</Description>

      <Stats>
        <Stat>
          <small>VIDA</small>
          <strong>{monster.dnd.hitPoints}</strong>
        </Stat>

        <Stat>
          <small>PODER</small>
          <strong>{monster.card.power}</strong>
        </Stat>

        <Stat>
          <small>MANA</small>
          <strong>{monster.card.manaCost}</strong>
        </Stat>
      </Stats>

      <DetailSection>
        <h3>Traços</h3>

        {monster.dnd.traits.map((trait) => (
          <Entry key={trait.name}>
            <strong>{trait.name}</strong>
            <p>{trait.description}</p>
          </Entry>
        ))}
      </DetailSection>

      <DetailSection>
        <h3>Ações</h3>

        {monster.dnd.actions.map((action) => (
          <Entry key={action.name}>
            <strong>
              {action.name} · {formatDamage(action)}
            </strong>

            <p>{action.description}</p>
          </Entry>
        ))}
      </DetailSection>
    </DetailPanel>
  );
};
