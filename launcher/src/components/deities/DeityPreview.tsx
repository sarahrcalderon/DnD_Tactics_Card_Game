import React from 'react';
import { Deity } from '../../types/deity.types';
import {
  PreviewAccent,
  PreviewContent,
  PreviewEmpty,
  PreviewEmptyTitle,
  PreviewEmptyText,
  DeityPreviewPanel,
  PreviewHero,
  PreviewImageContainer,
  PreviewImage,
  PreviewTitle,
  PreviewSubtitle,
  PreviewDomains,
  PreviewDomainTag,
  PreviewDescription,
  PreviewSection,
  PreviewSectionTitle,
  GameplayAbility,
  GameplayAbilityTitle,
  GameplayAbilityDescription,
  PreviewMatchups,
  PreviewMatchupColumn,
  PreviewMatchupLabel,
  PreviewMatchupItem,
  PreviewActions,
  LoreButton,
  PreviewSelectButton,
} from '../../styles/deitySelectStyles';

interface DeityPreviewProps {
  deity: (Deity & { image?: string }) | null;
  selectedDeityId: string | null;
  onSelect: (id: string) => void;
  onOpenModal: (id: string) => void;
  onImageError: (id: string) => void;
  imageErrors: Record<string, boolean>;
}

export const DeityPreview: React.FC<DeityPreviewProps> = ({
  deity,
  selectedDeityId,
  onSelect,
  onOpenModal,
  onImageError,
  imageErrors,
}) => {
  if (!deity) {
    return (
      <DeityPreviewPanel>
        <PreviewEmpty>
          <PreviewEmptyTitle>Escolha uma Divindade</PreviewEmptyTitle>
          <PreviewEmptyText>
            Selecione uma divindade para visualizar suas bênçãos, vantagens e
            afinidades.
          </PreviewEmptyText>
        </PreviewEmpty>
      </DeityPreviewPanel>
    );
  }

  const hasError = imageErrors[deity.id] || false;
  const isSelected = selectedDeityId === deity.id;
  const imageSrc = deity.image || deity.icon;

  return (
    <DeityPreviewPanel>
      <PreviewAccent color={deity.color} />
      <PreviewContent>
        <PreviewHero>
          <PreviewImageContainer color={deity.color}>
            {!hasError && imageSrc && (
              <PreviewImage
                src={imageSrc}
                alt={deity.name}
                onError={() => onImageError(deity.id)}
              />
            )}
          </PreviewImageContainer>
          <PreviewTitle color={deity.color}>{deity.name}</PreviewTitle>
          <PreviewSubtitle>Divindade dos Reinos</PreviewSubtitle>
        </PreviewHero>

        <PreviewDomains>
          {deity.domain.map((domain) => (
            <PreviewDomainTag key={domain} color={deity.color}>
              {domain}
            </PreviewDomainTag>
          ))}
        </PreviewDomains>
        {deity.description && (
          <PreviewDescription>{deity.description}</PreviewDescription>
        )}

        <PreviewSection>
          <PreviewSectionTitle>Bênçãos Divinas</PreviewSectionTitle>
          {deity.generalAdvantage && deity.generalAdvantage.name && (
            <GameplayAbility type="advantage">
              <GameplayAbilityTitle type="advantage">
                Vantagem
              </GameplayAbilityTitle>
              <GameplayAbilityDescription>
                <strong>{deity.generalAdvantage.name}</strong>
                {' — '}
                {deity.generalAdvantage.description}
              </GameplayAbilityDescription>
            </GameplayAbility>
          )}
          {deity.enemyAdvantage && deity.enemyAdvantage.name && (
            <GameplayAbility type="enemy">
              <GameplayAbilityTitle type="enemy">
                Vantagem contra inimigos
              </GameplayAbilityTitle>
              <GameplayAbilityDescription>
                <strong>{deity.enemyAdvantage.name}</strong>
                {' — '}
                {deity.enemyAdvantage.description}
              </GameplayAbilityDescription>
            </GameplayAbility>
          )}
          {deity.disadvantage && deity.disadvantage.name && (
            <GameplayAbility type="disadvantage">
              <GameplayAbilityTitle type="disadvantage">
                Desvantagem
              </GameplayAbilityTitle>
              <GameplayAbilityDescription>
                <strong>{deity.disadvantage.name}</strong>
                {' — '}
                {deity.disadvantage.description}
              </GameplayAbilityDescription>
            </GameplayAbility>
          )}
        </PreviewSection>

        <PreviewSection>
          <PreviewSectionTitle>Afinidades</PreviewSectionTitle>
          <PreviewMatchups>
            <PreviewMatchupColumn type="strong">
              <PreviewMatchupLabel type="strong">
                Forte contra
              </PreviewMatchupLabel>
              {deity.strongAgainst?.slice(0, 4).map((target) => (
                <PreviewMatchupItem key={target}>{target}</PreviewMatchupItem>
              ))}
            </PreviewMatchupColumn>
            <PreviewMatchupColumn type="weak">
              <PreviewMatchupLabel type="weak">
                Fraco contra
              </PreviewMatchupLabel>
              {deity.weakAgainst?.slice(0, 4).map((target) => (
                <PreviewMatchupItem key={target}>{target}</PreviewMatchupItem>
              ))}
            </PreviewMatchupColumn>
          </PreviewMatchups>
        </PreviewSection>

        <PreviewActions>
          <LoreButton type="button" onClick={() => onOpenModal(deity.id)}>
            Conhecer a História
          </LoreButton>
          <PreviewSelectButton
            type="button"
            color={deity.color}
            onClick={() => onSelect(deity.id)}
          >
            {isSelected
              ? `${deity.name} Selecionada`
              : `Escolher ${deity.name}`}
          </PreviewSelectButton>
        </PreviewActions>
      </PreviewContent>
    </DeityPreviewPanel>
  );
};
