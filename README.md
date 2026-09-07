# D&D Tactics Card Game

> Um jogo tático de cartas ambientado em fantasia medieval, que combina a construção estratégica de decks de *Magic: The Gathering* com o posicionamento e a tomada de decisão de RPGs táticos como *Final Fantasy Tactics*.

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-f0ad4e?style=flat-square)
![Frontend](https://img.shields.io/badge/frontend-React%20%2B%20TypeScript-61dafb?style=flat-square)
![Backend](https://img.shields.io/badge/backend-FastAPI-009688?style=flat-square)
![Licença](https://img.shields.io/badge/licença-não%20definida-lightgrey?style=flat-square)

## Índice

- [Visão geral](#visão-geral)
- [Experiência de jogo](#experiência-de-jogo)
- [Progressão e equipamentos](#progressão-e-equipamentos)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Arquitetura](#arquitetura)
- [Como executar](#como-executar)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [API](#api)
- [Roteiro de desenvolvimento](#roteiro-de-desenvolvimento)
- [Contribuindo](#contribuindo)
- [Aviso de propriedade intelectual](#aviso-de-propriedade-intelectual)

## Visão geral

**D&D Tactics Card Game** é uma experiência de TCG tático online. Cada partida une a leitura de cartas, a composição de personagens, a evolução por equipamentos e decisões de combate em um mundo de fantasia.

A jornada começa em **Blackmoor**. Ao concluir mapas e campanhas, o grupo desbloqueia novos locais, inimigos e desafios. As vitórias concedem recompensas que fortalecem o personagem e, por consequência, o desempenho do seu deck.

O projeto está em desenvolvimento ativo. O launcher já concentra a criação de personagem, distribuição de atributos, gerenciamento de decks, equipamentos, inventário e navegação de mapa; os modos de batalha e o multiplayer estão sendo preparados para a visão completa do jogo.

## Experiência de jogo

### Modos previstos

| Modo | Proposta |
| --- | --- |
| **Cooperativo online** | Um grupo de até cinco jogadores enfrenta uma pessoa que controla o deck inimigo da campanha escolhida. |
| **Solo** | O jogador enfrenta campanhas e desafios controlados pelo jogo. |
| **Campanhas por mapa** | Cada local possui identidade, inimigos, recompensas e um deck adversário próprios. |

### Ciclo principal

```text
Criar personagem → escolher deck → distribuir atributos → montar equipamentos
        ↓
selecionar mapa/campanha → jogar a partida → vencer o deck inimigo
        ↓
abrir baú → obter equipamento → fortalecer personagem e deck → desbloquear novos mapas
```

### Personagem, atributos e deck

- Escolha de classe, raça, divindade, deck e nome durante a criação.
- Distribuição de pontos entre atributos principais: Força, Destreza, Constituição, Inteligência, Sabedoria e Carisma.
- Cálculo de estatísticas derivadas, como defesa, iniciativa, vida, mana, crítico e pontos de ação.
- Dois tipos de deck disponíveis na proposta de jogo, permitindo estilos estratégicos distintos.
- O equipamento modifica atributos e estatísticas do personagem, impactando diretamente a eficiência do deck em combate.

## Progressão e equipamentos

Ao vencer uma partida, o jogador recebe um baú com equipamentos. Esses itens formam a base da progressão: aumentam os atributos e estatísticas do personagem e tornam o deck mais poderoso.

Além das recompensas de campanha, será possível negociar com o **Mercador**:

- comprar equipamentos e cartas especiais;
- vender itens que não fazem mais parte da construção desejada;
- encontrar cartas lendárias que não estão disponíveis nos decks iniciais.

### Hierarquia de equipamentos

| Rank | Tier | Identidade |
| ---: | --- | --- |
| 1 | Starter | Equipamento comum de aventureiro. |
| 1 | Basic | Primeiro passo de especialização. |
| 5 | Useful | Ainda fraco, mas com identidade própria. |
| 10 | Average | Equipamento funcional para composições consistentes. |
| 15 | Good | Equipamento de elite. |
| 20 | Good | Equipamento excepcional. |
| 20 | Very Good | Equipamento de alto nível. |
| 20 | Incredibly Good | Equipamento lendário. |

> Os nomes, valores de balanceamento e critérios de obtenção podem evoluir durante o desenvolvimento.

## Funcionalidades

### Disponíveis no launcher

- [x] Fluxo de criação de personagem.
- [x] Seleção de classe, raça, divindade, deck e nome.
- [x] Distribuição e persistência de atributos.
- [x] Geração e visualização de decks.
- [x] Cálculo de estatísticas derivadas do personagem.
- [x] Tela de equipamentos, itens iniciais e inventário.
- [x] Navegação de mapa com conteúdo de Blackmoor.
- [x] Persistência local do progresso do personagem.
- [x] API FastAPI com rotas iniciais para classes, raças, personagem e batalha.
- [x] Base de WebSocket para comunicação de jogo.

### Em evolução

- [ ] Batalhas táticas completas com regras de cartas.
- [ ] Salas, pareamento e sincronização para partidas cooperativas online.
- [ ] Controle do deck inimigo por um jogador no modo assimétrico.
- [ ] Modo solo completo.
- [ ] Baús, recompensas pós-partida e desbloqueio de mapas.
- [ ] Economia do Mercador e cartas lendárias exclusivas.
- [ ] Persistência em banco de dados, autenticação e contas de jogador.
- [ ] Testes automatizados e pipeline de integração contínua.

## Tecnologias

| Camada | Tecnologias |
| --- | --- |
| Interface | React 18, TypeScript, Vite, React Router, Styled Components |
| Experiência visual | Framer Motion, React Hot Toast |
| Comunicação HTTP | Axios |
| API | Python, FastAPI, Uvicorn, Pydantic |
| Tempo real | WebSockets |
| Aplicação desktop alternativa | Pygame e PyWebView |

## Arquitetura

```text
DnD_Tactics_Card_Game/
├── launcher/                  # Aplicação web React/Vite
│   ├── src/
│   │   ├── pages/             # Telas e fluxos do launcher
│   │   ├── components/        # Componentes reutilizáveis
│   │   ├── hooks/             # Estado e regras de interface
│   │   ├── services/          # Persistência local e carregadores
│   │   ├── data/              # Classes, equipamentos, inimigos e decks
│   │   └── utils/             # Cálculos de personagem e geração de deck
│   └── public/                # Imagens, sons e dados estáticos
├── backend/                   # API e domínio do jogo em Python
│   ├── api/                   # Rotas REST, middleware e WebSocket
│   ├── core/                  # Configuração e regras centrais
│   ├── models/                # Modelos de cartas, jogador e batalha
│   ├── data/                  # Dados iniciais do domínio
│   └── tests/                 # Estrutura de testes do backend
└── run_all.sh                 # Script de inicialização para ambientes Unix
```

## Como executar

### Pré-requisitos

- [Node.js](https://nodejs.org/) 18 ou superior e npm;
- [Python](https://www.python.org/) 3.10 ou superior;
- Git.

### 1. Clone o repositório

```bash
git clone <URL_DO_SEU_REPOSITORIO>
cd DnD_Tactics_Card_Game
```

### 2. Inicie o backend

No PowerShell:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn api.server:app --reload --host 0.0.0.0 --port 8000
```

O backend ficará disponível em `http://localhost:8000`.

### 3. Inicie o launcher

Em outro terminal:

```bash
cd launcher
npm install
npm run dev
```

O Vite inicia o launcher em `http://127.0.0.1:5173`.

### 4. Gere uma build de produção

```bash
cd launcher
npm run build
npm run preview
```

### Atalho para ambientes Unix

O script abaixo prepara dependências e inicia os serviços:

```bash
chmod +x run_all.sh
./run_all.sh
```

## Variáveis de ambiente

O launcher utiliza `launcher/.env` para definir a URL da API:

```env
VITE_API_URL=http://localhost:8000
```

As configurações do backend, como porta, modo de desenvolvimento, áudio e parâmetros de batalha, são lidas de `backend/.env`. Não envie arquivos com segredos para o repositório; crie um arquivo local a partir dos valores necessários para o seu ambiente.

## API

Com o servidor em execução, a documentação interativa do FastAPI está disponível em:

- Swagger UI: `http://localhost:8000/docs`
- OpenAPI JSON: `http://localhost:8000/openapi.json`
- Verificação de integridade: `http://localhost:8000/api/health`

Os módulos iniciais cobrem classes, raças, personagens, batalhas e comunicação por WebSocket. Consulte as rotas documentadas pelo Swagger para contratos e exemplos atualizados.

## Roteiro de desenvolvimento

1. Consolidar as regras de batalha por turnos e o motor de cartas.
2. Integrar progressão de campanha, baús e desbloqueio de mapas.
3. Implementar a economia do Mercador, incluindo itens e cartas lendárias.
4. Concluir os modos solo e cooperativo assimétrico.
5. Adicionar autenticação, persistência remota e infraestrutura multiplayer escalável.
6. Ampliar a cobertura de testes, observabilidade e preparação para lançamento.

## Contribuindo

Contribuições são bem-vindas. Para manter o projeto organizado:

1. Crie uma branch a partir da principal: `git checkout -b feat/minha-melhoria`.
2. Faça alterações pequenas, coesas e bem documentadas.
3. Execute a build do launcher antes de abrir um pull request: `cd launcher && npm run build`.
4. Descreva claramente o problema resolvido, a solução e como testá-la.

Para correções, inclua passos de reprodução. Para mecânicas de jogo, registre também o impacto esperado no balanceamento.

## Aviso de propriedade intelectual

Este é um projeto de fã e independente, sem afiliação oficial com a Wizards of the Coast, Dungeons & Dragons, *Magic: The Gathering* ou *Final Fantasy Tactics*. Todos os nomes, marcas e universos citados pertencem aos seus respectivos proprietários e são mencionados apenas como referência criativa.

Antes de qualquer distribuição comercial, revise a origem e os direitos de uso de todos os textos, imagens, sons, marcas e demais ativos do projeto.
