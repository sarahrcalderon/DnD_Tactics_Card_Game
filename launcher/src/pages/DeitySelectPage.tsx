import React, {
  useCallback,
  useState,
  useRef,
  useEffect,
  useMemo,
} from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useDeitySelection } from '../hooks/useDeitySelection';
import { useDeityNavigation } from '../hooks/useDeityNavigation';
import { DEITY_FULL_DATA } from '../data/deitiesModalData';
import { DeityFilterBar } from '../components/deities/DeityFilterBar';
import { DeityGrid } from '../components/deities/DeityGrid';
import { DeityPreview } from '../components/deities/DeityPreview';
import { DeityModal } from '../components/deities/DeityModal';
import { DeityActions } from '../components/deities/DeityActions';
import {
  Container,
  Header,
  Title,
  Subtitle,
  ClassInfo,
  ClassInfoText,
  RaceInfo,
  DeityCount,
  SelectionLayout,
  DeityBrowser,
  ModalDomain,
  DomainTag,
  ScrollDescription,
  ModalAbilities,
  AbilityItem,
  AbilityHeader,
  AbilityIcon,
  AbilityName,
  AbilityDescription,
  MatchupContainer,
  MatchupColumn,
  MatchupLabel,
  MatchupItem,
  ModalButton,
} from '../styles/deitySelectStyles';

const getDeityImage = (deityId: string) =>
  `/assets/images/deities/${deityId === 'ilmater' ? 'Ilmater' : deityId}.svg`;

