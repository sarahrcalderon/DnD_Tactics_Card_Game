import { useState, useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import styled from 'styled-components';
import { Equipment, EquipmentSlot } from '../types/equipment.types';
import { open5eApi } from '../services/open5eApi';
import { getGold } from '../utils/goldUtils';
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
  Actions,
  BackButton,
} from '../styles/equipmentStyles';

const BagGrid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 12px;
  background: rgba(27, 24, 51, 0.6);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  min-height: 400px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
    padding: 16px;
    gap: 10px;
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(3, 1fr);
    padding: 12px;
    gap: 8px;
  }
`;

interface BagSlotProps {
  $hasItem: boolean;
  $rarity?: string;
}

const BagSlot = styled.div<BagSlotProps>`
  aspect-ratio: 1 / 1;
  border-radius: 10px;
  background: ${({ $hasItem }) =>
    $hasItem ? 'rgba(27, 24, 51, 0.8)' : 'rgba(255, 255, 255, 0.03)'};
  border: 2px solid
    ${({ $hasItem, $rarity }) => {
      if (!$hasItem) return 'rgba(255, 255, 255, 0.05)';
      const colors: Record<string, string> = {
        Comum: '#8a8a8a44',
        Incomum: '#4caf5044',
        Rara: '#2196f344',
        Epica: '#9c27b044',
        Lendaria: '#ffd70044',
        Mitica: '#ff6b6b44',
      };
      return colors[$rarity || ''] || 'rgba(255, 255, 255, 0.1)';
    }};
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: ${({ $hasItem }) => ($hasItem ? 'pointer' : 'default')};
  transition: all 0.3s ease;
  overflow: hidden;
  padding: 4px;

  &:hover {
    transform: ${({ $hasItem }) => ($hasItem ? 'translateY(-3px)' : 'none')};
    border-color: ${({ $hasItem, $rarity }) => {
      if (!$hasItem) return 'rgba(255, 255, 255, 0.05)';
      const colors: Record<string, string> = {
        Comum: '#8a8a8a',
        Incomum: '#4caf50',
        Rara: '#2196f3',
        Epica: '#9c27b0',
        Lendaria: '#ffd700',
        Mitica: '#ff6b6b',
      };
      return colors[$rarity || ''] || 'rgba(255, 255, 255, 0.2)';
    }};
  }
`;

const BagSlotImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 6px;
`;

const BagSlotEmpty = styled.div`
  color: #444455;
  font-size: 1.5rem;
  opacity: 0.3;
`;

interface RarityBadgeProps {
  $rarity: string;
}

const BagSlotRarityBadge = styled.div<RarityBadgeProps>`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ $rarity }) => {
    const colors: Record<string, string> = {
      Comum: '#8a8a8a',
      Incomum: '#4caf50',
      Rara: '#2196f3',
      Epica: '#9c27b0',
      Lendaria: '#ffd700',
      Mitica: '#ff6b6b',
    };
    return colors[$rarity] || '#8a8a8a';
  }};
  border: 1px solid rgba(255, 255, 255, 0.15);
`;

const BagHeader = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 0 4px;

  span {
    color: #858594;
    font-size: 0.85rem;
  }
`;

const BagItemTooltip = styled.div`
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  background: rgba(10, 8, 16, 0.95);
  border: 1px solid rgba(255, 215, 0, 0.15);
  border-radius: 8px;
  padding: 8px 12px;
  min-width: 150px;
  max-width: 200px;
  z-index: 10;
  pointer-events: none;
  white-space: nowrap;
  text-align: center;
  backdrop-filter: blur(10px);
  opacity: 0;
  transition: opacity 0.2s ease;

  ${BagSlot}:hover & {
    opacity: 1;
  }
`;

const TooltipName = styled.div`
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 600;
`;

interface TooltipRarityProps {
  $rarity: string;
}

const TooltipRarity = styled.div<TooltipRarityProps>`
  color: ${({ $rarity }) => {
    const colors: Record<string, string> = {
      Comum: '#8a8a8a',
      Incomum: '#4caf50',
      Rara: '#2196f3',
      Epica: '#9c27b0',
      Lendaria: '#ffd700',
      Mitica: '#ff6b6b',
    };
    return colors[$rarity] || '#8a8a8a';
  }};
  font-size: 0.6rem;
  font-weight: 600;
  text-transform: uppercase;
`;

const TooltipStats = styled.div`
  color: #9999aa;
  font-size: 0.6rem;
  margin-top: 2px;
