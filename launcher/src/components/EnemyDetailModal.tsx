// src/components/EnemyDetailModal.tsx

import React from 'react';
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ImageContainer,
  EnemyImage,
  EnemyInfo,
  EnemyName,
  EnemyType,
  EnemyRole,
  EnemyDescription,
  EnemyStats,
  StatItem,
  StatLabel,
  StatValue,
  EnemyAbilities,
  AbilityTag,
} from '../styles/enemyDetailModalStyles';

import { EnemyDetail } from '../data/enemyDetails';

interface EnemyDetailModalProps {
  enemy: EnemyDetail | null;
  onClose: () => void;
}

const EnemyDetailModal: React.FC<EnemyDetailModalProps> = ({
  enemy,
  onClose,
}) => {
  if (!enemy) return null;

  const orientation = enemy.orientation || 'vertical';

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent
        $orientation={orientation}
        onClick={(e) => e.stopPropagation()}
      >
        <ModalHeader>
          <h2>{enemy.name}</h2>
          <ModalCloseButton onClick={onClose}>✕</ModalCloseButton>
        </ModalHeader>

        <ModalBody $orientation={orientation}>
          <ImageContainer $orientation={orientation}>
            <EnemyImage src={enemy.image} alt={enemy.name} />
          </ImageContainer>

          <EnemyInfo>
            <EnemyName>{enemy.name}</EnemyName>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <EnemyType>{enemy.type}</EnemyType>
              <EnemyRole>{enemy.role}</EnemyRole>
            </div>

            <EnemyDescription>{enemy.description}</EnemyDescription>

            {enemy.stats && (
              <EnemyStats>
                <StatItem>
                  <StatLabel>HP</StatLabel>
                  <StatValue>{enemy.stats.hp}</StatValue>
                </StatItem>
                <StatItem>
                  <StatLabel>ATK</StatLabel>
                  <StatValue>{enemy.stats.atk}</StatValue>
                </StatItem>
                <StatItem>
                  <StatLabel>DEF</StatLabel>
                  <StatValue>{enemy.stats.def}</StatValue>
                </StatItem>
              </EnemyStats>
            )}

            {enemy.abilities && enemy.abilities.length > 0 && (
              <EnemyAbilities>
                {enemy.abilities.map((ability) => (
                  <AbilityTag key={ability}>{ability}</AbilityTag>
                ))}
              </EnemyAbilities>
            )}
          </EnemyInfo>
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};

export default EnemyDetailModal;