export const DeitySelectPage: React.FC = () => {
  const navigate = useNavigate();

  const {
    classId,
    raceId,
    raceName,
    raceImage,
    raceIcon,
    className,
    handleBack,
  } = useDeityNavigation();

  const {
    selectedDeity,
    deities,
    activeFilter,
    selectedDeityData,
    filteredDeities,
    recommendedDeityIds,
    handleSelect,
    setActiveFilter,
  } = useDeitySelection(classId);

  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [selectedDeityForModal, setSelectedDeityForModal] = useState<any>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const confirmTimeoutRef = useRef<number | null>(null);

  const handleImageError = useCallback((deityId: string) => {
    setImageErrors((prev) => ({ ...prev, [deityId]: true }));
  }, []);

  const selectedDeityFullData = useMemo(() => {
    if (!selectedDeityData) return null;
    const extended = DEITY_FULL_DATA[selectedDeityData.id];
    return {
      ...selectedDeityData,
      ...extended,
      image: getDeityImage(selectedDeityData.id),
    };
  }, [selectedDeityData]);

  const handleOpenModal = useCallback(
    (deityId: string) => {
      const base = deities.find((d) => d.id === deityId);
      if (!base) return;
      const extended = DEITY_FULL_DATA[deityId];
      setSelectedDeityForModal({
        ...base,
        ...extended,
        image: getDeityImage(base.id),
      });
    },
    [deities],
  );

  const handleCloseModal = useCallback(() => {
    setSelectedDeityForModal(null);
  }, []);

  const openConfirmation = useCallback(() => {
    if (!selectedDeityData) return;
    setIsConfirming(true);
  }, [selectedDeityData]);

  const cancelConfirmation = useCallback(() => {
    setIsConfirming(false);
    if (confirmTimeoutRef.current) {
      clearTimeout(confirmTimeoutRef.current);
      confirmTimeoutRef.current = null;
    }
  }, []);

  const handleFinalConfirmation = useCallback(() => {
    if (!selectedDeityData) return;
    if (confirmTimeoutRef.current) clearTimeout(confirmTimeoutRef.current);

    const toastId = toast.loading(
      `Recebendo a bênção de ${selectedDeityData.name}...`,
    );

    confirmTimeoutRef.current = window.setTimeout(() => {
      try {
        toast.success(`${selectedDeityData.name} foi escolhida!`, {
          id: toastId,
        });
        setIsConfirming(false);
        navigate('/deck-select', {
          state: {
            classId,
            raceId,
            raceName,
            raceImage,
            raceIcon,
            deityId: selectedDeityData.id,
            deityName: selectedDeityData.name,
          },
        });
      } catch (error) {
        toast.error('Erro ao escolher divindade. Tente novamente.', {
          id: toastId,
        });
        setIsConfirming(false);
      } finally {
        confirmTimeoutRef.current = null;
      }
    }, 800);
  }, [
    selectedDeityData,
    navigate,
    classId,
    raceId,
    raceName,
    raceImage,
    raceIcon,
  ]);

  useEffect(() => {
    return () => {
      if (confirmTimeoutRef.current) clearTimeout(confirmTimeoutRef.current);
    };
  }, []);

  const handleConfirm = useCallback(() => {
    if (!selectedDeityData) return;
    openConfirmation();
  }, [selectedDeityData, openConfirmation]);

  return (
    <>
      <Container>
        <Header>
          <Title>Escolha sua Divindade</Title>
          <Subtitle>
            Sua divindade concederá bênçãos, vantagens e características que
            influenciarão seu estilo de jogo.
          </Subtitle>
          <ClassInfo>
            <ClassInfoText>Classe: {className}</ClassInfoText>
            {raceName && <RaceInfo>Raça: {raceName}</RaceInfo>}
          </ClassInfo>
          <DeityCount>{deities.length} divindades disponíveis</DeityCount>
        </Header>

        <SelectionLayout>
          <DeityBrowser>
            <DeityFilterBar
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />
            <DeityGrid
              deities={filteredDeities}
              selectedDeityId={selectedDeity}
              recommendedIds={recommendedDeityIds}
              imageErrors={imageErrors}
              onSelect={handleSelect}
              onImageError={handleImageError}
              activeFilter={activeFilter}
            />
          </DeityBrowser>

          <DeityPreview
            deity={selectedDeityFullData}
            selectedDeityId={selectedDeity}
            onSelect={handleSelect}
            onOpenModal={handleOpenModal}
            onImageError={handleImageError}
            imageErrors={imageErrors}
          />
        </SelectionLayout>
      </Container>

      <DeityActions
        onBack={handleBack}
        selectedDeity={selectedDeityData}
        onConfirm={handleConfirm}
      />

      {/* Modal de Lore com descrição completa */}
      <DeityModal
        isOpen={!!selectedDeityForModal}
        onClose={handleCloseModal}
        title={selectedDeityForModal?.name || ''}
        subtitle="Conhecimento dos Reinos"
        footerButtons={
          <>
            <ModalButton type="button" onClick={handleCloseModal}>
              Fechar
            </ModalButton>
            <ModalButton
              type="button"
              $primary
              color={selectedDeityForModal?.color}
              onClick={() => {
                if (selectedDeityForModal) {
                  handleSelect(selectedDeityForModal.id);
                  handleCloseModal();
                }
              }}
            >
              {selectedDeityForModal
                ? `Escolher ${selectedDeityForModal.name}`
                : ''}
            </ModalButton>
          </>
        }
      >
        {selectedDeityForModal && (
          <>
            <ModalDomain>
              {selectedDeityForModal.domain.map((domain: string) => (
                <DomainTag key={domain} color={selectedDeityForModal.color}>
                  {domain}
                </DomainTag>
              ))}
            </ModalDomain>
            {/* DESCRIÇÃO DETALHADA */}
            <ScrollDescription>
              {selectedDeityForModal.description}
            </ScrollDescription>
            <ModalAbilities>
              <AbilityItem type="advantage" color={selectedDeityForModal.color}>
                <AbilityHeader>
                  <AbilityIcon type="advantage">✦</AbilityIcon>
                  <AbilityName type="advantage">
                    {selectedDeityForModal.generalAdvantage?.name || 'Vantagem'}
                  </AbilityName>
                </AbilityHeader>
                <AbilityDescription>
                  {selectedDeityForModal.generalAdvantage?.description || ''}
                </AbilityDescription>
              </AbilityItem>
              <AbilityItem type="enemy" color={selectedDeityForModal.color}>
                <AbilityHeader>
                  <AbilityIcon type="enemy">⚔</AbilityIcon>
                  <AbilityName type="enemy">
                    {selectedDeityForModal.enemyAdvantage?.name ||
                      'Vantagem contra inimigos'}
                  </AbilityName>
                </AbilityHeader>
                <AbilityDescription>
                  {selectedDeityForModal.enemyAdvantage?.description || ''}
                </AbilityDescription>
              </AbilityItem>
              <AbilityItem
                type="disadvantage"
                color={selectedDeityForModal.color}
              >
                <AbilityHeader>
                  <AbilityIcon type="disadvantage">◈</AbilityIcon>
                  <AbilityName type="disadvantage">
                    {selectedDeityForModal.disadvantage?.name || 'Desvantagem'}
                  </AbilityName>
                </AbilityHeader>
                <AbilityDescription>
                  {selectedDeityForModal.disadvantage?.description || ''}
                </AbilityDescription>
              </AbilityItem>
            </ModalAbilities>
            <MatchupContainer>
              <MatchupColumn type="strong">
                <MatchupLabel type="strong">Forte contra</MatchupLabel>
                {selectedDeityForModal.strongAgainst?.map((target: string) => (
                  <MatchupItem key={target}>{target}</MatchupItem>
                ))}
              </MatchupColumn>
              <MatchupColumn type="weak">
                <MatchupLabel type="weak">Fraco contra</MatchupLabel>
                {selectedDeityForModal.weakAgainst?.map((target: string) => (
                  <MatchupItem key={target}>{target}</MatchupItem>
                ))}
              </MatchupColumn>
            </MatchupContainer>
          </>
        )}
      </DeityModal>

      <DeityModal
        isOpen={isConfirming}
        onClose={cancelConfirmation}
        title="Confirmar Divindade"
        subtitle={`Deseja receber a bênção de ${selectedDeityData?.name || ''}?`}
        footerButtons={
          <>
            <ModalButton type="button" onClick={cancelConfirmation}>
              Cancelar
            </ModalButton>
            <ModalButton
              type="button"
              $primary
              color={selectedDeityData?.color}
              onClick={handleFinalConfirmation}
            >
              Confirmar
            </ModalButton>
          </>
        }
      >
        <ScrollDescription>
          Esta escolha definirá as bênçãos e afinidades da sua personagem.
        </ScrollDescription>
      </DeityModal>
    </>
  );
};

export default DeitySelectPage;