`;

const getDefaultIconForSlot = (slot: EquipmentSlot): string => {
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

// Mock items for bag (30 slots)
const MOCK_BAG_ITEMS: Omit<Equipment, 'image'>[] = [
  {
    id: 'bag-001',
    name: 'Espada Longa',
    slot: 'mainHand',
    type: 'Arma Principal',
    rarity: 'Comum',
    icon: '/assets/images/icons/sword.svg',
    level: 2,
    stats: { attack: 5 },
    description: 'Uma espada longa básica.',
    value: 50,
    isEquipped: false,
  },
  {
    id: 'bag-002',
    name: 'Escudo de Madeira',
    slot: 'offHand',
    type: 'Arma Secundaria',
    rarity: 'Comum',
    icon: '/assets/images/icons/shield.svg',
    level: 1,
    stats: { defense: 4 },
    description: 'Escudo de madeira reforçada.',
    value: 30,
    isEquipped: false,
  },
  {
    id: 'bag-003',
    name: 'Anel da Sorte',
    slot: 'rightRing',
    type: 'Anel',
    rarity: 'Rara',
    icon: '/assets/images/icons/star.svg',
    level: 4,
    stats: { critical: 5, avoidance: 3 },
    description: 'Anel que concede sorte ao seu portador.',
    value: 200,
    isEquipped: false,
  },
  {
    id: 'bag-004',
    name: 'Colar de Prata',
    slot: 'neck',
    type: 'Colar',
    rarity: 'Incomum',
    icon: '/assets/images/icons/star.svg',
    level: 3,
    stats: { hp: 10, awareness: 2 },
    description: 'Colar de prata com um pequeno cristal.',
    value: 100,
    isEquipped: false,
  },
  {
    id: 'bag-005',
    name: 'Botas de Couro',
    slot: 'feet',
    type: 'Bota',
    rarity: 'Comum',
    icon: '/assets/images/icons/star.svg',
    level: 1,
    stats: { speed: 1 },
    description: 'Botas de couro resistentes.',
    value: 25,
    isEquipped: false,
  },
];

interface LocationState {
  gold?: number;
  equipment?: Record<EquipmentSlot, Equipment | null>;
  inventory?: Equipment[];
}

export const BagPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [bagItems, setBagItems] = useState<(Equipment | null)[]>([]);
  const [gold, setGold] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadBagItems = async () => {
      setLoading(true);
      const state = location.state as LocationState | null;
      setGold(state?.gold ?? getGold());

      // Carregar imagens para os itens da bag
      const itemsWithImages = await Promise.all(
        MOCK_BAG_ITEMS.map(async (item) => {
          if (!item) return null;

          try {
            // Buscar imagem da API
            const imageUrl = await open5eApi.getItemImage(item.name);

            return {
              ...item,
              image: imageUrl || getDefaultIconForSlot(item.slot),
            } as Equipment;
          } catch (error) {
            console.error(`Erro ao buscar imagem para ${item.name}:`, error);
            return {
              ...item,
              image: getDefaultIconForSlot(item.slot),
            } as Equipment;
          }
        }),
      );

      // An inventory received from the equipment screen is the source of truth.
      // Mock items are only used for a bag opened outside that flow.
      setBagItems(
        state?.inventory
          ? state.inventory
          : itemsWithImages,
      );
      setLoading(false);
    };

    loadBagItems();
  }, [location]);

  const handleBack = useCallback((): void => {
    navigate('/equipment', {
      state: location.state,
    });
  }, [navigate, location.state]);

  const handleItemClick = useCallback(
    (index: number): void => {
      const item = bagItems[index];
      if (!item) return;

      const state = location.state as LocationState | null;
      const equipment = {
        ...(state?.equipment || {}),
      } as Record<EquipmentSlot, Equipment | null>;
      const displacedItem = equipment[item.slot];
      const nextInventory = bagItems
        .filter((_, bagIndex) => bagIndex !== index)
        .filter((bagItem): bagItem is Equipment => bagItem !== null);

      if (displacedItem) {
        nextInventory.push({ ...displacedItem, isEquipped: false });
      }

      equipment[item.slot] = { ...item, isEquipped: true };

      toast.success(`${item.name} equipado em ${item.type}!`, {
        duration: 2000,
      });

      navigate('/equipment', {
        state: {
          ...state,
          equipment,
          inventory: nextInventory,
        },
      });
    },
    [bagItems, location.state, navigate],
  );

  const equippedCount: number = bagItems.filter(
    (item: Equipment | null) => item?.isEquipped,
  ).length;
  const totalItems: number = bagItems.filter(
    (item: Equipment | null) => item !== null,
  ).length;

  if (loading) {
    return (
      <Container>
        <BackgroundImage />
        <ContentWrapper>
          <div
            style={{ color: '#dcdce5', padding: '60px 0', textAlign: 'center' }}
          >
            Carregando inventário...
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
            <Title>Inventário</Title>
            <Subtitle>Itens coletados pelo seu personagem</Subtitle>
          </TitleGroup>
          <HeaderActions>
            <GoldDisplay>
              <span>🪙</span>
              {gold.toLocaleString()}
            </GoldDisplay>
          </HeaderActions>
        </Header>

        <BagHeader>
          <span>{totalItems} / 30 itens</span>
          <span>Equipados: {equippedCount}</span>
        </BagHeader>

        <BagGrid>
          {bagItems.map((item: Equipment | null, index: number) => (
            <BagSlot
              key={index}
              $hasItem={!!item}
              $rarity={item?.rarity}
              onClick={() => handleItemClick(index)}
            >
              {item ? (
                <>
                  <BagSlotImage
                    src={item.image || getDefaultIconForSlot(item.slot)}
                    alt={item.name}
                    onError={(e) => {
                      // Fallback se a imagem não carregar
                      (e.target as HTMLImageElement).src =
                        getDefaultIconForSlot(item.slot);
                    }}
                  />
                  <BagSlotRarityBadge $rarity={item.rarity} />
                  <BagItemTooltip>
                    <TooltipName>{item.name}</TooltipName>
                    <TooltipRarity $rarity={item.rarity}>
                      {item.rarity}
                    </TooltipRarity>
                    {Object.entries(item.stats).length > 0 && (
                      <TooltipStats>
                        {Object.entries(item.stats)
                          .filter(([_, value]) => value > 0)
                          .map(
                            ([key, value]) => `${key.toUpperCase()}+${value}`,
                          )
                          .join(' • ')}
                      </TooltipStats>
                    )}
                  </BagItemTooltip>
                </>
              ) : (
                <BagSlotEmpty>+</BagSlotEmpty>
              )}
            </BagSlot>
          ))}
        </BagGrid>

        <Actions>
          <BackButton onClick={handleBack}>← Voltar</BackButton>
        </Actions>
      </ContentWrapper>
    </Container>
  );
};

export default BagPage;
