import { useState, useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';
import type { AttributeKey, Attributes } from '../types/character.types';
import { MAX_ATTRIBUTE, TOTAL_POINTS } from '../data/attributeDistData';

interface UseAttributeDistributionParams {
  baseAttributes: Attributes;
  initialAttributes?: Attributes;
  initialPoints?: number;
}

export const useAttributeDistribution = ({
  baseAttributes,
  initialAttributes,
  initialPoints = TOTAL_POINTS,
}: UseAttributeDistributionParams) => {
  const [attributes, setAttributes] = useState<Attributes>(() => ({
    ...(initialAttributes || baseAttributes),
  }));
  const [pointsRemaining, setPointsRemaining] = useState<number>(initialPoints);

  const handleAttributeChange = useCallback(
    (attribute: AttributeKey, delta: number) => {
      const currentValue = attributes[attribute];
      const baseValue = baseAttributes[attribute];

      if (delta > 0) {
        if (pointsRemaining <= 0) {
          toast.error('Sem pontos disponíveis!');
          return;
        }
        if (currentValue >= MAX_ATTRIBUTE) {
          toast.error('Atributo não pode ultrapassar 20!');
          return;
        }
        setAttributes((prev) => ({
          ...prev,
          [attribute]: prev[attribute] + 1,
        }));
        setPointsRemaining((prev) => prev - 1);
        return;
      }

      // delta < 0 (remover)
      if (currentValue <= baseValue) {
        return;
      }
      setAttributes((prev) => ({
        ...prev,
        [attribute]: prev[attribute] - 1,
      }));
      setPointsRemaining((prev) => prev + 1);
    },
    [attributes, baseAttributes, pointsRemaining]
  );

  const resetPoints = useCallback(() => {
    setAttributes({ ...baseAttributes });
    setPointsRemaining(TOTAL_POINTS);
  }, [baseAttributes]);

  const loadAttributes = useCallback(
    (newAttributes: Attributes, newPoints: number) => {
      setAttributes({ ...newAttributes });
      setPointsRemaining(newPoints);
    },
    []
  );

  return {
    attributes,
    pointsRemaining,
    handleAttributeChange,
    resetPoints,
    loadAttributes,
    setPointsRemaining,
  };
};