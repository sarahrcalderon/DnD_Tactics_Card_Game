import React from 'react';
import {
  PointsAvailable,
  PointsText,
  PointsValue,
} from '../../styles/attributeDistStyles';

interface PointsPanelProps {
  pointsRemaining: number;
  totalPoints?: number;
  onReset?: () => void;
  isDisabled?: boolean;
}

export const PointsPanel: React.FC<PointsPanelProps> = ({
  pointsRemaining,
  totalPoints = 5,
  onReset,
  isDisabled = false,
}) => {
  return (
    <PointsAvailable>
      <PointsText>
        Pontos disponíveis:{' '}
        <PointsValue color={pointsRemaining > 0 ? '#ffd700' : '#2ecc71'}>
          {pointsRemaining}
        </PointsValue>
      </PointsText>
      {onReset && (
        <div style={{ marginTop: '8px' }}>
          <button
            onClick={onReset}
            disabled={isDisabled}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: '8px',
              padding: '6px 16px',
              color: isDisabled ? '#555' : '#dcdce5',
              fontSize: '0.75rem',
              cursor: isDisabled ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              opacity: isDisabled ? 0.5 : 1,
            }}
            onMouseEnter={(e) => {
              if (!isDisabled) {
                e.currentTarget.style.background = 'rgba(255, 215, 0, 0.1)';
                e.currentTarget.style.borderColor = '#ffd700';
                e.currentTarget.style.color = '#ffd700';
              }
            }}
            onMouseLeave={(e) => {
              if (!isDisabled) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                e.currentTarget.style.color = '#dcdce5';
              }
            }}
          >
            Resetar Pontos
          </button>
        </div>
      )}
    </PointsAvailable>
  );
};
