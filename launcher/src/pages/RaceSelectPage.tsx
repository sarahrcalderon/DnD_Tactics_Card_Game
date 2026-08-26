import { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Container,
  Header,
  Title,
  Subtitle,
  ClassInfo,
  ClassInfoText,
  RaceCount,
  ContentWrapper,
  CenterWrapper,
  Grid,
  Card,
  CardImageWrapper,
  CardImage,
  CardContent,
  CardName,
  CardBonus,
  CardDescription,
  AttributesContainer,
  AttributeItem,
  AttributeLabel,
  AttributeValue,
  SelectBadge,
  Actions,
  BackButton,
  ConfirmButton,
  LoadingText,
  ScrollHint,
} from '../styles/raceSelectStyles';

const RACE_DATA: Record<string, any[]> = {
  paladino: [
    {
      id: 'DragonBornPaladin',
      name: 'Dragonborn',
      color: '#c86432',
      description: 'Descendentes de dragoes, orgulhosos e poderosos.',
      bonus: 'Forca +2, Carisma +1',
      image: '/assets/images/races/DragonbornPaladin.jfif',
      attributes: { for: 12, des: 10, con: 14, int: 10, sab: 10, car: 12 },
    },
    {
      id: 'HumanPaladinWomen',
      name: 'Humano',
      color: '#c8c8c8',
      description: 'Versateis e adaptaveis, os humanos sao determinados.',
      bonus: 'Todos atributos +1',
      image: '/assets/images/races/HumanPaladinWomen.png',
      attributes: { for: 11, des: 11, con: 11, int: 11, sab: 11, car: 11 },
    },
    {
      id: 'AnaoPaladino',
      name: 'Anao',
      color: '#b49664',
      description: 'Resistentes e leais, mestres da forja e da batalha.',
      bonus: 'Constituicao +2, Forca +2',
      image: '/assets/images/races/AnaoPaladino.png',
      attributes: { for: 12, des: 8, con: 14, int: 10, sab: 10, car: 10 },
    },
    {
      id: 'OrcPaladin',
      name: 'Meio-Orc',
      color: '#649650',
      description: 'Feroses e fortes, combinando forca bruta e determinacao.',
      bonus: 'Forca +3, Constituicao +2',
      image: '/assets/images/races/Orcpaladin.png',
      attributes: { for: 14, des: 8, con: 12, int: 8, sab: 10, car: 10 },
    },
  ],
  clerigo: [
    {
      id: 'AnaoClerigo',
      name: 'Anao',
      color: '#b49664',
      description: 'Anoes devotos, resistentes e com fe inabalavel.',
      bonus: 'Constituicao +2, Sabedoria +1',
      image: '/assets/images/races/AnaoClerigo.png',
      attributes: { for: 10, des: 8, con: 14, int: 10, sab: 12, car: 10 },
    },
  ],
  barbaro: [
    {
      id: 'AnaoBarbaro',
      name: 'Anao',
      color: '#b49664',
      description: 'Anoes guerreiros, resistentes e brutais.',
      bonus: 'Constituicao +2, Forca +2',
      image: '/assets/images/races/AnaoBarbaro.png',
      attributes: { for: 12, des: 8, con: 14, int: 8, sab: 10, car: 10 },
    },
    {
      id: 'DragonbornBarbarian',
      name: 'Dragonborn',
      color: '#c86432',
      description: 'Dragonborn furiosos, com a forca dos dragoes.',
      bonus: 'Forca +2, Constituicao +1',
      image: '/assets/images/races/DragonbornBarbarian.png',
      attributes: { for: 12, des: 10, con: 12, int: 8, sab: 10, car: 12 },
    },
    {
      id: 'OrcBarbarian',
      name: 'Meio-Orc',
      color: '#649650',
      description: 'Meio-Orcs selvagens, movidos pela furia.',
      bonus: 'Forca +3, Constituicao +2',
      image: '/assets/images/races/OrcBarbarian.png',
      attributes: { for: 14, des: 8, con: 12, int: 8, sab: 10, car: 10 },
    },
  ],
  ladino: [
    {
      id: 'HumanRogue',
      name: 'Humano',
      color: '#c8c8c8',
      description: 'Humanos ageis e adaptaveis, perfeitos para o crime.',
      bonus: 'Destreza +1, Carisma +1',
      image: '/assets/images/races/HumanRogue.png',
      attributes: { for: 8, des: 12, con: 10, int: 10, sab: 10, car: 12 },
    },
    {
      id: 'TieflingRogue',
      name: 'Tiefling',
      color: '#c86496',
      description: 'Tieflings astutos e carismaticos, nascidos nas sombras.',
      bonus: 'Carisma +2, Inteligencia +1',
      image: '/assets/images/races/TieflingRogue.png',
      attributes: { for: 8, des: 10, con: 10, int: 12, sab: 10, car: 14 },
    },
    {
      id: 'MeioElfoRogue',
      name: 'Meio-Elfo',
      color: '#96b4c8',
      description: 'Meio-elfos combinam versatilidade e graca elfca.',
      bonus: 'Carisma +2, Destreza +1',
      image: '/assets/images/races/MeioElfoRogue.png',
      attributes: { for: 8, des: 12, con: 10, int: 10, sab: 10, car: 14 },
    },
    {
      id: 'HalflingRogue',
      name: 'Halfling',
      color: '#c8b464',
      description: 'Pequenos, ageis e surpreendentemente sortudos.',
      bonus: 'Destreza +2, Constituicao +1',
      image: '/assets/images/races/HalflingRogue.png',
      attributes: { for: 8, des: 14, con: 12, int: 10, sab: 10, car: 10 },
    },
    {
      id: 'DrowRogue',
      name: 'Drow',
      color: '#9664c8',
      description: 'Elfos subterraneos, mestres das sombras e da escuridao.',
      bonus: 'Destreza +2, Carisma +1',
      image: '/assets/images/races/DrowRogue.png',
      attributes: { for: 8, des: 14, con: 10, int: 10, sab: 10, car: 12 },
    },
    {
      id: 'ElfRogue',
      name: 'Elfo',
      color: '#64c864',
      description: 'Elfos ageis e precisos, mestres da furtividade.',
      bonus: 'Destreza +2, Sabedoria +1',
      image: '/assets/images/races/ElfRogue.png',
      attributes: { for: 8, des: 14, con: 10, int: 10, sab: 12, car: 10 },
    },
  ],
  mago: [
    {
      id: 'GnomoWizard',
      name: 'Gnomo',
      color: '#64c8c8',
      description: 'Gnomos engenhosos, com afinidade magica natural.',
      bonus: 'Inteligencia +2, Sabedoria +1',
      image: '/assets/images/races/GnomoWizard.png',
      attributes: { for: 8, des: 10, con: 10, int: 14, sab: 12, car: 10 },
    },
    {
      id: 'HalflingWizard',
      name: 'Halfling',
      color: '#c8b464',
      description: 'Halflings com sorte e agilidade para a magia.',
      bonus: 'Destreza +2, Constituicao +1',
      image: '/assets/images/races/HalflingWizard.png',
      attributes: { for: 8, des: 14, con: 12, int: 12, sab: 10, car: 10 },
    },
    {
      id: 'HumanWizard',
      name: 'Humano',
      color: '#c8c8c8',
      description: 'Humanos versateis, com grande potencial magico.',
      bonus: 'Inteligencia +1, Carisma +1',
      image: '/assets/images/races/HumanWizard.png',
      attributes: { for: 8, des: 10, con: 10, int: 12, sab: 10, car: 12 },
    },
    {
      id: 'TieflingWizard',
      name: 'Tiefling',
      color: '#c86496',
      description: 'Tieflings com heranca infernal e afinidade magica.',
      bonus: 'Carisma +2, Inteligencia +1',
      image: '/assets/images/races/TieflingWizard.png',
      attributes: { for: 8, des: 10, con: 10, int: 12, sab: 10, car: 14 },
    },
    {
      id: 'DrowWizard',
      name: 'Drow',
      color: '#9664c8',
      description: 'Drows com seculos de estudo arcano nas profundezas.',
      bonus: 'Destreza +2, Carisma +1',
      image: '/assets/images/races/DrowWizard.png',
      attributes: { for: 8, des: 14, con: 10, int: 12, sab: 10, car: 12 },
    },
    {
      id: 'ElfWizard',
      name: 'Elfo',
      color: '#64c864',
      description: 'Elfos com seculos de estudo arcano e sabedoria.',
      bonus: 'Inteligencia +2, Destreza +1',
      image: '/assets/images/races/ElfWizard.png',
      attributes: { for: 8, des: 12, con: 10, int: 14, sab: 10, car: 10 },
    },
    {
      id: 'MeioElfoWizard',
      name: 'Meio-Elfo',
      color: '#96b4c8',
      description: 'Meio-elfos combinam adaptabilidade e heranca elfca.',
      bonus: 'Carisma +2, Destreza +1',
      image: '/assets/images/races/MeioElfoWizard.png',
      attributes: { for: 8, des: 12, con: 10, int: 12, sab: 10, car: 14 },
    },
  ],
  bruxo: [
    {
      id: 'DrowWarlock',
      name: 'Drow',
      color: '#9664c8',
      description: 'Drows com pactos sombrios e poder infernal.',
      bonus: 'Destreza +2, Carisma +1',
      image: '/assets/images/races/DrowWarlock.png',
      attributes: { for: 8, des: 14, con: 10, int: 10, sab: 10, car: 12 },
    },
    {
      id: 'ElfWarlock',
      name: 'Elfo',
      color: '#64c864',
      description: 'Elfos que buscam poder em pactos antigos e sombrios.',
      bonus: 'Destreza +2, Sabedoria +1',
      image: '/assets/images/races/ElfWarlock.png',
      attributes: { for: 8, des: 14, con: 10, int: 10, sab: 12, car: 10 },
    },
    {
      id: 'GnomoWarlock',
      name: 'Gnomo',
      color: '#64c8c8',
      description: 'Gnomos curiosos que fazem pactos por conhecimento.',
      bonus: 'Inteligencia +2, Sabedoria +1',
      image: '/assets/images/races/GnomoWarlock.png',
      attributes: { for: 8, des: 10, con: 10, int: 14, sab: 12, car: 10 },
    },
    {
      id: 'HalflingWarlock',
      name: 'Halfling',
      color: '#c8b464',
      description: 'Halflings que fazem pactos por sorte e poder.',
      bonus: 'Destreza +2, Constituicao +1',
      image: '/assets/images/races/HalflingWarlock.png',
      attributes: { for: 8, des: 14, con: 12, int: 10, sab: 10, car: 10 },
    },
    {
      id: 'HumanWarlock',
      name: 'Humano',
      color: '#c8c8c8',
      description: 'Humanos ambiciosos que buscam poder atraves de pactos.',
      bonus: 'Carisma +1, Inteligencia +1',
      image: '/assets/images/races/HumanWarlock.png',
      attributes: { for: 8, des: 10, con: 10, int: 12, sab: 10, car: 12 },
    },
    {
      id: 'MeioElfoWarlock',
      name: 'Meio-Elfo',
      color: '#96b4c8',
      description: 'Meio-elfos com pactos que combinam heranca elfca e humana.',
      bonus: 'Carisma +2, Destreza +1',
      image: '/assets/images/races/MeioElfoWarlock.png',
      attributes: { for: 8, des: 12, con: 10, int: 10, sab: 10, car: 14 },
    },
    {
      id: 'Tiefling',
      name: 'Tiefling',
      color: '#c86496',
      description: 'Tieflings com pactos sombrios e poder infernal.',
      bonus: 'Carisma +2, Inteligencia +1',
      image: '/assets/images/races/Tiefling.png',
      attributes: { for: 8, des: 10, con: 10, int: 12, sab: 10, car: 14 },
    },
  ],
};

