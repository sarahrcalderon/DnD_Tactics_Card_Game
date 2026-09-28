import { defaultOptions } from '../services/optionsService';
import { useOptions } from '../contexts/OptionsContext';
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Container,
  BackgroundImage,
  ContentWrapper,
  Header,
  Title,
  CloseButton,
  MainContent,
  Sidebar,
  SectionButton,
  Panel,
  SectionTitle,
  Actions,
  Button,
} from '../styles/optionsStyle';
import { OptionsData, OptionsSection } from '../types/options.types';
import { AudioSection } from '../components/options/AudioSection';
import { InterfaceSection } from '../components/options/InterfaceSection';
import { ControlsSection } from '../components/options/ControlsSection';
import { AccessibilitySection } from '../components/options/AcessibilitySection';
import { PerformanceSection } from '../components/options/performanceSection';
import { NetworkSection } from '../components/options/NetworkSection';
import { useAudio } from '../contexts/AudioContext';

interface SectionMap {
  [key: string]: {
    title: string;
    component: React.ReactNode;
  };
}

export const OptionsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { playSound } = useAudio();

  const { options, preview, save, discard, hasChanges } = useOptions();
  const [activeSection, setActiveSection] = useState<OptionsSection>('audio');

  useEffect(() => () => discard(), [discard]);

  const handleUpdate = <K extends Exclude<keyof OptionsData, 'language'>>(section: K, updates: Partial<OptionsData[K]>) => {
    preview({ ...options, [section]: { ...options[section], ...updates } });
  };

  const handleSave = (): boolean => {
    try {
      save();
      playSound('success');
      toast.success('Opcoes salvas com sucesso!');
      return true;
    } catch {
      toast.error('Erro ao salvar opcoes');
      return false;
    }
  };

  const handleReset = () => {
    if (window.confirm('Deseja restaurar todas as configuracoes padrao?')) {
      preview(defaultOptions);
      playSound('select');
      toast.success('Opcoes restauradas para o padrao');
    }
  };

  const returnToOrigin = () => {
    const origin = location.state as { returnTo?: string; returnState?: unknown } | null;
    navigate(origin?.returnTo || '/', { state: origin?.returnState });
  };

  const handleClose = () => {
    if (hasChanges && window.confirm('Salvar alteracoes antes de sair?')) {
      if (!handleSave()) return;
    } else discard();
    returnToOrigin();
  };

  const handleCancel = () => {
    discard();
    returnToOrigin();
  };

  const sections: SectionMap = {
    audio: {
      title: 'Áudio',
      component: <AudioSection />,
    },
    interface: {
      title: 'Interface',
      component: (
        <InterfaceSection
          interfaceOptions={options.interface || defaultOptions.interface}
          onUpdate={(updates) => handleUpdate('interface', updates)}
        />
      ),
    },
    controls: {
      title: 'Controles',
      component: (
        <ControlsSection
          controls={options.controls || defaultOptions.controls}
          onUpdate={(updates) => handleUpdate('controls', updates)}
        />
      ),
    },
    accessibility: {
      title: 'Acessibilidade',
      component: (
        <AccessibilitySection
          accessibility={options.accessibility || defaultOptions.accessibility}
          onUpdate={(updates) => handleUpdate('accessibility', updates)}
        />
      ),
    },
    performance: {
      title: 'Desempenho',
      component: (
        <PerformanceSection
          performance={options.performance || defaultOptions.performance}
          onUpdate={(updates) => handleUpdate('performance', updates)}
        />
      ),
    },
    network: {
      title: 'Rede',
      component: (
        <NetworkSection
          network={options.network || defaultOptions.network}
          onUpdate={(updates) => handleUpdate('network', updates)}
        />
      ),
    },
  };

  return (
    <Container>
      <BackgroundImage />

      <ContentWrapper>
        <Header>
          <Title>Opções</Title>
          <CloseButton aria-label="Fechar opcoes" onClick={handleClose}>✕</CloseButton>
        </Header>

        <MainContent>
          <Sidebar>
            {Object.entries(sections).map(([key, section]) => (
              <SectionButton
                key={key}
                active={activeSection === key}
                onClick={() => {
                  setActiveSection(key as OptionsSection);
                  playSound('click');
                }}
              >
                {section.title}
              </SectionButton>
            ))}
          </Sidebar>

          <Panel>
            <SectionTitle>{sections[activeSection].title}</SectionTitle>
            {sections[activeSection].component}
          </Panel>
        </MainContent>

        <Actions>
          <Button onClick={handleReset}>Restaurar padroes</Button>
          <Button variant="primary" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Salvar Opções
          </Button>
        </Actions>
      </ContentWrapper>
    </Container>
  );
};

export default OptionsPage;
