import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    const tracks: HTMLAudioElement[] = [];
    (window as any).__audioTracks = tracks;
    window.Audio = function (src?: string) {
      const audio = document.createElement('audio');
      if (src) audio.src = src;
      let paused = true;
      Object.defineProperty(audio, 'paused', { get: () => paused });
      audio.play = async () => { paused = false; };
      audio.pause = () => { paused = true; };
      tracks.push(audio);
      return audio;
    } as typeof Audio;
  });
});

test('audio volumes apply to the launcher, previews, save, cancel and reload', async ({ page }) => {
  await page.goto('/');
  await page.getByText('Opções', { exact: true }).click();
  await expect(page).toHaveURL(/options/);
  const music = page.getByRole('slider', { name: 'Musica', exact: true });
  await music.focus();
  await page.keyboard.press('Home');
  await expect.poll(() => page.evaluate(() => (window as any).__audioTracks
    .filter((audio: HTMLAudioElement) => audio.src.endsWith('menu_music.mp3'))
    .every((audio: HTMLAudioElement) => audio.volume === 0 && audio.paused))).toBe(true);
  await page.getByRole('button', { name: 'Salvar Opções' }).click();
  await page.getByRole('slider', { name: 'Efeitos Sonoros', exact: true }).focus();
  await page.keyboard.press('End');
  await page.getByRole('button', { name: 'Testar efeitos' }).click();
  await expect.poll(() => page.evaluate(() => (window as any).__audioTracks.at(-1).volume)).toBeCloseTo(0.8);
  await page.getByRole('slider', { name: 'Efeitos Sonoros', exact: true }).focus();
  await page.keyboard.press('Home');
  await expect.poll(() => page.evaluate(() => (window as any).__audioTracks
    .filter((audio: HTMLAudioElement) => audio.src.endsWith('deck_choice.mp3'))
    .every((audio: HTMLAudioElement) => audio.volume === 0 && audio.paused))).toBe(true);
  await page.getByRole('slider', { name: 'Interface', exact: true }).focus();
  await page.keyboard.press('Home');
  const count = await page.evaluate(() => (window as any).__audioTracks.length);
  await page.getByRole('button', { name: 'Testar interface' }).click();
  expect(await page.evaluate(() => (window as any).__audioTracks.length)).toBe(count);
  await page.getByRole('button', { name: 'Salvar Opções' }).click();
  await page.reload();
  await expect(music).toHaveValue('0');
  await expect(page.getByRole('slider', { name: 'Interface', exact: true })).toHaveValue('0');
  await music.focus();
  await page.keyboard.press('End');
  await page.getByRole('button', { name: 'Cancelar', exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
  await expect.poll(() => page.evaluate(() => (window as any).__audioTracks
    .filter((audio: HTMLAudioElement) => audio.src.endsWith('menu_music.mp3'))
    .every((audio: HTMLAudioElement) => audio.volume === 0 && audio.paused))).toBe(true);
  expect(await page.evaluate(() => (window as any).__audioTracks.filter((audio: HTMLAudioElement) => audio.src.endsWith('menu_music.mp3')).length)).toBe(1);
});

test('interface, accessibility, performance, mute and ping persist and reset', async ({ page }) => {
  await page.route('**/api/health', route => route.fulfill({ json: { status: 'ok' } }));
  await page.goto('/options');
  await page.getByRole('switch', { name: 'Ativar som' }).click();
  await page.getByRole('button', { name: 'Interface', exact: true }).click();
  await page.getByRole('slider', { name: 'Tamanho da Fonte' }).focus();
  await page.keyboard.press('End');
  await expect(page.locator('html')).toHaveCSS('font-size', '24px');
  await page.getByRole('switch', { name: 'Mostrar Dicas' }).click();
  await page.getByRole('button', { name: 'Acessibilidade', exact: true }).click();
  await page.getByRole('switch', { name: 'Alto Contraste' }).click();
  await page.getByRole('switch', { name: 'Reduzir Movimento' }).click();
  await page.getByRole('combobox', { name: 'Modo Daltonico' }).selectOption('protanopia');
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'off');
  await expect(page.locator('html')).toHaveAttribute('data-contrast', 'high');
  await expect(page.locator('html')).toHaveAttribute('data-color-mode', 'protanopia');
  await page.getByRole('button', { name: 'Desempenho', exact: true }).click();
  await page.getByRole('switch', { name: 'Modo de Baixo Consumo' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-effect-quality', 'low');
  await page.getByRole('button', { name: 'Rede', exact: true }).click();
  await page.getByRole('switch', { name: 'Mostrar Ping' }).click();
  await expect(page.getByLabel('Latência do servidor')).toContainText('ms');
  await page.getByRole('button', { name: 'Salvar Opções' }).click();
  await page.reload();
  await expect(page.getByRole('switch', { name: 'Ativar som' })).not.toBeChecked();
  await expect(page.locator('html')).toHaveAttribute('data-tips', 'false');
  await expect(page.locator('html')).toHaveCSS('font-size', '24px');
  page.once('dialog', dialog => dialog.accept());
  await page.getByRole('button', { name: 'Restaurar padroes' }).click();
  await expect(page.locator('html')).toHaveCSS('font-size', '16px');
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'on');
  await expect(page.getByLabel('Latência do servidor')).toHaveCount(0);
  await page.getByRole('button', { name: 'Salvar Opções' }).click();
  await page.reload();
  await expect(page.getByRole('switch', { name: 'Ativar som' })).toBeChecked();
});

test('partial legacy preferences load safely and rebound shortcuts work', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.setItem('gameOptions', JSON.stringify({ audio: { volumeMaster: 0 } })));
  await page.goto('/options');
  await expect(page.getByRole('slider', { name: 'Volume Geral' })).toHaveValue('0');
  await page.getByRole('button', { name: 'Controles', exact: true }).click();
  await page.getByRole('button', { name: 'Alterar atalho: Opcoes', exact: true }).click();
  await page.keyboard.press('p');
  await page.getByRole('button', { name: 'Salvar Opções' }).click();
  await page.getByRole('button', { name: 'Cancelar' }).click();
  await page.keyboard.press('p');
  await expect(page).toHaveURL(/options/);
  await page.getByRole('button', { name: 'Interface', exact: true }).click();
  await expect(page.getByRole('combobox', { name: 'Idioma' })).toBeDisabled();
});
