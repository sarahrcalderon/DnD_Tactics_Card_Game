import { useState, useCallback, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CharacterData } from '../types/characterData.types';
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
  CharacterStatsPanel,
  StatsTitle,
  StatBarContainer,
  StatBarRow,
  StatBarLabel,
  StatBarValue,
  StatBarTrack,
  StatBarFill,
  EquipmentGridWrapper,
  EquipmentSectionTitle,
} from '../styles/equipmentStyles';
import {
  Equipment,
  EquipmentSlot,
  EQUIPMENT_SLOTS,
  EquipmentData as EquipmentDataType,
} from '../types/equipment.types';
import { equipmentLoader } from '../services/equipment/EquipmentLoader';
import { getStartingEquipment } from '../data/startingEquipment';
import { EquipmentPreview } from '../components/Equipment/EquipmentPreview';
import { calculateCharacter } from '../utils/characterCalculator';
import { DerivedStats, Attributes } from '../types/character.types';
import { getGold } from '../utils/goldUtils';

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

// Atributos padrão para fallback
const defaultAttributes: Attributes = {
  str: 8,
  dex: 8,
  con: 8,
  int: 8,
  wis: 8,
  cha: 8,
};

const defaultDerivedStats: DerivedStats = {
  defense: 0,
  awareness: 0,
  critical: 0,
  avoidance: 0,
  deflect: 0,
  actionPoints: 0,
  criticalSeverity: 0,
  initiative: 0,
  maxHP: 0,
  speed: 0,
  maxMana: 0,
  manaRegen: 0,
  manaPower: 0,
};

type EquipmentRouteState = Partial<CharacterData> & {
  fromMap?: boolean;
  inventory?: Equipment[];
};

