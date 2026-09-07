import React from 'react';
import type { Deity } from '../../types/deity.types';
import {
  DeityCard as StyledCard,
  DeityImageWrapper,
  DeityImage,
  DeityImageFallback,
  DeityCardInfo,
  DeityName,
  DeityDomainsPreview,
  DeityDomainPreview,
  RecommendedBadge,
  SelectBadge,
} from '../../styles/deitySelectStyles';

interface DeityCardProps {
  deity: Deity;
  isSelected: boolean;
  isRecommended: boolean;
  hasImageError: boolean;
  onSelect: (id: string) => void;
  onImageError: (id: string) => void;
}

export const DeityCard: React.FC<DeityCardProps> = ({
  deity,
  isSelected,
  isRecommended,
  hasImageError,
  onSelect,
  onImageError,
}) => {
  const isImage =
    typeof deity.icon === 'string' &&
    (deity.icon.startsWith('/') || deity.icon.startsWith('http'));

  return (
    <StyledCard
      type="button"
      selected={isSelected}
      color={deity.color}
      $recommended={isRecommended}
      onClick={() => onSelect(deity.id)}
    >
      <DeityImageWrapper>
        {!hasImageError && isImage ? (
          <DeityImage
            src={deity.icon}
            alt={deity.name}
            loading="lazy"
            onError={() => onImageError(deity.id)}
          />
        ) : (
          // Exibe o emoji ou o nome se for erro
          <DeityImageFallback style={{ fontSize: '3rem' }}>
            {deity.icon || deity.name.charAt(0)}
          </DeityImageFallback>
        )}

        {isRecommended && <RecommendedBadge>Recomendada</RecommendedBadge>}
        {isSelected && <SelectBadge color={deity.color}>✓</SelectBadge>}
      </DeityImageWrapper>

      <DeityCardInfo>
        <DeityName>{deity.name}</DeityName>
        <DeityDomainsPreview>
          {deity.domain.slice(0, 2).map((domain) => (
            <DeityDomainPreview key={domain} color={deity.color}>
              {domain}
            </DeityDomainPreview>
          ))}
        </DeityDomainsPreview>
      </DeityCardInfo>
    </StyledCard>
  );
};
