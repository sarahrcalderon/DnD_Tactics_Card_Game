import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  useLocation,
  useNavigate,
} from 'react-router-dom';

// ============================================================
// TIPOS
// ============================================================

type DeityNavigationState = {
  classId?: string;

  raceId?: string;

  raceName?: string;

  raceImage?: string;

  raceIcon?: string;
};

type NavigateToDeckSelectionParams = {
  deityId: string;

  deityName: string;
};

// ============================================================
// HOOK
// ============================================================

export const useDeityNavigation = () => {
  const location = useLocation();

  const navigate = useNavigate();

  // ==========================================================
  // ESTADOS
  // ==========================================================

  const [classId, setClassId] =
    useState<string | null>(null);

  const [raceId, setRaceId] =
    useState<string | null>(null);

  const [raceName, setRaceName] =
    useState<string | null>(null);

  const [raceImage, setRaceImage] =
    useState<string | null>(null);

  const [raceIcon, setRaceIcon] =
    useState<string | null>(null);

  // ==========================================================
  // RECUPERAR DADOS DA NAVEGAÇÃO
  // ==========================================================

  useEffect(() => {
    const state =
      location.state as DeityNavigationState | null;

    // ========================================================
    // VALIDAÇÃO
    // ========================================================

    if (!state?.classId) {
      navigate('/race-select', {
        replace: true,
      });

      return;
    }

    // ========================================================
    // CLASSE
    // ========================================================

    setClassId(state.classId);

    // ========================================================
    // RAÇA
    // ========================================================

    setRaceId(state.raceId || null);

    setRaceName(state.raceName || null);

    setRaceImage(state.raceImage || null);

    setRaceIcon(state.raceIcon || null);
  }, [location.state, navigate]);

  // ==========================================================
  // NOME FORMATADO DA CLASSE
  // ==========================================================

  const className = useMemo(() => {
    if (!classId) {
      return '';
    }

    return (
      classId.charAt(0).toUpperCase() +
      classId.slice(1)
    );
  }, [classId]);

  // ==========================================================
  // VOLTAR
  // ==========================================================

  const handleBack = useCallback(() => {
    navigate('/race-select', {
      state: {
        classId,

        raceId,
      },
    });
  }, [
    navigate,

    classId,

    raceId,
  ]);

  // ==========================================================
  // NAVEGAR PARA DECK
  // ==========================================================

  const navigateToDeckSelection = useCallback(
    ({
      deityId,
      deityName,
    }: NavigateToDeckSelectionParams) => {
      navigate('/deck-select', {
        state: {
          classId,

          raceId,
          raceName,
          raceImage,
          raceIcon,

          deityId,
          deityName,
        },
      });
    },
    [
      navigate,

      classId,

      raceId,
      raceName,
      raceImage,
      raceIcon,
    ],
  );

  // ==========================================================
  // RETORNO
  // ==========================================================

  return {


    classId,

    className,


    raceId,

    raceName,

    raceImage,

    raceIcon,



    handleBack,

    navigateToDeckSelection,
  };
};