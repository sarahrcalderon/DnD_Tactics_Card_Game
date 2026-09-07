import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { DeityNavigationState,
  NavigateToDeckSelectionParams,
} from '../types/deityNavigation.type';


export const useDeityNavigation = () => {
  const location = useLocation();

  const navigate = useNavigate();

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


  useEffect(() => {
    const state =
      location.state as DeityNavigationState | null;

    if (!state?.classId) {
      navigate('/race-select', {
        replace: true,
      });

      return;
    }


    setClassId(state.classId);

    setRaceId(state.raceId || null);

    setRaceName(state.raceName || null);

    setRaceImage(state.raceImage || null);

    setRaceIcon(state.raceIcon || null);
  }, [location.state, navigate]);


  const className = useMemo(() => {
    if (!classId) {
      return '';
    }

    return (
      classId.charAt(0).toUpperCase() +
      classId.slice(1)
    );
  }, [classId]);


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