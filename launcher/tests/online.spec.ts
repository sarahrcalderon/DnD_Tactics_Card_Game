import {
  test,
  expect,
  type APIRequestContext,
  type Browser,
  type Page,
} from '@playwright/test';
import { randomUUID } from 'node:crypto';

const api = 'http://127.0.0.1:8011';

async function account(
  request: APIRequestContext,
  name: string,
  champion = true,
) {
  const suffix = randomUUID().slice(0, 8);
  const response = await request.post(`${api}/auth/register`, {
    data: {
      username: `${name}-${suffix}`,
      email: `${suffix}@example.test`,
      password: 'browser-test-password',
    },
  });

  await expect(response).toBeOK();

  const result = await response.json();
  const headers = { Authorization: `Bearer ${result.access_token}` };

  let characterId: string | null = null;

  if (champion) {
    const character = await request.post(`${api}/loadouts/characters`, {
      headers,
      data: {
        name: `Aria-${suffix}`,
        class_id: 'paladino',
        race_id: 'humano',
      },
    });

    await expect(character).toBeOK();
    characterId = (await character.json()).id;
  }

  const deck = await request.post(`${api}/loadouts/decks`, {
    headers,
    data: {
      name: `Deck-${suffix}`,
      side: champion ? 'CHAMPION' : 'ENEMY',
      class_id: champion ? 'paladino' : null,
      card_ids: ['p_002', 'p_002', 'p_002', 'p_002', 'p_001'],
    },
  });

  await expect(deck).toBeOK();

  return {
    ...result,
    headers,
    characterId,
    deckId: (await deck.json()).id,
  };
}

async function enter(
  browser: Browser,
  identity: Awaited<ReturnType<typeof account>>,
  path = '/online',
) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });

  await context.addInitScript(
    token => sessionStorage.setItem('dnd.online.token', token),
    identity.access_token,
  );

  const page = await context.newPage();
  await page.goto(`http://127.0.0.1:5175${path}`, {
    waitUntil: 'domcontentloaded',
  });

  return { context, page };
}

test('cadastro, personagem, deck e criação do lobby preservam o launcher local', async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));

  await page.goto('/');
  await expect(page.getByText('Carregar Jogo', { exact: true })).toBeVisible();
  await page.getByText('Jogar online', { exact: true }).click();
  await expect(page).toHaveURL(/\/login$/);
  await page.getByRole('link', { name: 'Criar conta', exact: true }).click();

  const suffix = randomUUID().slice(0, 8);

  await page.getByLabel('Nome de jogador').fill(`Viajante-${suffix}`);
  await page.getByLabel('E-mail', { exact: true }).fill(`${suffix}@example.test`);
  await page.getByLabel('Senha', { exact: true }).fill('browser-test-password');
  await page.getByRole('button', { name: 'Criar conta', exact: true }).click();
  await expect(
    page.getByRole('heading', { name: 'O chamado da aventura' }),
  ).toBeVisible();

  await page.getByRole('link', { name: 'Personagem', exact: true }).click();
  await page.getByLabel('Nome do personagem').fill(`Lyria-${suffix}`);
  await page
    .getByRole('combobox', { name: 'Classe', exact: true })
    .selectOption('paladino');
  await page
    .getByRole('combobox', { name: 'Raça', exact: true })
    .selectOption('humano');
  await page
    .getByRole('button', { name: 'Criar personagem', exact: true })
    .click();
  await expect(
    page.getByRole('heading', { name: `Lyria-${suffix}` }),
  ).toBeVisible();

  await page.getByRole('link', { name: 'Deck', exact: true }).click();
  await page.getByLabel('Nome do deck').fill(`Grimório-${suffix}`);
  await page
    .getByRole('combobox', { name: 'Classe', exact: true })
    .selectOption('paladino');

  for (let i = 0; i < 5; i++) {
    await page
      .getByRole('button', { name: 'Adicionar Golpe Justo', exact: true })
      .click();
  }

  await page.getByRole('button', { name: 'Salvar deck' }).click();
  await expect(
    page.getByRole('heading', { name: `Grimório-${suffix}` }),
  ).toBeVisible();

  await page.getByRole('link', { name: 'Jogar', exact: true }).click();
  await page.getByRole('link', { name: 'Criar partida', exact: true }).click();
  await expect(
    page.getByRole('button', { name: 'Criar partida', exact: true }),
  ).toBeEnabled();
  await page.getByRole('button', { name: 'Criar partida', exact: true }).click();
  await expect(
    page.getByText('Conectado à partida', { exact: true }),
  ).toBeVisible();
  await expect(page.getByRole('article')).toHaveCount(5);
  await expect(
    page.getByRole('button', { name: 'Iniciar partida', exact: true }),
  ).toBeDisabled();

  await page.getByRole('button', { name: 'Estou pronto', exact: true }).click();
  await expect(
    page.getByRole('button', { name: 'Não estou pronto', exact: true }),
  ).toBeVisible();

  await page.screenshot({
    path: testInfo.outputPath('lobby-initial.png'),
    fullPage: true,
  });

  await page.getByRole('button', { name: 'Sair da conta' }).click();
  await expect(page).toHaveURL(/\/login$/);
  await page.reload();
  await expect(
    page.getByRole('heading', { name: 'Bem-vindo, aventureiro' }),
  ).toBeVisible();

  expect(errors).toEqual([]);
});