export const RaceSelectPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedRace, setSelectedRace] = useState<any | null>(null);
  const [selectedRaceId, setSelectedRaceId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [classId, setClassId] = useState<string | null>(null);
  const [races, setRaces] = useState<any[]>([]);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const state = location.state as { classId?: string };
    const id = state?.classId;

    if (!id) {
      navigate('/class-select');
      return;
    }

    setClassId(id);

    const classRaces = RACE_DATA[id] || [];
    setRaces(classRaces);

    if (classRaces.length === 0) {
      toast.error('Nenhuma raca disponivel para esta classe.');
    }
  }, [location, navigate]);

  const handleSelect = useCallback((race: any) => {
    setSelectedRace(race);
    setSelectedRaceId(race.id);
  }, []);

  const handleImageError = useCallback((raceId: string) => {
    setImageErrors((prev) => ({ ...prev, [raceId]: true }));
  }, []);

  const handleConfirm = useCallback(() => {
    if (loading || !selectedRace || !classId) {
      return;
    }

    setLoading(true);

    const toastId = toast.loading(`Selecionando ${selectedRace.name}...`);

    setTimeout(() => {
      toast.success(`${selectedRace.name} selecionada!`, {
        id: toastId,
      });
      setLoading(false);

      navigate('/deity-select', {
        state: {
          classId: classId,
          raceId: selectedRace.id,
          raceName: selectedRace.name,
          raceImage: selectedRace.image || '',
          raceIcon: '',
        },
      });
    }, 800);
  }, [loading, selectedRace, classId, navigate]);

  const handleBack = useCallback(() => {
    navigate('/class-select');
  }, [navigate]);

  if (loading) {
    return (
      <Container>
        <LoadingText>Carregando...</LoadingText>
      </Container>
    );
  }

  const className = classId
    ? classId.charAt(0).toUpperCase() + classId.slice(1)
    : '';

  const attributeLabels = {
    for: 'FOR',
    des: 'DES',
    con: 'CON',
    int: 'INT',
    sab: 'SAB',
    car: 'CAR',
  };

  return (
    <Container>
      <Header>
        <Title>Escolha sua Raca</Title>
        <Subtitle>
          Selecione a raca que determinara as caracteristicas do seu personagem
        </Subtitle>
        <ClassInfo>
          <ClassInfoText>Classe: {className}</ClassInfoText>
        </ClassInfo>
        <RaceCount>{races.length} racas disponiveis</RaceCount>
      </Header>

      <ContentWrapper>
        <CenterWrapper>
          <Grid>
            {races.map((race) => {
              const isSelected = selectedRaceId === race.id;
              const hasError = imageErrors[race.id];

              return (
                <Card
                  key={race.id}
                  selected={isSelected}
                  color={race.color}
                  onClick={() => handleSelect(race)}
                >
                  {isSelected && (
                    <SelectBadge color={race.color}>Selecionado</SelectBadge>
                  )}

                  <CardImageWrapper>
                    {!hasError ? (
                      <CardImage
                        src={race.image}
                        alt={race.name}
                        onError={() => handleImageError(race.id)}
                        loading="lazy"
                      />
                    ) : (
                      <div
                        style={{
                          width: '80px',
                          height: '80px',
                          borderRadius: '50%',
                          background: race.color,
                          opacity: 0.3,
                        }}
                      />
                    )}
                  </CardImageWrapper>

                  <CardContent>
                    <CardName>{race.name}</CardName>
                    <CardBonus>{race.bonus}</CardBonus>
                    <CardDescription>{race.description}</CardDescription>

                    <AttributesContainer>
                      {race.attributes &&
                        Object.entries(race.attributes).map(
                          ([key, value]: [string, any]) => (
                            <AttributeItem key={key} color={race.color}>
                              <AttributeLabel>
                                {
                                  attributeLabels[
                                    key as keyof typeof attributeLabels
                                  ]
                                }
                              </AttributeLabel>
                              <AttributeValue color={race.color}>
                                {value}
                              </AttributeValue>
                            </AttributeItem>
                          ),
                        )}
                    </AttributesContainer>
                  </CardContent>
                </Card>
              );
            })}
          </Grid>

          <ScrollHint>Role para baixo para confirmar sua escolha</ScrollHint>

          <Actions>
            <BackButton onClick={handleBack}>Voltar</BackButton>
            <ConfirmButton disabled={!selectedRace} onClick={handleConfirm}>
              {selectedRace
                ? `Selecionar ${selectedRace.name}`
                : 'Selecione uma raca'}
            </ConfirmButton>
          </Actions>
        </CenterWrapper>
      </ContentWrapper>
    </Container>
  );
};

export default RaceSelectPage;
