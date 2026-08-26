import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { PerformanceSection } from '../components/options/PerformanceSection';
import { NetworkSection } from '../components/options/NetworkSection';
import { useAudio } from '../contexts/AudioContext';

const defaultOptions: OptionsData = {
  language: 'pt-BR',
  audio: {
    volumeMaster: 80,
    volumeMusic: 70,
    volumeSFX: 80,
    volumeInterface: 60,
  },
  interface: {
    language: 'pt-BR',
    uiScale: 100,
    fontSize: 16,
    showTips: true,
    animations: true,
    animationSpeed: 1,
  },
  controls: {
    shortcuts: [
      { action: 'Mover para cima', key: 'w', modifiers: [] },
      { action: 'Mover para baixo', key: 's', modifiers: [] },
      { action: 'Mover para esquerda', key: 'a', modifiers: [] },
      { action: 'Mover para direita', key: 'd', modifiers: [] },
      { action: 'Acao principal', key: 'Enter', modifiers: [] },
      { action: 'Acao secundaria', key: 'e', modifiers: [] },
      { action: 'Inventario', key: 'i', modifiers: [] },
      { action: 'Habilidades', key: 'k', modifiers: [] },
      { action: 'Mapa', key: 'm', modifiers: [] },
      { action: 'Pausa', key: 'Escape', modifiers: [] },
    ],
    sensitivity: 1,
  },
  accessibility: {
    colorblindMode: 'none',
    highContrast: false,
    reduceMotion: false,
  },
  performance: {
    fpsLimit: 60,
    lowPowerMode: false,
    visualEffects: 'high',
    effectQuality: 'high',
    reduceParticles: false,
  },
  network: {
    region: 'auto',
    server: 'auto',
    showPing: false,
  },
};

interface SectionMap {
  [key: string]: {
    title: string;
    component: React.ReactNode;
  };
}

export const OptionsPage = () => {
  const navigate = useNavigate();
  const { playSound } = useAudio();
  const [options, setOptions] = useState<OptionsData>(defaultOptions);
  const [activeSection, setActiveSection] = useState<OptionsSection>('audio');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const savedOptions = localStorage.getItem('gameOptions');
    if (savedOptions) {
      try {
        const parsed = JSON.parse(savedOptions);
        if (parsed && typeof parsed === 'object') {
          setOptions(parsed);
        }
      } catch (error) {
        console.error('Erro ao carregar opcoes:', error);
      }
    }
  }, []);

  const handleUpdate = (section: keyof OptionsData, updates: any) => {
    setOptions((prev) => {
      const currentSection = prev[section] || {};
      return {
        ...prev,
        [section]: {
          ...currentSection,
          ...updates,
        },
      };
    });
    setHasChanges(true);
  };

  const handleSave = () => {
    try {
      localStorage.setItem('gameOptions', JSON.stringify(options));
      setHasChanges(false);
      playSound('success');
      toast.success('Opcoes salvas com sucesso!');
    } catch (error) {
      playSound('error');
      toast.error('Erro ao salvar opcoes');
      console.error('Erro ao salvar:', error);
    }
  };

  const handleReset = () => {
    if (window.confirm('Deseja restaurar todas as configuracoes padrao?')) {
      setOptions(defaultOptions);
      setHasChanges(true);
      playSound('select');
      toast.success('Opcoes restauradas para o padrao');
    }
  };

  const handleClose = () => {
    if (hasChanges) {
      if (
        window.confirm(
          'Voce tem alteracoes nao salvas. Deseja salvar antes de sair?',
        )
      ) {
        handleSave();
      }
    }
    playSound('click');
    navigate('/');
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
          <CloseButton onClick={handleClose}>✕</CloseButton>
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
          <Button variant="primary" onClick={handleClose}>
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