test('cinco jogadores: amizade, convites, reconexão ao lobby e início sincronizado', async ({
  browser,
  request,
}, testInfo) => {
  const enemy = await account(request, 'Inimigo', false);

  const champions = [];

  for (let i = 0; i < 4; i++) {
    champions.push(await account(request, `Campeao${i + 1}`));
  }

  const host = await enter(browser, enemy, '/online/friends');
  const clients: { context: typeof host.context; page: Page }[] = [];
  const errors: string[] = [];

  host.page.on('pageerror', error => errors.push(error.message));

  try {
    await host.page.getByLabel('E-mail do amigo').fill(champions[0].user.email);
    await host.page
      .getByRole('button', { name: 'Enviar solicitação' })
      .click();
    await expect(host.page.getByRole('status')).toContainText(
      'Solicitação enviada',
    );

    clients.push(await enter(browser, champions[0], '/online/friends'));
    await clients[0].page
      .getByRole('button', { name: 'Aceitar', exact: true })
      .click();
    await expect(
      clients[0].page.getByRole('button', { name: 'Remover amigo' }),
    ).toBeVisible();

    for (const champion of champions.slice(1)) {
      const sent = await request.post(`${api}/friends/requests`, {
        headers: enemy.headers,
        data: { receiver_email: champion.user.email },
      });

      await expect(sent).toBeOK();

      const accepted = await request.post(
        `${api}/friends/requests/${(await sent.json()).id}/accept`,
        { headers: champion.headers },
      );

      await expect(accepted).toBeOK();
    }

    await host.page.getByRole('link', { name: 'Jogar', exact: true }).click();
    await host.page
      .getByRole('link', { name: 'Criar partida', exact: true })
      .click();
    await host.page.getByRole('button', { name: /^Inimigo/ }).click();
    await host.page
      .getByRole('button', { name: 'Criar partida', exact: true })
      .click();
    await expect(
      host.page.getByText('Conectado à partida', { exact: true }),
    ).toBeVisible();

    const lobbyUrl = host.page.url();

    for (let i = 0; i < 4; i++) {
      await host.page
        .getByRole('combobox', { name: 'Amigo', exact: true })
        .selectOption(champions[i].user.id);
      await host.page
        .getByRole('button', { name: 'Enviar convite', exact: true })
        .click();
      await expect(host.page.getByRole('status')).toContainText(
        'Convite enviado',
      );

      const client =
        i === 0
          ? clients[0]
          : await enter(browser, champions[i], '/online/invites');

      if (i > 0) clients.push(client);
      else
        await client.page
          .getByRole('link', { name: 'Convites', exact: true })
          .click();

      await expect(
        client.page.getByText(`${enemy.user.username} convidou você`, {
          exact: true,
        }),
      ).toBeVisible();

      await client.page
        .getByRole('button', { name: 'Preparar entrada' })
        .click();
      await client.page
        .getByRole('button', { name: 'Aceitar e entrar' })
        .click();
      await expect(
        client.page.getByText('Conectado à partida', { exact: true }),
      ).toBeVisible();
      await expect(
        host.page.getByRole('article', { name: `Vaga do campeão ${i + 1}` }),
      ).toContainText(champions[i].user.username);
    }

    await expect(
      host.page.getByRole('heading', { name: 'Campeões · 4 / 4' }),
    ).toBeVisible();
    await expect(
      host.page.getByRole('button', { name: 'Iniciar partida', exact: true }),
    ).toBeDisabled();

    for (const client of [host, ...clients]) {
      await client.page
        .getByRole('button', { name: 'Estou pronto', exact: true })
        .click();
    }

    await expect(
      host.page.getByRole('button', { name: 'Iniciar partida', exact: true }),
    ).toBeEnabled();

    await clients[3].page.close();
    await expect(
      host.page.getByRole('article', { name: 'Vaga do campeão 4' }),
    ).toContainText('Desconectado');
    await expect(
      host.page.getByRole('button', { name: 'Iniciar partida', exact: true }),
    ).toBeDisabled();

    clients[3].page = await clients[3].context.newPage();
    await clients[3].page.goto(lobbyUrl);
    await expect(
      host.page.getByRole('button', { name: 'Iniciar partida', exact: true }),
    ).toBeEnabled();

    await host.page.screenshot({
      path: testInfo.outputPath('lobby-five-players.png'),
      fullPage: true,
    });

    await host.page
      .getByRole('button', { name: 'Iniciar partida', exact: true })
      .click();

    for (const client of [host, ...clients]) {
      await expect(
        client.page.getByRole('heading', { name: 'A batalha começou' }),
      ).toBeVisible();
    }

    expect(errors).toEqual([]);
  } finally {
    for (const client of [host, ...clients]) {
      await client.context.close();
    }
  }
});

