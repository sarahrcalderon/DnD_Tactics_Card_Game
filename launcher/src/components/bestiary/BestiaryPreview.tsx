import {
  BestiaryPreviewButton,
  CampaignMapHeader,
  CampaignMapPanel,
  CampaignMapStatus,
  CampaignMapTitle,
  CampaignOpenHint,
} from '../../styles/campaignMapPreviewStyles';

interface BestiaryPreviewProps {
  onOpen: () => void;
}

export function BestiaryPreview({ onOpen }: BestiaryPreviewProps) {
  return (
    <CampaignMapPanel aria-labelledby="bestiary-preview-title">
      <CampaignMapHeader>
        <CampaignMapTitle id="bestiary-preview-title">
          Bestiário
        </CampaignMapTitle>
        <CampaignMapStatus>Criaturas </CampaignMapStatus>
      </CampaignMapHeader>
      <BestiaryPreviewButton
        type="button"
        onClick={onOpen}
        aria-label="Abrir bestiário"
      >
        <CampaignOpenHint>Explorar criaturas →</CampaignOpenHint>
      </BestiaryPreviewButton>
    </CampaignMapPanel>
  );
}
