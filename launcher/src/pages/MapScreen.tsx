import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import SideMenu from '../components/SideMenu';
import EnemyMenu from '../components/EnemyMenu';

import {
  Container,
  MapContainer,
  MapBackground,
  MapContent,
  TopMenu,
  MenuLeft,
  MenuTitle,
  MenuRight,
  MenuButton,
  Battlefield,
  RouteContainer,
  RouteSVG,
  RouteLine,
  RouteLineCompleted,
  RouteMarker,
  MarkerDot,
  MarkerLabel,
  PlayerMarker,
  PlayerIcon,
  PlayerGlow,
  CampaignStatus,
  CampaignStatusTitle,
  CampaignStatusText,
} from '../styles/mapStyles';

import { LoadingScreen } from './LoadingScreen';
import { RouteCoordinate, CampaignPoint } from '../types/mapScreen.types';

const CAMPAIGN_STORAGE_KEY = 'blackmoorCampaignProgress';

const ROUTE_PATH: RouteCoordinate[] = [
  // Vilarejo → Bosque
  { x: 18.47, y: 70.97 },
  { x: 21.48, y: 65.96 },
  { x: 24.49, y: 60.95 },
  { x: 27.5, y: 55.94 },
  { x: 30.51, y: 50.93 },
  { x: 33.51, y: 45.91 },
  { x: 36.52, y: 40.9 },

  // Bosque
  { x: 39.53, y: 35.89 },

  // Bosque → Ruínas
  { x: 42.84, y: 36.75 },
  { x: 46.14, y: 37.62 },
  { x: 49.45, y: 38.48 },
  { x: 52.75, y: 39.35 },
  { x: 56.06, y: 40.21 },
  { x: 59.37, y: 41.08 },

  // Ruínas
  { x: 62.67, y: 41.94 },

  // Ruínas → Vale da Sombra
  { x: 62.58, y: 37.0 },
  { x: 62.48, y: 32.06 },
  { x: 62.39, y: 27.12 },

  // Vale da Sombra
  { x: 62.29, y: 22.18 },

  // Vale → Ladrões da Montanha
  { x: 65.93, y: 24.9 },
  { x: 69.56, y: 27.62 },

  // Ladrões da Montanha
  { x: 73.2, y: 30.34 },

  // Ladrões → Guardas do Castelo
  { x: 73.72, y: 28.07 },
  { x: 74.24, y: 25.8 },
  { x: 74.76, y: 23.54 },

  // Guardas do Castelo
  { x: 75.28, y: 21.27 },

  // Guardas → Castelo
  { x: 81.02, y: 10.79 }, // Castelo
];

// ============================================================
// LOCAIS DA CAMPANHA
// ============================================================
//
// Cada local aponta para um ponto dentro de ROUTE_PATH.
//
// O jogador percorre todos os pontos intermediários
// até chegar ao próximo local.
//
// ============================================================

const CAMPAIGN_POINTS: CampaignPoint[] = [
  {
    id: 1,
    name: 'Vilarejo',
    x: 18.47,
    y: 70.97,
    isBoss: false,
    pathIndex: 0,
  },
  {
    id: 2,
    name: 'Bosque',
    x: 39.53,
    y: 35.89,
    isBoss: false,
    pathIndex: 7,
  },
  {
    id: 3,
    name: 'Ruínas',
    x: 62.67,
    y: 41.94,
    isBoss: false,
    pathIndex: 14,
  },
  {
    id: 4,
    name: 'Vale da Sombra',
    x: 62.29,
    y: 22.18,
    isBoss: false,
    pathIndex: 18,
  },
  {
    id: 5,
    name: 'Ladrões da Montanha',
    x: 73.2,
    y: 30.34,
    isBoss: false,
    pathIndex: 21,
  },
  {
    id: 6,
    name: 'Guardas do Castelo',
    x: 75.28,
    y: 21.27,
    isBoss: false,
    pathIndex: 25,
  },
  {
    id: 7,
    name: 'Castelo',
    x: 81.02,
    y: 10.79,
    isBoss: true,
    pathIndex: 26,
  },
];

// ============================================================
// GERAR PATH SVG
// ============================================================

const createSvgPath = (points: RouteCoordinate[]) => {
  return points
    .map((point, index) => {
      if (index === 0) {
        return `M ${point.x} ${point.y}`;
      }

      return `L ${point.x} ${point.y}`;
    })
    .join(' ');
};

// ============================================================
// COMPONENTE
// ============================================================

