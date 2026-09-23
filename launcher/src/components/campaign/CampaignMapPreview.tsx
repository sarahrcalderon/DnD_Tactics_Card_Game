import React, { useMemo } from 'react';
import { loadCampaignProgress } from '../../services/campaignProgressService';
import {
  CampaignLocation,
  CampaignLocationLabel,
  CampaignLocationName,
  CampaignMapButton,
  CampaignMapHeader,
  CampaignMapPanel,
  CampaignMapStatus,
  CampaignMapTitle,
  CampaignMarker,
  CampaignOpenHint,
} from '../../styles/campaignMapPreviewStyles';

const BLACKMOOR_POINTS = [
  { id: 1, name: 'Vilarejo', x: 18.47, y: 70.97 },
  { id: 2, name: 'Bosque', x: 39.53, y: 35.89 },
  { id: 3, name: 'Ruínas', x: 62.67, y: 41.94 },
  { id: 4, name: 'Vale da Sombra', x: 62.29, y: 22.18 },
  { id: 5, name: 'Ladrões da Montanha', x: 73.2, y: 30.34 },
  { id: 6, name: 'Guardas do Castelo', x: 75.28, y: 21.27 },
  { id: 7, name: 'Castelo', x: 81.02, y: 10.79 },
] as const;

interface CampaignMapPreviewProps {
  onOpenCampaign: () => void;
}

export const CampaignMapPreview: React.FC<CampaignMapPreviewProps> = ({ onOpenCampaign }) => {
  const progress = useMemo(() => loadCampaignProgress(), []);
  const currentPoint = BLACKMOOR_POINTS[Math.min(progress.currentStep, BLACKMOOR_POINTS.length - 1)];

  return (
    <CampaignMapPanel aria-labelledby="campaign-map-title">
      <CampaignMapHeader>
        <CampaignMapTitle id="campaign-map-title">Mapa</CampaignMapTitle>
        <CampaignMapStatus>Campanha atual: Blackmoor</CampaignMapStatus>
      </CampaignMapHeader>
      <CampaignMapButton type="button" onClick={onOpenCampaign} aria-label="Abrir mapa da campanha Blackmoor">
        {BLACKMOOR_POINTS.map((point, index) => (
          <CampaignMarker key={point.id} $x={point.x} $y={point.y} $active={!progress.campaignCompleted && index === progress.currentStep} $completed={progress.completedSteps.includes(point.id)} />
        ))}
        <CampaignLocation>
          <CampaignLocationLabel>{progress.campaignCompleted ? 'Campanha concluída' : 'Você está em'}</CampaignLocationLabel>
          <CampaignLocationName>{progress.campaignCompleted ? 'Castelo de Blackmoor' : currentPoint.name}</CampaignLocationName>
        </CampaignLocation>
        <CampaignOpenHint>Ver campanha →</CampaignOpenHint>
      </CampaignMapButton>
    </CampaignMapPanel>
  );
};