export const EquipmentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedSlot, setSelectedSlot] = useState<EquipmentSlot | null>(null);
  const [equipment, setEquipment] = useState<
    Record<EquipmentSlot, Equipment | null>
  >({} as Record<EquipmentSlot, Equipment | null>);
  const [inventory, setInventory] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [equipmentData, setEquipmentData] = useState<EquipmentDataType[]>([]);
  const [characterData, setCharacterData] = useState<CharacterData | null>(
    null,
  );
  const [previewEquipment, setPreviewEquipment] = useState<Equipment | null>(
    null,
  );
  const [characterDerivedStats, setCharacterDerivedStats] =
    useState<DerivedStats | null>(null);
  const [characterTotalAttributes, setCharacterTotalAttributes] =
    useState<Attributes | null>(null);
  const [hoverStats, setHoverStats] = useState<DerivedStats | null>(null);
  const [hoverAttributes, setHoverAttributes] = useState<Attributes | null>(
    null,
  );
  const [gold, setGold] = useState(0);

  useEffect(() => {
    setGold(getGold());
  }, []);

  useEffect(() => {
    const loadEquipmentData = async (): Promise<void> => {
      try {
        setLoading(true);
        const state = location.state as EquipmentRouteState | null;

        let classId: string = state?.classId || '';
        let build: string = state?.build || '';
        let isSaved: boolean = state?.isSaved || false;
        let saveId: string = state?.saveId || '';
        let deckId: string = state?.deckId || '';
        let deckName: string = state?.deckName || '';

        if (!classId) {
          const savedData = localStorage.getItem('characterData');
          if (savedData) {
            try {
              const parsed = JSON.parse(savedData);
              classId = parsed.classId || parsed.className?.toLowerCase() || '';
              isSaved = parsed.isSaved || parsed.isFinalized || false;
              saveId = parsed.saveId || '';
              deckId = parsed.deckId || '';
              deckName = parsed.deckName || '';
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

        const name = state?.name || state?.characterName || '';
        const className = state?.className || '';
        const raceName = state?.raceName || '';
        const raceImage = state?.raceImage || '';
        const raceIcon = state?.raceIcon || '';
        const attributes = state?.attributes || defaultAttributes;
        const derivedStats = state?.derivedStats || defaultDerivedStats;
        const deityId = state?.deityId || '';
        const deityName = state?.deityName || '';

        setCharacterData({
          name,
          classId,
          className,
          raceName,
          raceImage,
          raceIcon,
          deityId,
          deityName,
          deckId,
          deckName,
          level: state?.level || 1,
          attributes,
          derivedStats,
          pointsRemaining: state?.pointsRemaining || 0,
          totalPoints: state?.totalPoints || 5,
          isSaved,
          isFinalized: state?.isFinalized || false,
          saveId: saveId || null,
          progress: state?.progress || 0,
          location: state?.location || 'Acampamento Inicial',
          equipment: state?.equipment || {},
          createdAt: state?.createdAt || new Date().toISOString(),
          build,
          characterName: name,
        });

        const finalClassId = classId || 'paladino';
        const startingEquip = getStartingEquipment(finalClassId);
        const newEquipment: Record<EquipmentSlot, Equipment | null> = {
          ...startingEquip,
          ...(state?.equipment || {}),
        };
        const hasPassedEquipment = Boolean(
          state?.equipment && Object.keys(state.equipment).length > 0,
        );
        setInventory(state?.inventory || []);

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
              (item: EquipmentDataType) => item.slot === slot,
            );
            if (slotItems.length > 0) {
              const bestItem: EquipmentDataType = slotItems.sort(
                (a: EquipmentDataType, b: EquipmentDataType) =>
                  b.level - a.level,
              )[0];
              if (
                bestItem &&
                !hasPassedEquipment &&
                !newEquipment[slot] &&
                bestItem.level > 0
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
                    str: bestItem.str || 0,
                    dex: bestItem.dex || 0,
                    con: bestItem.con || 0,
                    int: bestItem.int || 0,
                    wis: bestItem.wis || 0,
                    cha: bestItem.cha || 0,
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

  useEffect(() => {
    if (!characterData?.classId) return;
    const calculated = calculateCharacter(
      characterData.classId,
      equipment,
      characterData.attributes,
    );
    setCharacterDerivedStats(calculated.derivedStats.total);
    setCharacterTotalAttributes(calculated.attributes.total);
  }, [equipment, characterData]);

  useEffect(() => {
    if (previewEquipment) {
      const tempEquipment = { ...equipment };
      const slot = previewEquipment.slot as EquipmentSlot;
      tempEquipment[slot] = previewEquipment;
      if (characterData?.classId) {
        const calculated = calculateCharacter(
          characterData.classId,
          tempEquipment,
          characterData.attributes,
        );
        setHoverStats(calculated.derivedStats.total);
        setHoverAttributes(calculated.attributes.total);
      }
    } else {
      setHoverStats(null);
      setHoverAttributes(null);
    }
  }, [previewEquipment, equipment, characterData]);

  const handleSlotClick = (slotId: EquipmentSlot): void => {
    setSelectedSlot(slotId);
  };

  const handleSlotHover = (slotId: EquipmentSlot): void => {
    const item = getSlotEquipment(slotId);
    if (item) {
      setPreviewEquipment(item);
    } else {
      setPreviewEquipment(null);
    }
  };

  const handleSlotLeave = (): void => {
    setPreviewEquipment(null);
  };

  const handleUnequip = (slotId: EquipmentSlot): void => {
    const item: Equipment | null = equipment[slotId];
    if (!item) return;

    setEquipment((prev: Record<EquipmentSlot, Equipment | null>) => ({
      ...prev,
      [slotId]: null,
    }));
    setInventory((previousInventory) => [
      ...previousInventory,
      { ...item, isEquipped: false },
    ]);

    toast.success(`${item.name} movido para o inventário!`);
    setSelectedSlot(null);
  };

  const handleBack = (): void => {
    const state = location.state as EquipmentRouteState | null;
    if (state?.fromMap) {
      navigate('/map');
      return;
    }

    navigate('/attribute-dist', {
      state: {
        classId: characterData?.classId || state?.classId || '',
        raceId: characterData?.raceId || state?.raceId || '',
        raceName: characterData?.raceName || state?.raceName || '',
        raceImage: characterData?.raceImage || state?.raceImage || '',
        raceIcon: characterData?.raceIcon || state?.raceIcon || '',
        characterName:
          characterData?.name || state?.name || state?.characterName || '',
        attributes:
          characterData?.attributes || state?.attributes || defaultAttributes,
        derivedStats:
          characterData?.derivedStats ||
          state?.derivedStats ||
          defaultDerivedStats,
        deckId: characterData?.deckId || state?.deckId || '',
        deckName: characterData?.deckName || state?.deckName || '',
        deityId: characterData?.deityId || state?.deityId || '',
        deityName: characterData?.deityName || state?.deityName || '',
        isSaved: characterData?.isSaved || state?.isSaved || false,
        saveId: characterData?.saveId || state?.saveId || null,
        pointsRemaining:
          characterData?.pointsRemaining ?? state?.pointsRemaining ?? 0,
      },
    });
  };

  const handleOpenBag = (): void => {
    navigate('/bag', {
      state: {
        ...location.state,
        equipment,
        inventory,
        gold,
        isSaved: characterData?.isSaved || false,
      },
    });
  };

  const getSlotEquipment = (slotId: EquipmentSlot): Equipment | null => {
    return equipment[slotId] || null;
  };

  const selectedEquipment: Equipment | null = selectedSlot
    ? equipment[selectedSlot]
    : null;

  const displayStats = hoverStats || characterDerivedStats;
  const displayAttributes = hoverAttributes || characterTotalAttributes;
  const equipmentAttack = useMemo(
    () =>
      Object.values(equipment).reduce(
        (total, item) => total + (item?.stats.attack || 0),
        0,
      ),
    [equipment],
  );

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
              {gold.toLocaleString()}
            </GoldDisplay>
            <BagButton onClick={handleOpenBag}>Bolsa</BagButton>
          </HeaderActions>
        </Header>

        <MainContent>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              flex: 1,
            }}
          >
            <CharacterStatsPanel>
              <StatsTitle>Atributos do Personagem</StatsTitle>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '8px',
                  marginBottom: '16px',
                }}
              >
                {(
                  [
                    ['STR', 'str'],
                    ['DEX', 'dex'],
                    ['CON', 'con'],
                    ['INT', 'int'],
                    ['WIS', 'wis'],
                    ['CHA', 'cha'],
                  ] as const
                ).map(([label, key]) => (
                  <div
                    key={key}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      color: '#858594',
                      fontSize: '0.72rem',
                    }}
                  >
                    <span>{label}</span>
                    <strong style={{ color: '#ffd700' }}>
                      {displayAttributes?.[key] || 0}
                    </strong>
                  </div>
                ))}
              </div>
              <StatBarContainer>
                <StatBarRow>
                  <StatBarLabel>HP</StatBarLabel>
                  <StatBarTrack>
                    <StatBarFill
                      $value={displayStats?.maxHP || 0}
                      $max={Math.max(displayStats?.maxHP || 100, 100)}
                      $color="#e74c3c"
                    />
                  </StatBarTrack>
                  <StatBarValue>{displayStats?.maxHP || 0}</StatBarValue>
                </StatBarRow>

                <StatBarRow>
                  <StatBarLabel>MANA</StatBarLabel>
                  <StatBarTrack>
                    <StatBarFill
                      $value={displayStats?.maxMana || 0}
                      $max={Math.max(displayStats?.maxMana || 50, 50)}
                      $color="#3498db"
                    />
                  </StatBarTrack>
                  <StatBarValue>{displayStats?.maxMana || 0}</StatBarValue>
                </StatBarRow>

                <StatBarRow>
                  <StatBarLabel>AP</StatBarLabel>
                  <StatBarTrack>
                    <StatBarFill
                      $value={displayStats?.actionPoints || 0}
                      $max={15}
                      $color="#9b59b6"
                    />
                  </StatBarTrack>
                  <StatBarValue>{displayStats?.actionPoints || 0}</StatBarValue>
                </StatBarRow>

                <StatBarRow>
                  <StatBarLabel>REG. MANA</StatBarLabel>
                  <StatBarTrack>
                    <StatBarFill
                      $value={displayStats?.manaRegen || 0}
                      $max={10}
                      $color="#2ecc71"
                    />
                  </StatBarTrack>
                  <StatBarValue>{displayStats?.manaRegen || 0}</StatBarValue>
                </StatBarRow>
              </StatBarContainer>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '4px 12px',
                  marginTop: '12px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    color: '#858594',
                    fontSize: '0.7rem',
                  }}
                >
                  <span>Defesa</span>
                  <span style={{ color: '#ffd700' }}>
                    {displayStats?.defense || 0}
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    color: '#858594',
                    fontSize: '0.7rem',
                  }}
                >
                  <span>Ataque</span>
                  <span style={{ color: '#ffd700' }}>+{equipmentAttack}</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    color: '#858594',
                    fontSize: '0.7rem',
                  }}
                >
                  <span>Awareness</span>
                  <span style={{ color: '#ffd700' }}>
                    {displayStats?.awareness || 0}
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    color: '#858594',
                    fontSize: '0.7rem',
                  }}
                >
                  <span>Crítico</span>
                  <span style={{ color: '#ffd700' }}>
                    {displayStats?.critical || 0}%
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    color: '#858594',
                    fontSize: '0.7rem',
                  }}
                >
                  <span>Avoidance</span>
                  <span style={{ color: '#ffd700' }}>
                    {displayStats?.avoidance || 0}%
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    color: '#858594',
                    fontSize: '0.7rem',
                  }}
                >
                  <span>Deflect</span>
                  <span style={{ color: '#ffd700' }}>
                    {displayStats?.deflect || 0}%
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    color: '#858594',
                    fontSize: '0.7rem',
                  }}
                >
                  <span>Potência Mágica</span>
                  <span style={{ color: '#ffd700' }}>
                    {displayStats?.manaPower || 0}
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    color: '#858594',
                    fontSize: '0.7rem',
                  }}
                >
                  <span>Iniciativa</span>
                  <span style={{ color: '#ffd700' }}>
                    {displayStats?.initiative || 0}
                  </span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    color: '#858594',
                    fontSize: '0.7rem',
                  }}
                >
                  <span>Velocidade</span>
                  <span style={{ color: '#ffd700' }}>
                    {displayStats?.speed || 0}m
                  </span>
                </div>
              </div>
            </CharacterStatsPanel>

            <EquipmentGridWrapper>
              <EquipmentSectionTitle>Equipamentos</EquipmentSectionTitle>
              <EquipmentGrid>
                {EQUIPMENT_SLOTS.map((slot) => {
                  const item: Equipment | null = getSlotEquipment(slot.id);
                  const isEmpty: boolean = !item;

                  return (
                    <SlotItem
                      key={slot.id}
                      $isEmpty={isEmpty}
                      $rarity={item?.rarity}
                      onClick={() => handleSlotClick(slot.id)}
                      onMouseEnter={() => handleSlotHover(slot.id)}
                      onMouseLeave={handleSlotLeave}
                      title={
                        item
                          ? `${item.name} (${item.rarity})`
                          : slot.description
                      }
                    >
                      {item ? (
                        <>
                          <SlotEquipmentImage
                            src={item.image}
                            alt={item.name}
                          />
                          <SlotRarityBadge $rarity={item.rarity} />
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
            </EquipmentGridWrapper>
          </div>

          <EquipmentInfo>
            <InfoTitle>Detalhes do Item</InfoTitle>
            {selectedEquipment ? (
              <InfoContent>
                <InfoName>{selectedEquipment.name}</InfoName>
                <InfoRarity $rarity={selectedEquipment.rarity}>
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
                        manaRegen: 'Reg. Mana',
                        manaPower: 'Potencia Magica',
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

        {previewEquipment && characterDerivedStats && (
          <EquipmentPreview
            equipment={previewEquipment}
            currentStats={characterDerivedStats}
          />
        )}

        <Actions>
          <BackButton onClick={handleBack}>
            {(location.state as EquipmentRouteState | null)?.fromMap
              ? '← Voltar ao Mapa'
              : 'Voltar a Ficha'}
          </BackButton>
        </Actions>
      </ContentWrapper>
    </Container>
  );
};

export default EquipmentPage;