export const MapScreen = () => {
  const navigate = useNavigate();

  const animationFrameRef = useRef<number | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [currentStep, setCurrentStep] = useState(() => {
    try {
      const savedProgress = localStorage.getItem(CAMPAIGN_STORAGE_KEY);

      if (!savedProgress) {
        return 0;
      }

      const parsed = JSON.parse(savedProgress);

      if (
        typeof parsed.currentStep === 'number' &&
        parsed.currentStep >= 0 &&
        parsed.currentStep < CAMPAIGN_POINTS.length
      ) {
        return parsed.currentStep;
      }

      return 0;
    } catch {
      return 0;
    }
  });

  const [completedSteps, setCompletedSteps] = useState<number[]>(() => {
    try {
      const savedProgress = localStorage.getItem(CAMPAIGN_STORAGE_KEY);

      if (!savedProgress) {
        return [];
      }

      const parsed = JSON.parse(savedProgress);

      if (Array.isArray(parsed.completedSteps)) {
        return parsed.completedSteps;
      }

      return [];
    } catch {
      return [];
    }
  });

  // ==========================================================
  // CAMPANHA COMPLETA
  // ==========================================================

  const [campaignCompleted, setCampaignCompleted] = useState(() => {
    try {
      const savedProgress = localStorage.getItem(CAMPAIGN_STORAGE_KEY);

      if (!savedProgress) {
        return false;
      }

      const parsed = JSON.parse(savedProgress);

      return parsed.campaignCompleted === true;
    } catch {
      return false;
    }
  });

  // ==========================================================
  // ANIMAÇÃO
  // ==========================================================

  const [isMoving, setIsMoving] = useState(false);

  // ==========================================================
  // POSIÇÃO DO JOGADOR
  // ==========================================================

  const [playerPosition, setPlayerPosition] = useState<RouteCoordinate>(() => {
    try {
      const savedProgress = localStorage.getItem(CAMPAIGN_STORAGE_KEY);

      if (savedProgress) {
        const parsed = JSON.parse(savedProgress);

        if (
          typeof parsed.currentStep === 'number' &&
          CAMPAIGN_POINTS[parsed.currentStep]
        ) {
          const point = CAMPAIGN_POINTS[parsed.currentStep];

          return {
            x: point.x,
            y: point.y,
          };
        }
      }
    } catch {}

    return {
      x: CAMPAIGN_POINTS[0].x,
      y: CAMPAIGN_POINTS[0].y,
    };
  });

  // ==========================================================
  // PATH SVG COMPLETO
  // ==========================================================

  const fullPath = createSvgPath(ROUTE_PATH);

  // ==========================================================
  // PATH COMPLETADO
  // ==========================================================
  //
  // O caminho concluído vai até a posição atual do jogador.
  //
  // ==========================================================

  const completedPath = createSvgPath(
    ROUTE_PATH.slice(0, CAMPAIGN_POINTS[currentStep].pathIndex + 1),
  );

  // ==========================================================
  // SALVAR PROGRESSO
  // ==========================================================

  useEffect(() => {
    localStorage.setItem(
      CAMPAIGN_STORAGE_KEY,
      JSON.stringify({
        currentStep,
        completedSteps,
        campaignCompleted,
      }),
    );
  }, [currentStep, completedSteps, campaignCompleted]);

  // ==========================================================
  // LIMPAR ANIMAÇÃO
  // ==========================================================

  useEffect(() => {
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // ==========================================================
  // LOADING COMPLETO
  // ==========================================================

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  // ==========================================================
  // DISTÂNCIA ENTRE DOIS PONTOS
  // ==========================================================

  const getDistance = (pointA: RouteCoordinate, pointB: RouteCoordinate) => {
    const deltaX = pointB.x - pointA.x;
    const deltaY = pointB.y - pointA.y;

    return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  };

  // ==========================================================
  // ANIMAR MOVIMENTO
  // ==========================================================
  //
  // O jogador percorre cada segmento do caminho.
  //
  // ==========================================================

  const animatePlayerAlongRoute = useCallback(
    (startPathIndex: number, endPathIndex: number): Promise<void> => {
      return new Promise((resolve) => {
        const routeSegment = ROUTE_PATH.slice(startPathIndex, endPathIndex + 1);

        if (routeSegment.length < 2) {
          resolve();
          return;
        }

        // ======================================================
        // CALCULAR DISTÂNCIA TOTAL
        // ======================================================

        const segmentLengths: number[] = [];

        let totalDistance = 0;

        for (let index = 0; index < routeSegment.length - 1; index += 1) {
          const distance = getDistance(
            routeSegment[index],
            routeSegment[index + 1],
          );

          segmentLengths.push(distance);

          totalDistance += distance;
        }

        const duration = Math.min(Math.max(totalDistance * 35, 900), 3000);

        let startTime: number | null = null;

        const animate = (timestamp: number) => {
          if (startTime === null) {
            startTime = timestamp;
          }

          const elapsedTime = timestamp - startTime;

          const progress = Math.min(elapsedTime / duration, 1);

          const easedProgress = progress * progress * (3 - 2 * progress);

          const targetDistance = totalDistance * easedProgress;

          let accumulatedDistance = 0;

          for (let index = 0; index < segmentLengths.length; index += 1) {
            const segmentLength = segmentLengths[index];

            if (accumulatedDistance + segmentLength >= targetDistance) {
              const localDistance = targetDistance - accumulatedDistance;

              const localProgress =
                segmentLength === 0 ? 0 : localDistance / segmentLength;

              const startPoint = routeSegment[index];

              const endPoint = routeSegment[index + 1];

              const x =
                startPoint.x + (endPoint.x - startPoint.x) * localProgress;

              const y =
                startPoint.y + (endPoint.y - startPoint.y) * localProgress;

              setPlayerPosition({
                x,
                y,
              });

              break;
            }

            accumulatedDistance += segmentLength;
          }

          // ====================================================
          // FINAL
          // ====================================================

          if (progress < 1) {
            animationFrameRef.current = requestAnimationFrame(animate);

            return;
          }

          const finalPoint = routeSegment[routeSegment.length - 1];

          setPlayerPosition({
            x: finalPoint.x,
            y: finalPoint.y,
          });

          animationFrameRef.current = null;

          resolve();
        };

        animationFrameRef.current = requestAnimationFrame(animate);
      });
    },
    [],
  );

  // ==========================================================
  // VITÓRIA EM BATALHA
  // ==========================================================
  //
  // Por enquanto o botão "Vitória" chama esta função.
  //
  // Depois, o resultado real da batalha deverá chamar
  // esta mesma função.
  //
  // ==========================================================

  const handleBattleWin = async () => {
    if (isMoving) {
      return;
    }

    if (campaignCompleted) {
      toast('🏆 A campanha de Blackmoor já foi concluída!');

      return;
    }

    const currentPoint = CAMPAIGN_POINTS[currentStep];

    // ========================================================
    // CASTELO
    // ========================================================
    //
    // Se o jogador está no Castelo e vence,
    // a campanha termina.
    //
    // ========================================================

    if (currentPoint.isBoss) {
      setCompletedSteps((previousSteps) => {
        if (previousSteps.includes(currentPoint.id)) {
          return previousSteps;
        }

        return [...previousSteps, currentPoint.id];
      });

      setCampaignCompleted(true);

      toast.success('🏆 Você conquistou o Castelo de Blackmoor!', {
        duration: 5000,
      });

      return;
    }

    // ========================================================
    // PRÓXIMO PONTO
    // ========================================================

    const nextStep = currentStep + 1;

    const nextPoint = CAMPAIGN_POINTS[nextStep];

    if (!nextPoint) {
      return;
    }

    // ========================================================
    // INICIAR MOVIMENTO
    // ========================================================

    setIsMoving(true);

    toast.success(`⚔️ ${currentPoint.name} conquistado!`);

    // ========================================================
    // PERCORRER A ROTA
    // ========================================================

    await animatePlayerAlongRoute(currentPoint.pathIndex, nextPoint.pathIndex);

    // ========================================================
    // MARCAR LOCAL COMO CONCLUÍDO
    // ========================================================

    setCompletedSteps((previousSteps) => {
      if (previousSteps.includes(currentPoint.id)) {
        return previousSteps;
      }

      return [...previousSteps, currentPoint.id];
    });

    // ========================================================
    // ATUALIZAR LOCAL ATUAL
    // ========================================================

    setCurrentStep(nextStep);

    setIsMoving(false);

    // ========================================================
    // PRÓXIMA LOCALIZAÇÃO
    // ========================================================

    if (nextPoint.isBoss) {
      toast.success(
        '🏰 Você chegou ao Castelo! Prepare-se para a batalha final.',
        {
          duration: 5000,
        },
      );

      return;
    }

    toast.success(`📍 Você chegou a ${nextPoint.name}!`);
  };

  // ==========================================================
  // ABRIR BOLSA
  // ==========================================================

  const handleOpenBag = () => {
    navigate('/bag', {
      state: {
        fromMap: true,
      },
    });
  };

  // ==========================================================
  // ABRIR DECK
  // ==========================================================

  const handleOpenDeck = () => {
    const savedData = localStorage.getItem('characterData');

    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);

        const deckId = parsed.deckId;

        const classId = parsed.classId || parsed.className?.toLowerCase() || '';

        if (deckId) {
          navigate('/deck-view', {
            state: {
              deckId,
              className: classId,
              raceName: parsed.raceName || '',
              raceImage: parsed.raceImage || '',
              raceIcon: parsed.raceIcon || '',
            },
          });

          return;
        }
      } catch {
        // Ignora erro de leitura.
      }
    }

    toast('Nenhum deck encontrado');

    navigate('/deck-select');
  };

  // ==========================================================
  // BESTIÁRIO
  // ==========================================================

  const handleOpenBestiary = () => {
    toast('Bestiário em desenvolvimento', {
      duration: 2000,
    });
  };

  // ==========================================================
  // RENDERIZAR LOADING
  // ==========================================================

  if (isLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  // ==========================================================
  // LOCAL ATUAL
  // ==========================================================

  const currentPoint = CAMPAIGN_POINTS[currentStep];

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <Container>
      <MapContainer>
        {/* ================================================ */}
        {/* MAPA */}
        {/* ================================================ */}

        <MapBackground />

        <MapContent>
          {/* ============================================== */}
          {/* MENU */}
          {/* ============================================== */}

          <TopMenu>
            <MenuLeft>
              <MenuTitle>⚔️ Blackmoor</MenuTitle>
            </MenuLeft>
            <MenuRight>
              <MenuButton onClick={handleBattleWin} disabled={isMoving} $active>
                {isMoving ? '🚶 Caminhando...' : '⚔️ Vitória'}
              </MenuButton>
            </MenuRight>
          </TopMenu>

          {/* ============================================== */}
          {/* MAPA */}
          {/* ============================================== */}

          <Battlefield>
            <SideMenu />
            <RouteContainer>
              {/* ============================================ */}
              {/* SVG */}
              {/* ============================================ */}

              <RouteSVG viewBox="0 0 100 100" preserveAspectRatio="none">
                {/* ======================================== */}
                {/* CAMINHO COMPLETO */}
                {/* ======================================== */}

                <RouteLine d={fullPath} />

                {/* ======================================== */}
                {/* CAMINHO COMPLETADO */}
                {/* ======================================== */}

                <RouteLineCompleted d={completedPath} />
              </RouteSVG>

              {/* ============================================ */}
              {/* LOCAIS DA CAMPANHA */}
              {/* ============================================ */}

              {CAMPAIGN_POINTS.map((point, index) => {
                const isCurrent = index === currentStep;

                const isCompleted = completedSteps.includes(point.id);

                const isLocked = index > currentStep;

                return (
                  <RouteMarker
                    key={point.id}
                    $x={point.x}
                    $y={point.y}
                    $active={isCurrent}
                    $completed={isCompleted}
                    $locked={isLocked}
                  >
                    <MarkerDot
                      $active={isCurrent}
                      $completed={isCompleted}
                      $locked={isLocked}
                      $isBoss={point.isBoss === true}
                    />

                    <MarkerLabel
                      $active={isCurrent}
                      $completed={isCompleted}
                      $locked={isLocked}
                    >
                      {point.name}
                    </MarkerLabel>
                  </RouteMarker>
                );
              })}

              {/* ============================================ */}
              {/* JOGADOR */}
              {/* ============================================ */}

              <PlayerMarker
                $x={playerPosition.x}
                $y={playerPosition.y}
                $moving={isMoving}
              >
                <PlayerGlow />

                <PlayerIcon>⚔️</PlayerIcon>
              </PlayerMarker>
            </RouteContainer>
            <EnemyMenu />
          </Battlefield>

          {/* ============================================== */}
          {/* STATUS */}
          {/* ============================================== */}

          <CampaignStatus>
            <CampaignStatusTitle>
              {campaignCompleted ? '🏆 Campanha Concluída' : '📍 Local Atual'}
            </CampaignStatusTitle>

            <CampaignStatusText>
              {campaignCompleted
                ? 'Blackmoor foi conquistada!'
                : `${currentPoint.name}`}
            </CampaignStatusText>
          </CampaignStatus>
        </MapContent>
      </MapContainer>
    </Container>
  );
};

export default MapScreen;
