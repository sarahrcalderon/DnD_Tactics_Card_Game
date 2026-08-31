// launcher/src/hooks/useCharacterAttributes.ts
import { useState, useCallback, useMemo } from 'react';
import { Attributes, DerivedStats } from '../types/character.types';
import { CLASS_BASE_ATTRIBUTES } from '../data/classes';
import { calculateDerivedStats } from '../utils/characterStats';

const MAX_ATTRIBUTE = 20;
const TOTAL_POINTS = 5;
const DEFAULT_CLASS_ID = 'paladino';

export const useCharacterAttributes = (classId: string, initialAttributes?: Attributes) => {
  const baseAttributes = useMemo(() => {
    return CLASS_BASE_ATTRIBUTES[classId] || CLASS_BASE_ATTRIBUTES[DEFAULT_CLASS_ID];
  }, [classId]);

  const [attributes, setAttributes] = useState<Attributes>(() => ({
    ...(initialAttributes || baseAttributes),
  }));

  const [pointsRemaining, setPointsRemaining] = useState<number>(TOTAL_POINTS);

  const derivedStats = useMemo(() => {
    return calculateDerivedStats(attributes);
  }, [attributes]);

  const canChange = useMemo(() => {
    return pointsRemaining > 0;
  }, [pointsRemaining]);

  const handleAttributeChange = useCallback(
    (key: keyof Attributes, delta: number) => {
      setAttributes((current: Attributes) => {
        const currentValue = current[key];
        const baseValue = baseAttributes[key];
        const newValue = currentValue + delta;

        if (delta < 0 && newValue < baseValue) {
          return current;
        }

        if (newValue > MAX_ATTRIBUTE) {
          return current;
        }

        if (delta > 0 && pointsRemaining <= 0) {
          return current;
        }

        setPointsRemaining((prev: number) => prev - delta);
        return {
          ...current,
          [key]: newValue,
        };
      });
    },
    [baseAttributes, pointsRemaining]
  );

  const resetAttributes = useCallback(() => {
    setAttributes({ ...baseAttributes });
    setPointsRemaining(TOTAL_POINTS);
  }, [baseAttributes]);

  const loadAttributes = useCallback((newAttributes: Attributes, newPointsRemaining: number) => {
    setAttributes({ ...newAttributes });
    setPointsRemaining(newPointsRemaining);
  }, []);

  return {
    attributes,
    baseAttributes,
    pointsRemaining,
    derivedStats,
    canChange,
    handleAttributeChange,
    resetAttributes,
    loadAttributes,
    setPointsRemaining,
  };
};