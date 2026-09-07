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
| 1 | Inicial | Equipamento comum de aventureiro. |
| 1 | Básico | Primeiro passo de especialização. |
| 5 | Útil | Ainda fraco, mas com identidade própria. |
| 10 | Mediano | Equipamento funcional para composições consistentes. |
| 15 | Bom | Equipamento de elite. |
| 20 | Bom +1 | Equipamento excepcional. |
| 20 | Muito bom +2 | Equipamento de alto nível. |
| 20 | Lendário +3 | Equipamento lendário. |

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


## Roteiro de desenvolvimento

1. Consolidar as regras de batalha por turnos e o motor de cartas.
2. Integrar progressão de campanha, baús e desbloqueio de mapas.
3. Implementar a economia do Mercador, incluindo itens e cartas lendárias.
4. Concluir os modos solo e cooperativo assimétrico.
5. Adicionar autenticação, persistência remota e infraestrutura multiplayer escalável.
6. Ampliar a cobertura de testes, observabilidade e preparação para lançamento.



## Aviso de propriedade intelectual

Este é um projeto de fã e independente, sem afiliação oficial com a Wizards of the Coast, Dungeons & Dragons, *Magic: The Gathering* ou *Final Fantasy Tactics*. Todos os nomes, marcas e universos citados pertencem aos seus respectivos proprietários e são mencionados apenas como referência criativa.

