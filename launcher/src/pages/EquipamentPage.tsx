import { useState, useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Container,
  BackgroundImage,
  ContentWrapper,
  Header,
  TitleGroup,
  Title,
  Subtitle,
  HeaderActions,
  GoldDisplay,
  BagButton,
  MainContent,
  EquipmentGrid,
  SlotItem,
  SlotIcon,
  SlotLabel,
  SlotEquipmentImage,
  SlotRarityBadge,
  EquipmentInfo,
  InfoTitle,
  InfoEmpty,
  InfoContent,
  InfoName,
  InfoRarity,
  InfoStats,
  InfoStat,
  InfoDescription,
  InfoActions,
  ActionButton,
  Actions,
  BackButton,
} from '../styles/equipmentStyles';
import {
  Equipment,
  EquipmentSlot,
  EQUIPMENT_SLOTS,
  EquipmentData,
} from '../types/equipment.types';
import { equipmentLoader } from '../services/equipamentLoader';
import { getStartingEquipment } from '../data/startingEquipment';

const GOLD_AMOUNT = 1250;

const getSlotType = (slot: EquipmentSlot): string => {
  const types: Record<EquipmentSlot, string> = {
    head: 'Capacete',
    armor: 'Armadura',
    arms: 'Bracelete',
    mainHand: 'Arma Principal',
    offHand: 'Arma Secundaria',
    feet: 'Bota',
    neck: 'Colar',
    rightRing: 'Anel',
    leftRing: 'Anel',
    waist: 'Cinto',
    shirt: 'Camiseta',
    trousers: 'Calcas',
  };
  return types[slot] || 'Equipamento';
};

const getIconForSlot = (slot: EquipmentSlot): string => {
  const icons: Record<EquipmentSlot, string> = {
    head: '/assets/images/icons/shield.svg',
    armor: '/assets/images/icons/shield.svg',
    arms: '/assets/images/icons/star.svg',
    mainHand: '/assets/images/icons/sword.svg',
    offHand: '/assets/images/icons/shield.svg',
    feet: '/assets/images/icons/star.svg',
    neck: '/assets/images/icons/star.svg',
    rightRing: '/assets/images/icons/star.svg',
    leftRing: '/assets/images/icons/star.svg',
    waist: '/assets/images/icons/star.svg',
    shirt: '/assets/images/icons/star.svg',
    trousers: '/assets/images/icons/star.svg',
  };
  return icons[slot] || '/assets/images/icons/star.svg';
};

interface CharacterData {
  characterName?: string;
  className?: string;
  raceName?: string;
  raceImage?: string;
  raceIcon?: string;
  attributes?: any;
  derivedStats?: any;
  classId?: string;
  build?: string;
}

