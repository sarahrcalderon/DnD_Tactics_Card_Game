import styled from 'styled-components';
import { typography } from './typography';

export const CampaignMapPanel = styled.section`
  margin-top: 14px;
  overflow: hidden;
  border: 1px solid rgba(198, 151, 68, 0.42);
  background: linear-gradient(145deg, rgba(37, 39, 45, 0.97), rgba(14, 17, 23, 0.99));
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.035), 0 8px 28px rgba(0, 0, 0, 0.25);
`;

export const CampaignMapHeader = styled.div`
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 14px;
  padding: 14px 16px 12px;
  border-bottom: 1px solid rgba(220, 181, 105, 0.18);
`;

export const CampaignMapTitle = styled.h2`
  margin: 0;
  color: #e9cf93;
  ${typography.sectionTitle};
  font-size: 0.95rem;
  text-transform: uppercase;
`;

export const CampaignMapStatus = styled.span`
  color: #a7a297;
  ${typography.caption};
  text-align: right;
`;

export const CampaignMapButton = styled.button`
  position: relative;
  display: block;
  width: 100%;
  min-height: 220px;
  overflow: hidden;
  padding: 0;
  border: 0;
  color: inherit;
  text-align: left;
  cursor: pointer;
  background: url('/assets/images/maps/mapa_blackmoor.png') center / cover no-repeat;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, rgba(5, 8, 13, 0.42), transparent 45%), linear-gradient(0deg, rgba(5, 8, 13, 0.68), transparent 46%);
    transition: background 180ms ease;
  }

  &:hover::before { background: linear-gradient(90deg, rgba(5, 8, 13, 0.24), transparent 55%), linear-gradient(0deg, rgba(5, 8, 13, 0.62), transparent 50%); }
  &:focus-visible { outline: 2px solid #f2cf7d; outline-offset: -4px; }
`;

export const CampaignLocation = styled.div`
  position: absolute;
  z-index: 2;
  left: 16px;
  bottom: 14px;
  display: flex;
  flex-direction: column;
  gap: 3px;
`;

export const CampaignLocationLabel = styled.span`
  color: #bbb4a5;
  ${typography.caption};
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export const CampaignLocationName = styled.strong`
  color: #fff0b8;
  ${typography.itemName};
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.9);
`;

export const CampaignOpenHint = styled.span`
  position: absolute;
  z-index: 2;
  right: 16px;
  bottom: 16px;
  color: #f1d58f;
  ${typography.caption};
  opacity: 0.9;
`;

export const CampaignMarker = styled.span<{ $x: number; $y: number; $active: boolean; $completed: boolean }>`
  position: absolute;
  z-index: 2;
  left: ${({ $x }) => $x}%;
  top: ${({ $y }) => $y}%;
  width: ${({ $active }) => ($active ? '13px' : '8px')};
  height: ${({ $active }) => ($active ? '13px' : '8px')};
  transform: translate(-50%, -50%);
  border: 2px solid ${({ $active }) => ($active ? '#fff1a6' : 'rgba(255,255,255,0.52)')};
  border-radius: 50%;
  background: ${({ $active, $completed }) => ($active ? '#ffd700' : $completed ? '#43c777' : 'rgba(9, 11, 16, 0.78)')};
  box-shadow: ${({ $active }) => ($active ? '0 0 18px rgba(255, 215, 0, 0.95)' : '0 1px 4px rgba(0, 0, 0, 0.8)')};
`;
