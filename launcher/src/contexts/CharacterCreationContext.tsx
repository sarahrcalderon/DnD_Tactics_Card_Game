import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import { Attributes, CharacterCreationState } from '../types/character.types';
import { CLASS_BASE_ATTRIBUTES } from '../data/classes';

const DEFAULT_ATTRIBUTES: Attributes = {
  str: 8,
  dex: 8,
  con: 8,
  int: 8,
  wis: 8,
  cha: 8,
};

interface CharacterCreationContextType {
  state: CharacterCreationState;
  setClass: (classId: string, className: string) => void;
  setRace: (
    raceId: string,
    raceName: string,
    raceImage: string,
    raceIcon: string,
  ) => void;
  setDeity: (deityId: string, deityName: string) => void;
  setDeck: (deckId: string, deckName: string) => void;
  setName: (name: string) => void;
  setAttributes: (attributes: Attributes) => void;
  updateAttribute: (key: keyof Attributes, value: number) => void;
  setPointsRemaining: (points: number) => void;
  resetAttributes: () => void;
  saveCharacter: (saveId?: string) => void;
  loadCharacter: (data: CharacterCreationState) => void;
  reset: () => void;
}

const CharacterCreationContext = createContext<
  CharacterCreationContextType | undefined
>(undefined);

const TOTAL_POINTS = 5;

export const CharacterCreationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<CharacterCreationState>({
    step: 'class',
    classId: null,
    raceId: null,
    raceName: null,
    raceImage: null,
    raceIcon: null,
    deityId: null,
    deityName: null,
    deckId: null,
    deckName: null,
    characterName: null,
    attributes: { ...DEFAULT_ATTRIBUTES },
    pointsRemaining: TOTAL_POINTS,
    isSaved: false,
    saveId: null,
    equipment: {},
  });

  const setClass = useCallback((classId: string, className: string) => {
    const baseAttrs =
      CLASS_BASE_ATTRIBUTES[classId] || CLASS_BASE_ATTRIBUTES.paladino;
    setState((prev) => ({
      ...prev,
      classId,
      className,
      attributes: { ...baseAttrs },
      pointsRemaining: TOTAL_POINTS,
      step: 'race',
    }));
  }, []);

  const setRace = useCallback(
    (raceId: string, raceName: string, raceImage: string, raceIcon: string) => {
      setState((prev) => ({
        ...prev,
        raceId,
        raceName,
        raceImage,
        raceIcon,
        step: 'deity',
      }));
    },
    [],
  );

  const setDeity = useCallback((deityId: string, deityName: string) => {
    setState((prev) => ({
      ...prev,
      deityId,
      deityName,
      step: 'deck',
    }));
  }, []);

  const setDeck = useCallback((deckId: string, deckName: string) => {
    setState((prev) => ({
      ...prev,
      deckId,
      deckName,
      step: 'name',
    }));
  }, []);

  const setName = useCallback((name: string) => {
    setState((prev) => ({
      ...prev,
      characterName: name,
      step: 'attributes',
    }));
  }, []);

  const setAttributes = useCallback((attributes: Attributes) => {
    setState((prev) => ({
      ...prev,
      attributes,
    }));
  }, []);

  const updateAttribute = useCallback(
    (key: keyof Attributes, value: number) => {
      setState((prev) => ({
        ...prev,
        attributes: {
          ...prev.attributes,
          [key]: value,
        },
      }));
    },
    [],
  );

  const setPointsRemaining = useCallback((points: number) => {
    setState((prev) => ({
      ...prev,
      pointsRemaining: points,
    }));
  }, []);

  const resetAttributes = useCallback(() => {
    const classId = state.classId || 'paladino';
    const baseAttrs =
      CLASS_BASE_ATTRIBUTES[classId] || CLASS_BASE_ATTRIBUTES.paladino;
    setState((prev) => ({
      ...prev,
      attributes: { ...baseAttrs },
      pointsRemaining: TOTAL_POINTS,
    }));
  }, [state.classId]);

  const saveCharacter = useCallback((saveId?: string) => {
    setState((prev) => ({
      ...prev,
      isSaved: true,
      saveId: saveId || prev.saveId,
      step: 'attributes',
    }));
  }, []);

  const loadCharacter = useCallback((data: CharacterCreationState) => {
    setState({
      ...data,
      step: 'attributes',
    });
  }, []);

  const reset = useCallback(() => {
    setState({
      step: 'class',
      classId: null,
      raceId: null,
      raceName: null,
      raceImage: null,
      raceIcon: null,
      deityId: null,
      deityName: null,
      deckId: null,
      deckName: null,
      characterName: null,
      attributes: { ...DEFAULT_ATTRIBUTES },
      pointsRemaining: TOTAL_POINTS,
      isSaved: false,
      saveId: null,
      equipment: {},
    });
  }, []);

  return (
    <CharacterCreationContext.Provider
      value={{
        state,
        setClass,
        setRace,
        setDeity,
        setDeck,
        setName,
        setAttributes,
        updateAttribute,
        setPointsRemaining,
        resetAttributes,
        saveCharacter,
        loadCharacter,
        reset,
      }}
    >
      {children}
    </CharacterCreationContext.Provider>
  );
};

export const useCharacterCreation = () => {
  const context = useContext(CharacterCreationContext);
  if (!context) {
    throw new Error(
      'useCharacterCreation must be used within CharacterCreationProvider',
    );
  }
  return context;
};
