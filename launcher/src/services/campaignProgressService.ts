export interface CampaignProgress {
  currentStep: number;
  completedSteps: number[];
  campaignCompleted: boolean;
}

const BLACKMOOR_PROGRESS_KEY = 'blackmoorCampaignProgress';

export const getCampaignProgressStorageKey = (): string => {
  try {
    const characterData = localStorage.getItem('characterData');
    const saveId = characterData ? JSON.parse(characterData).saveId : null;

    return `${BLACKMOOR_PROGRESS_KEY}:${saveId || 'new-character'}`;
  } catch {
    return `${BLACKMOOR_PROGRESS_KEY}:new-character`;
  }
};

export const loadCampaignProgress = (): CampaignProgress => {
  try {
    const storedProgress = localStorage.getItem(getCampaignProgressStorageKey());
    if (!storedProgress) return { currentStep: 0, completedSteps: [], campaignCompleted: false };

    const parsed = JSON.parse(storedProgress);
    return {
      currentStep: typeof parsed.currentStep === 'number' && parsed.currentStep >= 0
        ? parsed.currentStep
        : 0,
      completedSteps: Array.isArray(parsed.completedSteps) ? parsed.completedSteps : [],
      campaignCompleted: parsed.campaignCompleted === true,
    };
  } catch {
    return { currentStep: 0, completedSteps: [], campaignCompleted: false };
  }
};
