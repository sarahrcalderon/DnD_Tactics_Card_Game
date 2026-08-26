import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ClassData } from '../types/classSelect.types';

import {
  Container,
  Header,
  Title,
  Subtitle,
  ScrollableContent,
  Grid,
  Card,
  CardImageWrapper,
  CardImage,
  CardContent,
  CardName,
  CardDescription,
  AttributesContainer,
  AttributeItem,
  AttributeLabel,
  AttributeValue,
  TagsContainer,
  Tag,
  SelectBadge,
  Actions,
  BackButton,
  ConfirmButton,
  LoadingText,
  ScrollHint,
  ContentWrapper,
  BackgroundImage,
} from '../styles/classSelectStyles';

const CLASSES_DATA: ClassData[] = [
  {
    id: 'paladino',
    name: 'Paladino',
    icon: '',
    image: '/assets/images/classes/simboloPaladin.png',
    color: '#ffd700',
    description: 'Guerreiro sagrado que protege os fracos com fe e espada.',
    attributes: { cha: 14, win: 10, for: 16, dex: 10, int: 10 },
    pros: ['Alta defesa', 'Cura', 'Auras protetoras', 'Dano divino'],
    cons: ['Depende de fe', 'Codigo de honra'],
  },
  {
    id: 'clerigo',
    name: 'Clerigo',
    icon: '',
    image: '/assets/images/classes/simboloCleric.png',
    color: '#f5f5ff',
    description: 'Servo divino com poderes de cura, protecao e destruicao.',
    attributes: { cha: 12, win: 16, for: 12, dex: 10, int: 12 },
    pros: ['Melhor cura', 'Buffs poderosos', 'Versatil'],
    cons: ['Depende da divindade', 'Mana limitada'],
  },
  {
    id: 'bruxo',
    name: 'Bruxo',
    icon: '',
    image: '/assets/images/classes/simboloWarlock.png',
    color: '#aa46be',
    description: 'Mistico que obtem poderes atraves de pactos sobrenaturais.',
    attributes: { cha: 18, win: 10, for: 10, dex: 12, int: 14 },
    pros: ['Magia consistente', 'Invocacoes', 'Carisma'],
    cons: ['Pacto limitado', 'Depende do patrono'],
  },
  {
    id: 'barbaro',
    name: 'Barbaro',
    icon: '',
    image: '/assets/images/classes/simboloBarbarian.png',
    color: '#be5a23',
    description: 'Guerreiro feroz que vive para a batalha e para a furia.',
    attributes: { cha: 10, win: 10, for: 18, dex: 14, int: 8 },
    pros: ['Dano brutal', 'Resistencia', 'Furia poderosa'],
    cons: ['Pouca defesa magica', 'Impulsivo'],
  },
  {
    id: 'mago',
    name: 'Mago',
    icon: '',
    image: '/assets/images/classes/simboloWizard.png',
    color: '#4691ff',
    description: 'Dominador das artes arcanas e das forcas magicas.',
    attributes: { cha: 12, win: 12, for: 8, dex: 12, int: 18 },
    pros: ['Dano magico', 'Controle', 'Utilidade'],
    cons: ['Fragilidade', 'Mana limitada'],
  },
  {
    id: 'ladino',
    name: 'Ladino',
    icon: '',
    image: '/assets/images/classes/simboloRogue.png',
    color: '#a0a0aa',
    description: 'Mestre das sombras, da furtividade e dos ataques precisos.',
    attributes: { cha: 12, win: 12, for: 10, dex: 18, int: 14 },
    pros: ['Ataque furtivo', 'Pericias', 'Critico alto'],
    cons: ['Baixa defesa', 'Depende de furtividade'],
  },
];