test('erros de rede, sessão expirada e layout estreito', async ({
  browser,
  request,
}, testInfo) => {
  const identity = await account(request, 'Mobile');
  const { context, page } = await enter(browser, identity);

  try {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.route(`${api}/friends**`, route => route.abort());
    await page.getByRole('link', { name: 'Amigos', exact: true }).click();
    await expect(page.getByRole('alert')).toContainText(
      'Não foi possível alcançar o servidor',
    );
    await page.unroute(`${api}/friends**`);
    await page.getByRole('button', { name: 'Tentar novamente' }).click();
    await expect(page.getByRole('alert')).toHaveCount(0);

    await page.getByRole('link', { name: 'Jogar', exact: true }).click();
    await page.screenshot({
      path: testInfo.outputPath('menu-mobile.png'),
      fullPage: true,
    });

    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);

    await page.route(`${api}/auth/me`, route =>
      route.fulfill({ status: 401, json: { detail: 'Sessão expirada.' } }),
    );
    await page.reload();
    await expect(page).toHaveURL(/\/login$/);
  } finally {
    await context.close();
  }
});

test('login apresenta falhas e retorna à rota protegida solicitada', async ({
  page,
  request,
}) => {
  const identity = await account(request, 'Login');

  await page.goto('/online/create');
  await expect(page).toHaveURL(/\/login$/);

  await page.getByLabel('E-mail', { exact: true }).fill(identity.user.email);
  await page.getByLabel('Senha', { exact: true }).fill('wrong-password');
  await page.getByRole('button', { name: 'Entrar', exact: true }).click();
  await expect(page.getByRole('alert')).toBeVisible();

  await page.getByLabel('Senha', { exact: true }).fill('browser-test-password');
  await page.getByRole('button', { name: 'Entrar', exact: true }).click();
  await expect(page).toHaveURL(/\/online\/create$/);
  await expect(
    page.getByRole('heading', { name: 'Uma nova expedição' }),
  ).toBeVisible();
});