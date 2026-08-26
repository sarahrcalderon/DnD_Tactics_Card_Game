// NameSelectPage.tsx
import { useState, useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { NameSelectState } from '../types/nameSelect.types';
import {
  Container,
  BackgroundImage,
  ContentWrapper,
  Header,
  Title,
  Subtitle,
  InfoCard,
  InfoItem,
  InfoLabel,
  InfoValue,
  InfoValueLight,
  FormContainer,
  InputGroup,
  Label,
  Input,
  CharacterPreview,
  PreviewImage,
  PreviewPlaceholder,
  CharacterName,
  CharacterInfo,
  Actions,
  BackButton,
  ConfirmButton,
  ErrorText,
  LoadingText,
  NameCounter,
} from '../styles/characterNameStyles';

const getRouteState = (state: unknown): NameSelectState =>
  (state ?? {}) as NameSelectState;

const formatClassName = (classId: string | undefined): string => {
  if (!classId) return '';
  return classId.charAt(0).toUpperCase() + classId.slice(1);
};

export const NameSelectPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const routeState = getRouteState(location.state);

  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const classId = routeState.classId ?? null;
  const raceName = routeState.raceName ?? '';
  const raceImage = routeState.raceImage ?? '';
  const raceIcon = routeState.raceIcon ?? '';
  const deityName = routeState.deityName ?? '';
  const deckName = routeState.deckName ?? '';

  useEffect(() => {
    if (!classId) {
      navigate('/class-select', { replace: true });
      return;
    }

    if (!routeState.deityId) {
      toast.error('Nenhuma divindade selecionada');
      navigate('/deity-select', { replace: true });
      return;
    }

    if (!routeState.deckId) {
      toast.error('Nenhum deck selecionado');
      navigate('/deck-select', { replace: true });
      return;
    }
  }, [classId, navigate, routeState.deityId, routeState.deckId]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 20) {
      setName(value);
      setError('');
    }
  };

  const handleConfirm = useCallback(() => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      setError('Por favor, digite o nome do seu personagem.');
      return;
    }

    if (trimmedName.length < 2) {
      setError('O nome deve ter pelo menos 2 caracteres.');
      return;
    }

    setLoading(true);

    const toastId = toast.loading(`Criando ${trimmedName}...`);

    window.setTimeout(() => {
      toast.success(`${trimmedName} foi criado!`, { id: toastId });

      navigate('/attribute-dist', {
        state: {
          classId,
          raceName,
          raceImage,
          raceIcon,
          deityId: routeState.deityId,
          deityName,
          deckId: routeState.deckId,
          deckName,
          characterName: trimmedName,
        },
      });

      setLoading(false);
    }, 800);
  }, [
    name,
    classId,
    raceName,
    raceImage,
    raceIcon,
    deityName,
    routeState.deityId,
    routeState.deckId,
    deckName,
    navigate,
  ]);

  const handleBack = useCallback(() => {
    navigate('/deck-select', {
      state: {
        classId,
        raceName,
        raceImage,
        raceIcon,
        deityId: routeState.deityId,
        deityName,
      },
    });
  }, [
    classId,
    raceName,
    raceImage,
    raceIcon,
    routeState.deityId,
    deityName,
    navigate,
  ]);

  if (loading) {
    return (
      <Container>
        <BackgroundImage />
        <LoadingText>Criando seu personagem...</LoadingText>
      </Container>
    );
  }

  const className = formatClassName(classId || '');
  const hasImage = raceImage && raceImage.length > 0;
  const isNameValid = name.trim().length >= 2 && name.trim().length <= 20;
  const characterNameDisplay = name.trim() || '???';

  return (
    <Container>
      <BackgroundImage />

      <ContentWrapper>
        <Header>
          <Title>Nome do Personagem</Title>
          <Subtitle>
            Escolha um nome para o seu herói. Ele será lembrado nas lendas!
          </Subtitle>
        </Header>

        <CharacterPreview>
          {hasImage ? (
            <PreviewImage src={raceImage} alt={raceName} />
          ) : (
            <PreviewPlaceholder>{raceIcon || '🧙'}</PreviewPlaceholder>
          )}
        </CharacterPreview>

        <CharacterName>{characterNameDisplay}</CharacterName>
        <CharacterInfo>
          {className} {raceName} • {deityName} • {deckName}
        </CharacterInfo>

        <InfoCard>
          <InfoItem>
            <InfoLabel>Classe</InfoLabel>
            <InfoValue>{className}</InfoValue>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Raça</InfoLabel>
            <InfoValueLight>{raceName}</InfoValueLight>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Divindade</InfoLabel>
            <InfoValueLight>{deityName}</InfoValueLight>
          </InfoItem>
          <InfoItem>
            <InfoLabel>Deck</InfoLabel>
            <InfoValueLight>{deckName}</InfoValueLight>
          </InfoItem>
        </InfoCard>

        <FormContainer>
          <InputGroup>
            <Label htmlFor="character-name">Nome do Personagem</Label>
            <Input
              id="character-name"
              type="text"
              placeholder="Digite o nome do seu herói..."
              value={name}
              onChange={handleNameChange}
              maxLength={20}
              autoFocus
            />
            <NameCounter isLimit={name.length >= 20}>
              {name.length}/20 caracteres
            </NameCounter>
            {error && <ErrorText>{error}</ErrorText>}
          </InputGroup>
        </FormContainer>

        <Actions>
          <BackButton type="button" onClick={handleBack}>
            Voltar
          </BackButton>

          <ConfirmButton
            type="button"
            disabled={!isNameValid}
            onClick={handleConfirm}
          >
            Criar Personagem
          </ConfirmButton>
        </Actions>
      </ContentWrapper>
    </Container>
  );
};

export default NameSelectPage;