export const ClassSelectPage = () => {
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState<ClassData | null>(null);
  const [loading, setLoading] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState<Record<string, boolean>>({});

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const lastHoveredClass = useRef<string | null>(null);

  useEffect(() => {
    const audio = new Audio('/assets/sounds/som_botao.mp3');
    audio.volume = 0.3;

    audio.addEventListener('canplaythrough', () => {
      setAudioLoaded(true);
    });

    audio.addEventListener('error', () => {});

    audioRef.current = audio;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const playHoverSound = useCallback(() => {
    if (audioRef.current && audioLoaded) {
      try {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      } catch (error) {}
    }
  }, [audioLoaded]);

  useEffect(() => {
    const loadImages = async () => {
      const loaded: Record<string, boolean> = {};

      for (const cls of CLASSES_DATA) {
        try {
          const img = new Image();
          img.src = cls.image;
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            setTimeout(resolve, 3000);
          });
          loaded[cls.id] = true;
        } catch {
          loaded[cls.id] = false;
        }
      }

      setImagesLoaded(loaded);
    };

    loadImages();
  }, []);

  const handleSelect = useCallback((cls: ClassData) => {
    setSelectedClass(cls);
  }, []);

  const handleCardMouseEnter = useCallback(
    (clsId: string) => {
      if (lastHoveredClass.current !== clsId) {
        lastHoveredClass.current = clsId;
        playHoverSound();
      }
    },
    [playHoverSound],
  );

  const handleCardMouseLeave = useCallback(() => {
    lastHoveredClass.current = null;
  }, []);

  const handleConfirm = useCallback(() => {
    if (!selectedClass) return;

    setLoading(true);
    toast.loading(`Selecionando ${selectedClass.name}...`);

    setTimeout(() => {
      toast.success(`${selectedClass.name} selecionado!`);
      setLoading(false);
      navigate('/race-select', { state: { classId: selectedClass.id } });
    }, 800);
  }, [selectedClass, navigate]);

  const handleBack = useCallback(() => {
    navigate('/');
  }, [navigate]);

  if (loading) {
    return (
      <Container>
        <BackgroundImage />
        <LoadingText>Carregando...</LoadingText>
      </Container>
    );
  }

  return (
    <Container>
      <BackgroundImage />

      <ContentWrapper>
        <Header>
          <Title>Escolha sua Classe</Title>
          <Subtitle>
            Selecione o heroi que representara voce nesta aventura
          </Subtitle>
        </Header>

        <ScrollableContent>
          <Grid>
            {CLASSES_DATA.map((cls) => {
              const isSelected = selectedClass?.id === cls.id;
              const isImageLoaded = imagesLoaded[cls.id];

              return (
                <Card
                  key={cls.id}
                  selected={isSelected}
                  color={cls.color}
                  onClick={() => handleSelect(cls)}
                  onMouseEnter={() => handleCardMouseEnter(cls.id)}
                  onMouseLeave={handleCardMouseLeave}
                >
                  {isSelected && (
                    <SelectBadge color={cls.color}>Selecionado</SelectBadge>
                  )}

                  <CardImageWrapper>
                    {isImageLoaded ? (
                      <CardImage src={cls.image} alt={cls.name} />
                    ) : (
                      <span
                        style={{
                          fontSize: 'clamp(2rem, 3vw, 2.5rem)',
                          color: '#fff',
                        }}
                      >
                        {cls.icon}
                      </span>
                    )}
                  </CardImageWrapper>

                  <CardContent>
                    <CardName>{cls.name}</CardName>
                    <CardDescription>{cls.description}</CardDescription>

                    <AttributesContainer>
                      <AttributeItem color={cls.color}>
                        <AttributeLabel>CHA</AttributeLabel>
                        <AttributeValue color={cls.color}>
                          {cls.attributes.cha}
                        </AttributeValue>
                      </AttributeItem>
                      <AttributeItem color={cls.color}>
                        <AttributeLabel>WIN</AttributeLabel>
                        <AttributeValue color={cls.color}>
                          {cls.attributes.win}
                        </AttributeValue>
                      </AttributeItem>
                      <AttributeItem color={cls.color}>
                        <AttributeLabel>FOR</AttributeLabel>
                        <AttributeValue color={cls.color}>
                          {cls.attributes.for}
                        </AttributeValue>
                      </AttributeItem>
                      <AttributeItem color={cls.color}>
                        <AttributeLabel>DEX</AttributeLabel>
                        <AttributeValue color={cls.color}>
                          {cls.attributes.dex}
                        </AttributeValue>
                      </AttributeItem>
                      <AttributeItem color={cls.color}>
                        <AttributeLabel>INT</AttributeLabel>
                        <AttributeValue color={cls.color}>
                          {cls.attributes.int}
                        </AttributeValue>
                      </AttributeItem>
                    </AttributesContainer>

                    <TagsContainer>
                      {cls.pros.slice(0, 2).map((pro) => (
                        <Tag key={pro} color="#4caf50">
                          + {pro}
                        </Tag>
                      ))}
                      {cls.cons.slice(0, 1).map((con) => (
                        <Tag key={con} color="#f44336">
                          - {con}
                        </Tag>
                      ))}
                    </TagsContainer>
                  </CardContent>
                </Card>
              );
            })}
          </Grid>
        </ScrollableContent>

        <ScrollHint>Role para baixo para confirmar sua escolha</ScrollHint>

        <Actions>
          <BackButton onClick={handleBack}>Voltar</BackButton>
          <ConfirmButton disabled={!selectedClass} onClick={handleConfirm}>
            {selectedClass
              ? `Selecionar ${selectedClass.name}`
              : 'Selecione uma classe'}
          </ConfirmButton>
        </Actions>
      </ContentWrapper>
    </Container>
  );
};

export default ClassSelectPage;
