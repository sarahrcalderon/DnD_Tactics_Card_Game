import React from 'react';
import {
  ModalOverlay,
  ModalContent,
  ScrollContainer,
  ScrollHeader,
  ScrollTitle,
  ScrollSubtitle,
  ScrollBody,
  ScrollFooter,
  ModalButton,
} from '../../styles/deitySelectStyles';

interface DeityModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footerButtons?: React.ReactNode;
}

export const DeityModal: React.FC<DeityModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footerButtons,
}) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ScrollContainer>
          <ScrollHeader>
            <ScrollTitle>{title}</ScrollTitle>
            {subtitle && <ScrollSubtitle>{subtitle}</ScrollSubtitle>}
          </ScrollHeader>

          <ScrollBody>{children}</ScrollBody>

          <ScrollFooter>
            {footerButtons || (
              <ModalButton type="button" onClick={onClose}>
                Fechar
              </ModalButton>
            )}
          </ScrollFooter>
        </ScrollContainer>
      </ModalContent>
    </ModalOverlay>
  );
};