export const EquipmentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedSlot, setSelectedSlot] = useState<EquipmentSlot | null>(null);
  const [equipment, setEquipment] = useState<
    Record<EquipmentSlot, Equipment | null>
  >({} as Record<EquipmentSlot, Equipment | null>);
  const [loading, setLoading] = useState<boolean>(true);
  const [equipmentData, setEquipmentData] = useState<EquipmentData[]>([]);
  const [characterData, setCharacterData] = useState<CharacterData>({});

  useEffect(() => {
    const loadEquipmentData = async (): Promise<void> => {
      try {
        setLoading(true);
        const state = location.state as CharacterData | null;

        let classId: string = state?.classId || '';
        let build: string = state?.build || '';

        if (!classId) {
          const savedData = localStorage.getItem('characterData');
          if (savedData) {
            try {
              const parsed = JSON.parse(savedData);
              classId = parsed.classId || parsed.className?.toLowerCase() || '';
              if (classId === 'paladino') build = 'tank';
              else if (classId === 'clerigo') build = 'cura';
              else if (classId === 'barbaro') build = 'tank';
              else if (classId === 'ladino') build = 'furtivo';
              else if (classId === 'mago') build = 'controle';
              else if (classId === 'bruxo') build = 'distancia';
            } catch (error) {
              console.error('Erro ao carregar dados do personagem:', error);
            }
          }
        }

        if (state) {
          setCharacterData(state);
        }

        const finalClassId = classId || 'paladino';
        const startingEquip = getStartingEquipment(finalClassId);
        const newEquipment: Record<EquipmentSlot, Equipment | null> = {
          ...startingEquip,
        };

        if (classId && build) {
          const index = await equipmentLoader.loadData();
          const items = await equipmentLoader.getEquipmentForCharacter(
            classId,
            build,
          );
          setEquipmentData(items);

          const slots: EquipmentSlot[] = [
            'head',
            'armor',
            'arms',
            'mainHand',
            'offHand',
            'feet',
            'neck',
            'rightRing',
            'leftRing',
            'waist',
            'shirt',
            'trousers',
          ];

          slots.forEach((slot) => {
            const slotItems = items.filter(
              (item: EquipmentData) => item.slot === slot,
            );
            if (slotItems.length > 0) {
              const bestItem: EquipmentData = slotItems.sort(
                (a: EquipmentData, b: EquipmentData) => b.level - a.level,
              )[0];
              if (
                bestItem &&
                bestItem.level > (newEquipment[slot]?.level || 0)
              ) {
                newEquipment[slot] = {
                  id: bestItem.id,
                  name: bestItem.name,
                  slot: bestItem.slot,
                  type: getSlotType(bestItem.slot),
                  rarity: bestItem.rarity,
                  image: bestItem.image || getIconForSlot(bestItem.slot),
                  icon: getIconForSlot(bestItem.slot),
                  level: bestItem.level,
                  stats: {
                    attack: bestItem.attack || 0,
                    defense: bestItem.defense || 0,
                    hp: bestItem.hp || 0,
                    critical: bestItem.critical || 0,
                    avoidance: bestItem.avoidance || 0,
                    deflect: bestItem.deflect || 0,
                    awareness: bestItem.awareness || 0,
                    actionPoints: bestItem.actionPoints || 0,
                    speed: bestItem.speed || 0,
                    criticalSeverity: bestItem.criticalSeverity || 0,
                  },
                  description: bestItem.description,
                  value: bestItem.value,
                  isEquipped: true,
                };
              }
            }
          });
        }

        setEquipment(newEquipment);
      } catch (error) {
        console.error('Erro ao carregar equipamentos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadEquipmentData();
  }, [location]);

  const handleSlotClick = (slotId: EquipmentSlot): void => {
    setSelectedSlot(slotId);
  };

  const handleUnequip = (slotId: EquipmentSlot): void => {
    const item: Equipment | null = equipment[slotId];
    if (!item) return;

    setEquipment((prev: Record<EquipmentSlot, Equipment | null>) => ({
      ...prev,
      [slotId]: null,
    }));

    toast.success(`${item.name} removido!`);
    setSelectedSlot(null);
  };

  const handleBack = (): void => {
    navigate('/attribute-dist', {
      state: {
        classId: characterData.className?.toLowerCase() || '',
        raceName: characterData.raceName || '',
        raceImage: characterData.raceImage || '',
        raceIcon: characterData.raceIcon || '',
        characterName: characterData.characterName || '',
        attributes: characterData.attributes,
        derivedStats: characterData.derivedStats,
      },
    });
  };

  const handleOpenBag = (): void => {
    navigate('/bag', {
      state: {
        ...location.state,
        equipment,
        gold: GOLD_AMOUNT,
      },
    });
  };

  const getSlotEquipment = (slotId: EquipmentSlot): Equipment | null => {
    return equipment[slotId] || null;
  };

  const selectedEquipment: Equipment | null = selectedSlot
    ? equipment[selectedSlot]
    : null;

  if (loading) {
    return (
      <Container>
        <BackgroundImage />
        <ContentWrapper>
          <div
            style={{ color: '#dcdce5', padding: '60px 0', textAlign: 'center' }}
          >
            Carregando equipamentos...
          </div>
        </ContentWrapper>
      </Container>
    );
  }

  return (
    <Container>
      <BackgroundImage />
      <ContentWrapper>
        <Header>
          <TitleGroup>
            <Title>Equipamentos</Title>
            <Subtitle>Gerencie os itens do seu personagem</Subtitle>
          </TitleGroup>
          <HeaderActions>
            <GoldDisplay>
              <span>🪙</span>
              {GOLD_AMOUNT.toLocaleString()}
            </GoldDisplay>
            <BagButton onClick={handleOpenBag}>Bolsa</BagButton>
          </HeaderActions>
        </Header>

        <MainContent>
          <EquipmentGrid>
            {EQUIPMENT_SLOTS.map((slot) => {
              const item: Equipment | null = getSlotEquipment(slot.id);
              const isEmpty: boolean = !item;

              return (
                <SlotItem
                  key={slot.id}
                  isEmpty={isEmpty}
                  rarity={item?.rarity}
                  onClick={() => handleSlotClick(slot.id)}
                  title={
                    item ? `${item.name} (${item.rarity})` : slot.description
                  }
                >
                  {item ? (
                    <>
                      <SlotEquipmentImage src={item.image} alt={item.name} />
                      <SlotRarityBadge rarity={item.rarity} />
                    </>
                  ) : (
                    <>
                      <SlotIcon>{slot.icon}</SlotIcon>
                      <SlotLabel>{slot.label}</SlotLabel>
                    </>
                  )}
                </SlotItem>
              );
            })}
          </EquipmentGrid>

          <EquipmentInfo>
            <InfoTitle>Detalhes do Item</InfoTitle>
            {selectedEquipment ? (
              <InfoContent>
                <InfoName>{selectedEquipment.name}</InfoName>
                <InfoRarity rarity={selectedEquipment.rarity}>
                  {selectedEquipment.rarity}
                </InfoRarity>
                <InfoStats>
                  {Object.entries(selectedEquipment.stats).map(
                    ([key, value]) => {
                      if (value === 0) return null;
                      const statNames: Record<string, string> = {
                        attack: 'Ataque',
                        defense: 'Defesa',
                        hp: 'Vida',
                        critical: 'Critico',
                        avoidance: 'Evasao',
                        deflect: 'Bloqueio',
                        awareness: 'Percepcao',
                        actionPoints: 'Acao',
                        speed: 'Velocidade',
                        criticalSeverity: 'Severidade',
                      };
                      return (
                        <InfoStat key={key}>
                          <span>{statNames[key] || key.toUpperCase()}</span>
                          <span>+{value}</span>
                        </InfoStat>
                      );
                    },
                  )}
                </InfoStats>
                <InfoDescription>
                  {selectedEquipment.description}
                </InfoDescription>
                <InfoActions>
                  <ActionButton
                    variant="danger"
                    onClick={() => handleUnequip(selectedEquipment.slot)}
                  >
                    Remover
                  </ActionButton>
                </InfoActions>
              </InfoContent>
            ) : (
              <InfoEmpty>
                <span></span>
                <p>Clique em um slot para ver os detalhes do equipamento</p>
              </InfoEmpty>
            )}
          </EquipmentInfo>
        </MainContent>

        <Actions>
          <BackButton onClick={handleBack}>Voltar a Ficha</BackButton>
        </Actions>
      </ContentWrapper>
    </Container>
  );
};

export default EquipmentPage;
