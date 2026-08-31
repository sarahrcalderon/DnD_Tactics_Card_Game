import React from 'react';
import {
  TutorialModal,
  TutorialContent,
  TutorialTitle,
  TutorialSubtitle,
  TutorialGrid,
  TutorialItem,
  TutorialItemTitle,
  TutorialItemDesc,
  TutorialItemFormula,
  TutorialCloseButton,
} from '../../styles/attributeDistStyles';
import { TUTORIAL_DATA } from '../../data/attributeTutorial';

interface AttributeTutorialProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AttributeTutorial: React.FC<AttributeTutorialProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <TutorialModal onClick={onClose}>
      <TutorialContent onClick={(e) => e.stopPropagation()}>
        <TutorialTitle>Guia de Atributos</TutorialTitle>
        <TutorialSubtitle>
          Entenda como cada atributo afeta seu personagem
        </TutorialSubtitle>

        <TutorialGrid>
          {TUTORIAL_DATA.map((item) => (
            <TutorialItem key={item.title}>
              <TutorialItemTitle>{item.title}</TutorialItemTitle>
              <TutorialItemDesc>{item.description}</TutorialItemDesc>
              <TutorialItemFormula>{item.formula}</TutorialItemFormula>
            </TutorialItem>
          ))}
        </TutorialGrid>

        <TutorialCloseButton onClick={onClose}>Entendi!</TutorialCloseButton>
      </TutorialContent>
    </TutorialModal>
  );
};
