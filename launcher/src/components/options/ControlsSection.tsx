import toast from 'react-hot-toast';
import React, { useState } from 'react';
import {
  OptionGroup,
  OptionLabel,
  OptionDescription,
  Slider,
  SliderValue,
  ShortcutGrid,
  ShortcutItem,
  ShortcutAction,
  ShortcutKey,
  Row,
} from '../../styles/optionsStyle';
import { ControlsOptions, Shortcut } from '../../types/options.types';

interface ControlsSectionProps {
  controls: ControlsOptions;
  onUpdate: (updates: Partial<ControlsOptions>) => void;
}

export const ControlsSection: React.FC<ControlsSectionProps> = ({
  controls,
  onUpdate,
}) => {
  const [recordingShortcut, setRecordingShortcut] = useState<string | null>(
    null,
  );

  const handleShortcutClick = (action: string) => {
    setRecordingShortcut(action);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (recordingShortcut && e.key) {
      e.preventDefault();
      e.stopPropagation();
      if (e.key === 'Escape') { setRecordingShortcut(null); return; }
      if (['Control', 'Shift', 'Alt', 'Meta'].includes(e.key)) return;
      const modifiers: string[] = [];
      if (e.ctrlKey) modifiers.push('Ctrl');
      if (e.shiftKey) modifiers.push('Shift');
      if (e.altKey) modifiers.push('Alt');
      if (e.metaKey) modifiers.push('Meta');
      if (controls.shortcuts.some(shortcut => shortcut.action !== recordingShortcut && shortcut.key.toLowerCase() === e.key.toLowerCase() && shortcut.modifiers.slice().sort().join('+') === modifiers.slice().sort().join('+'))) {
        toast.error('Esta tecla ja esta em uso por outro atalho.');
        return;
      }

      const updatedShortcuts = controls.shortcuts.map((shortcut) => {
        if (shortcut.action === recordingShortcut) {
          return {
            ...shortcut,
            key: e.key,
            modifiers: modifiers,
          };
        }
        return shortcut;
      });

      onUpdate({ shortcuts: updatedShortcuts });
      setRecordingShortcut(null);
      e.preventDefault();
    }
  };

  return (
    <div onKeyDown={handleKeyDown}>
      <OptionGroup>
        <OptionLabel>Configurar Atalhos</OptionLabel>
        <OptionDescription>
          Clique em um atalho para redefinir. Escape cancela. Cima/baixo navegam pelos menus; acao principal confirma. Mapa, inventario e bestiario funcionam nas telas da campanha.
        </OptionDescription>
        <ShortcutGrid>
          {controls.shortcuts.map((shortcut) => (
            <ShortcutItem key={shortcut.action}>
              <ShortcutAction>{shortcut.action}</ShortcutAction>
              <ShortcutKey
                aria-label={`Alterar atalho: ${shortcut.action}`}
                onBlur={() => setRecordingShortcut(null)}
                onClick={() => handleShortcutClick(shortcut.action)}
                style={{
                  background:
                    recordingShortcut === shortcut.action
                      ? '#646cff'
                      : 'rgba(255, 255, 255, 0.1)',
                }}
              >
                {recordingShortcut === shortcut.action
                  ? 'Pressione uma tecla...'
                  : `${shortcut.modifiers.join('+')}${shortcut.modifiers.length > 0 ? '+' : ''}${shortcut.key}`}
              </ShortcutKey>
            </ShortcutItem>
          ))}
        </ShortcutGrid>
      </OptionGroup>

      <OptionGroup>
        <OptionLabel>Sensibilidade</OptionLabel>
        <Row>
          <Slider
            type="range"
            min="0.5"
            max="5"
            step="0.1"
            aria-label="Sensibilidade"
            disabled
            value={controls.sensitivity}
            onChange={(e) => onUpdate({ sensitivity: Number(e.target.value) })}
          />
          <SliderValue>{controls.sensitivity}</SliderValue>
        </Row>
        <OptionDescription>O ponteiro usa a sensibilidade do sistema. Esta interface nao tem camera controlada pelo mouse.</OptionDescription>
      </OptionGroup>
    </div>
  );
};
