import { useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCharacterCreation } from '../contexts/CharacterCreationContext';


export const useDeityNavigation = () => {
  const navigate = useNavigate();
  const { state } = useCharacterCreation();
  const { classId, raceId, raceName, raceImage, raceIcon } = state;


  useEffect(() => {
    if (!classId || !raceId) {
      navigate('/race-select', {
        replace: true,
      });

      return;
    }


  }, [classId, raceId, navigate]);


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




  return {


    classId,

    className,


    raceId,

    raceName,

    raceImage,

    raceIcon,



    handleBack,

  };
};
