import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useOptions } from '../../contexts/OptionsContext';
import { matchesShortcut } from '../../services/optionsService';
import { API_URL } from '../../api/client';

const css = `
html[data-motion="off"] *, html[data-motion="off"] *::before, html[data-motion="off"] *::after {
  animation-duration: 0.001ms !important; animation-iteration-count: 1 !important;
  transition-duration: 0s !important; scroll-behavior: auto !important;
}
html[data-visual-quality="low"] *, html[data-visual-quality="low"] *::before, html[data-visual-quality="low"] *::after {
  box-shadow: none !important; text-shadow: none !important;
}
html[data-visual-quality="medium"] * { text-shadow: none !important; }
html[data-effect-quality="low"] *, html[data-effect-quality="medium"] * { backdrop-filter: none !important; }
html[data-effect-quality="low"] img { filter: none !important; }
html[data-reduce-effects="true"] [data-decorative] { display: none !important; }
html[data-tips="false"] [data-game-tip] { display: none !important; }
html[data-contrast="high"] #root :is(p, span, label, small, strong, h1, h2, h3, h4) { color: #fff !important; text-shadow: none !important; }
html[data-contrast="high"] #root :is(button, a, input, select) { color: #fff !important; background: #080808 !important; border-color: #fff !important; }
html[data-contrast="high"] #root :is(section, article, main) { background-color: #080808 !important; background-image: none !important; }
html[data-color-mode]:not([data-color-mode="none"]) #root :is(h1,h2,h3,h4,strong) { color: var(--accessible-accent) !important; }
html[data-color-mode]:not([data-color-mode="none"]) #root :is(button,a,input,select):focus-visible { outline: 3px solid var(--accessible-accent) !important; outline-offset: 3px; }
html[data-color-mode]:not([data-color-mode="none"]) #root button[aria-checked="true"] { background: var(--accessible-accent) !important; border: 2px solid white !important; }
`;

export function OptionsRuntime() {
  const { options } = useOptions();
  const location = useLocation();
  const navigate = useNavigate();
  const [ping, setPing] = useState<string>('Medindo…');

  useEffect(() => {
    const root = document.documentElement;
    root.lang = 'pt-BR';
    root.style.fontSize = `${options.interface.fontSize}px`;
    document.body.style.setProperty(
      'zoom',
      String(options.interface.uiScale / 100),
    );

    const reduced =
      options.accessibility.reduceMotion ||
      !options.interface.animations ||
      options.performance.lowPowerMode;

    root.dataset.motion = reduced ? 'off' : 'on';
    root.dataset.contrast = options.accessibility.highContrast
      ? 'high'
      : 'normal';
    root.dataset.colorMode = options.accessibility.colorblindMode;
    root.style.setProperty(
      '--accessible-accent',
      (
        {
          protanopia: '#6bdcff',
          deuteranopia: '#ffd36b',
          tritanopia: '#ff9cad',
        } as Record<string, string>
      )[options.accessibility.colorblindMode] || '#ffd700',
    );
    root.dataset.visualQuality = options.performance.lowPowerMode
      ? 'low'
      : options.performance.visualEffects;
    root.dataset.effectQuality = options.performance.lowPowerMode
      ? 'low'
      : options.performance.effectQuality;
    root.dataset.reduceEffects = String(
      options.performance.reduceParticles || options.performance.lowPowerMode,
    );
    root.dataset.tips = String(options.interface.showTips);

    const updateSpeed = () =>
      document.getAnimations().forEach((animation) => {
        animation.playbackRate = options.interface.animationSpeed;
      });

    updateSpeed();
    document.addEventListener('animationstart', updateSpeed, true);
    document.addEventListener('transitionrun', updateSpeed, true);

    return () => {
      document.removeEventListener('animationstart', updateSpeed, true);
      document.removeEventListener('transitionrun', updateSpeed, true);
    };
  }, [options]);

  useEffect(() => {
    if (!options.network.showPing) return;

    let disposed = false;
    let active: AbortController | undefined;

    const measure = async () => {
      if (document.hidden) return;

      active?.abort();
      const controller = new AbortController();
      active = controller;

      const timeout = window.setTimeout(() => controller.abort(), 5000);
      const start = performance.now();

      try {
        const response = await fetch(`${API_URL}/api/health`, {
          signal: controller.signal,
          cache: 'no-store',
        });
        if (!response.ok) throw new Error();
        if (!disposed) setPing(`${Math.round(performance.now() - start)} ms`);
      } catch {
        if (!disposed) setPing('Sem conexão');
      } finally {
        window.clearTimeout(timeout);
      }
    };

    void measure();
    const interval = window.setInterval(() => void measure(), 10000);

    return () => {
      disposed = true;
      active?.abort();
      window.clearInterval(interval);
    };
  }, [options.network.showPing]);

  useEffect(() => {
    const keydown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;

      if (
        event.defaultPrevented ||
        event.repeat ||
        location.pathname === '/options' ||
        target.closest(
          'input,textarea,select,[contenteditable="true"],[role="dialog"],[aria-modal="true"]',
        )
      ) {
        return;
      }

      const matches = (action: string) =>
        matchesShortcut(event, options.controls.shortcuts, action);

      if (matches('Opcoes')) {
        event.preventDefault();
        navigate('/options', {
          state: { returnTo: location.pathname, returnState: location.state },
        });
        return;
      }

      const inCampaign = [
        '/map',
        '/bestiary',
        '/bag',
        '/equipment',
        '/attribute-dist',
      ].includes(location.pathname);

      if (inCampaign) {
        const destination = matches('Mapa')
          ? '/map'
          : matches('Inventario')
            ? '/bag'
            : matches('Bestiario')
              ? '/bestiary'
              : null;

        if (destination && destination !== location.pathname) {
          event.preventDefault();
          navigate(destination, {
            state: {
              fromMap: true,
              returnTo: location.pathname,
              returnState: location.state,
            },
          });
          return;
        }
      }

      if (location.pathname === '/') return; // The launcher owns its selected menu item.

      const direction = matches('Mover para cima')
        ? -1
        : matches('Mover para baixo')
          ? 1
          : 0;

      if (direction) {
        const elements = [
          ...document.querySelectorAll<HTMLElement>(
            'button:not(:disabled),a[href],[tabindex="0"]',
          ),
        ].filter(
          (element) =>
            element.getClientRects().length && !element.closest('[inert]'),
        );

        if (!elements.length) return;

        event.preventDefault();
        const index = elements.indexOf(document.activeElement as HTMLElement);
        elements[
          (index + direction + elements.length) % elements.length
        ].focus();
      } else if (matches('Acao principal') && target.matches('button,a')) {
        event.preventDefault();
        target.click();
      }
    };

    window.addEventListener('keydown', keydown);
    return () => window.removeEventListener('keydown', keydown);
  }, [options.controls.shortcuts, location, navigate]);

  return (
    <>
      <style>{css}</style>
      {options.network.showPing && (
        <output
          aria-label="Latência do servidor"
          style={{
            position: 'fixed',
            right: 12,
            bottom: 12,
            zIndex: 10000,
            padding: '6px 10px',
            background: '#080d16',
            color: '#fff',
            border: '1px solid #b5a36f',
            borderRadius: 4,
            fontSize: '0.75rem',
            pointerEvents: 'none',
          }}
        >
          Servidor: {ping}
        </output>
      )}
    </>
  );
}
