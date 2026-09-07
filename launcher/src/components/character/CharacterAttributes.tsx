import React from 'react';
import {
  AttributesSection,
  AttributesTitle,
  AttributeRow,
  AttributeLabel,
  AttributeValue,
  AttributeControls,
  AttributeButton,
} from '../../styles/attributeDistStyles';
import { Attributes, AttributeKey } from '../../types/character.types';
import {
  ATTRIBUTE_NAMES,
  ATTRIBUTE_SHORT,
  ATTRIBUTE_COLORS,
} from '../../data/classes';
import { getModifierDisplay } from '../../utils/characterStats';

interface CharacterAttributesProps {
  attributes: Attributes;
  baseAttributes: Attributes;
  pointsRemaining: number;
  maxAttribute?: number;
  isDisabled?: boolean;
  onAttributeChange: (key: AttributeKey, delta: number) => void;
}

const ATTRIBUTE_KEYS: AttributeKey[] = [
  'str',
  'dex',
  'con',
  'int',
  'wis',
  'cha',
];
const MAX_ATTRIBUTE = 20;

export const CharacterAttributes: React.FC<CharacterAttributesProps> = ({
  attributes,
  baseAttributes,
  pointsRemaining,
  maxAttribute = MAX_ATTRIBUTE,
  isDisabled = false,
  onAttributeChange,
}) => {
  return (
    <AttributesSection>
      <AttributesTitle>Atributos Principais</AttributesTitle>

      {ATTRIBUTE_KEYS.map((attribute) => {
        const label = ATTRIBUTE_NAMES[attribute];
        const short = ATTRIBUTE_SHORT[attribute];
        const color = ATTRIBUTE_COLORS[attribute];
        const baseValue = baseAttributes[attribute];
        const currentValue = attributes[attribute];
        const hasExtra = currentValue > baseValue;
        const modifier = getModifierDisplay(currentValue);

        return (
          <AttributeRow key={attribute}>
            <AttributeLabel>
              {short}
              <span
                style={{
                  fontSize: '0.55rem',
                  color: '#666',
                  display: 'block',
                }}
              >
                {label}
              </span>
            </AttributeLabel>
            <AttributeValue color={color} $highlight={hasExtra}>
              {currentValue}
            </AttributeValue>
            <span
              style={{
                fontSize: '0.7rem',
                color: '#aaa',
                minWidth: '30px',
              }}
            >
              ({modifier})
            </span>
            {hasExtra && (
              <span
                style={{
                  fontSize: '0.6rem',
                  color: '#2ecc71',
                  marginLeft: '2px',
                }}
              >
                (+{currentValue - baseValue})
              </span>
            )}
            <AttributeControls>
              <AttributeButton
                $variant="minus"
                disabled={isDisabled || currentValue <= baseValue}
                onClick={() => onAttributeChange(attribute, -1)}
              >
                −
              </AttributeButton>
              <AttributeButton
                $variant="plus"
                disabled={
                  isDisabled ||
                  pointsRemaining <= 0 ||
                  currentValue >= maxAttribute
                }
                onClick={() => onAttributeChange(attribute, 1)}
              >
                +
              </AttributeButton>
            </AttributeControls>
          </AttributeRow>
        );
      })}
    </AttributesSection>
  );
};
