# Arquitetura do Backend

O backend utiliza a direção de dependências da **Clean Architecture**:

```text
api (rotas FastAPI e modelos de requisição)
                 |
                 v
application (casos de uso e DTOs independentes de framework)
                 |
                 v
domain (entidades, regras, exceções e ports)
                 ^
                 |
infrastructure (sessão em memória e adaptadores de dados estáticos)
```

`api` é o adaptador da camada de apresentação. As rotas traduzem aspectos relacionados ao HTTP em DTOs, chamam um caso de uso e convertem erros esperados do domínio em respostas HTTP.

As rotas não devem acessar diretamente módulos de dados, o singleton do jogo ou entidades do jogo.

`application` contém a orquestração dos casos de uso relacionados a personagens, batalhas e catálogos. Essa camada depende apenas dos contratos do domínio.

Os DTOs dessa camada são `dataclasses` simples; os modelos Pydantic permanecem em `api/models`.

`domain` expõe o modelo do jogo independente de framework e seus respectivos erros.

O mecanismo de combate existente (`core`), as cartas (`models`), o deck e os módulos de jogador representam a implementação já estabelecida das regras do jogo.

As fachadas do domínio expõem esses componentes para as novas camadas, preservando os imports legados já testados e utilizados pelo jogo.

`infrastructure` fornece os adaptadores.

`InMemoryGameSessionRepository` é a opção atual de persistência, enquanto `StaticCatalogRepository` adapta os dados atuais dos catálogos Python.

Um banco de dados ou catálogo externo pode substituir qualquer um deles implementando a mesma pequena interface de métodos e alterando apenas o `container.py`.

## Adicionando uma funcionalidade

1. Coloque uma regra de jogo ou entidade no modelo de jogo voltado ao domínio.
2. Adicione um DTO de entrada/saída independente de framework e um caso de uso dentro de `application`.
3. Defina um `port` quando o caso de uso precisar de armazenamento ou de um serviço externo.
4. Implemente o `port` em `infrastructure` e faça sua configuração em `container.py`.
5. Mantenha validações específicas do FastAPI e códigos de status HTTP dentro de `api`.

Isso mantém as regras de negócio independentes do FastAPI, do Pydantic e de uma futura implementação de banco de dados.

## Fase 8: Multiplayer via WebSocket

`/ws/matches/{match_id}` utiliza `api/websocket/match_ws.py` para transporte e validação.

`MatchRealtimeService` orquestra os eventos de presença e lobby por meio do `MatchService` existente.

Seu `port` `MatchConnection` mantém o FastAPI fora da camada de aplicação.

O container mantém uma única instância do serviço de tempo real por processo do servidor.

O endpoint `/ws/game` existente permanece como um endpoint legado separado para partidas locais. Clientes online devem utilizar o endpoint autenticado de partidas.

Após abrir o socket, envie a primeira mensagem dentro de **10 segundos**:

```json
{
  "type": "authenticate",
  "token": "<access_token retornado pelo login>"
}
```

O servidor identifica o usuário a partir do token e verifica sua participação na partida antes de enviar qualquer dado relacionado à partida.

Uma falha de autenticação envia um `error` e fecha a conexão com o código `4401`.

Caso o usuário não seja participante da partida ou a partida não esteja disponível, a conexão é encerrada com o código `4403`.

Tokens não são aceitos em URLs.

Os clientes devem utilizar **WSS** ao se conectar a um servidor em produção.

### Comandos suportados após a autenticação

```json
{"type": "get_state"}
{"type": "set_ready", "ready": true}
{"type": "set_ready", "ready": false}
{"type": "start_match"}
{"type": "ping"}
```

A resposta inicial é `match_state`.

As notificações possíveis são:

- `player_connected`
- `player_disconnected`
- `player_joined`
- `player_ready`
- `player_unready`
- `match_started`

Cada notificação inclui `match_id`, o `user_id` do usuário responsável pela ação e um snapshot do lobby específico para o destinatário dentro de `data`.

`get_state` retorna um novo `match_state`.

`ping` retorna `pong`.

Comandos inválidos retornam:

```json
{
  "type": "error",
  "code": "invalid_message",
  "message": "..."
}
```

A conexão não é encerrada nesses casos.

Falhas do domínio utilizam os códigos:

- `not_found`
- `conflict`
- `invalid_action`

Campos relacionados à identidade e campos desconhecidos enviados nos comandos são rejeitados.

### Snapshots da partida

Os snapshots expõem:

- slots dos participantes;
- lados das equipes;
- estado de prontidão (`readiness`);
- presença;
- referências dos personagens.

Somente a referência do deck pertencente ao destinatário é incluída.

Na Fase 9, o snapshot também inclui a batalha online e a mão do próprio destinatário. Mãos alheias, ordem dos decks e a sessão local continuam privadas.

As salas suportam **um inimigo e até quatro campeões**, utilizando as regras de participação já existentes.

### Integração entre HTTP e WebSocket

As rotas HTTP responsáveis por definir o estado de pronto e iniciar partidas utilizam o mesmo serviço de tempo real.

Ao aceitar um convite, o evento `player_joined` é publicado.

Ao desconectar, apenas a conexão é removida.

Quando a última conexão de um usuário é encerrada, seu estado de presença é alterado. Isso não remove o participante da partida e também não encerra a partida.

Ao abrir novamente um socket autenticado, o cliente recebe o snapshot atual da partida, incluindo a batalha quando disponível no processo.

Falhas no envio de mensagens possuem limites definidos e as conexões problemáticas são removidas sem bloquear indefinidamente os clientes saudáveis.

As operações de presença, prontidão, início e combate são serializadas individualmente por sala.

### Limitações atuais da Fase 8

Esta fase deve ser executada utilizando **apenas um worker do servidor**.

As conexões e os locks das salas são mantidos em memória, enquanto os registros das partidas permanecem armazenados no PostgreSQL.

Reiniciar o processo faz com que as conexões sejam perdidas.

O estado de presença persistido, isoladamente, não pode autorizar o início de uma partida.

Os seguintes recursos ainda não foram implementados nesta fase:

- presença compartilhada entre processos;
- sistema de `pub/sub`;
- recuperação persistente de batalhas;
- política completa de reconexão.

Será necessária uma estratégia de sincronização entre processos antes de habilitar múltiplos workers.

## Fase 9 — integração com a Battle existente

O container conecta `MatchRealtimeService` a `MatchBattleService`. Antes de mudar
a partida para `IN_PROGRESS`, o servidor resolve as seleções persistidas de cada
participante e prepara uma `MatchBattle`. Se uma seleção estiver ausente, não
pertencer ao jogador ou for incompatível, a partida permanece no lobby.
`match_started` passa a incluir a batalha em `data.battle`, seguido de
`turn_started` e `battle_state_updated`.

`MatchBattle` estende a `Battle` existente e reutiliza a execução de cartas,
custos, dano, efeitos, descarte e destruição. Os pontos de extensão acrescentados
ao motor tratam apenas participantes do turno, próximo jogador, remoção de carta
do tabuleiro e verificação de vitória. O comportamento local continua coberto
pelos testes anteriores. `Board` e `DeckManager` não foram modificados.

Cada participante possui um `PlayerState` e `DeckManager` próprios. `MatchBoard`
compõe instâncias do `Board` existente, preservando cinco slots por jogador.
Cartas recebem IDs de instância únicos ao entrar na batalha. O dono público da
carta ativa é o UUID do usuário, evitando colisões entre cartas de mesmo catálogo.

### Personagens e decks persistidos

As tabelas `characters` e `decks` pertencem a usuários e são criadas pela migração
`20260923_04`. Para preparar outro ambiente, execute em `backend`:

```powershell
../venv/Scripts/python.exe -m alembic upgrade head
```

Todas as rotas abaixo exigem o mesmo Bearer token da autenticação:

| Método | Rota | Finalidade |
| --- | --- | --- |
| GET | `/loadouts/catalog` | Cartas executáveis disponíveis no backend |
| POST / GET | `/loadouts/characters` | Criar / listar personagens do usuário |
| POST / GET | `/loadouts/decks` | Criar / listar decks do usuário |

Exemplo de personagem:

```json
{"name":"Aria","class_id":"paladino","race_id":"humano"}
```

Exemplos de decks:

```json
{"name":"Proteção","side":"CHAMPION","class_id":"paladino","card_ids":["p_001","p_002","p_d_002"]}
{"name":"Inimigo","side":"ENEMY","card_ids":["p_d_001","p_d_002","m_d_001"]}
```

Use os UUIDs retornados em `character_id` e `deck_id` na criação da partida ou
aceitação do convite. IDs de saves locais não identificam esses registros.
O servidor valida propriedade, lado, classe, tamanho de 1 a 40 cartas e IDs do
catálogo. Cada cópia de uma carta ganha seu próprio ID durante a batalha.

A criação online usa os valores iniciais do modelo `Character`; os recursos de
batalha reutilizam os construtores do `BattleService`. O cliente não pode enviar
HP, dano, custo ou definições arbitrárias de efeitos. Os personagens e decks
locais existentes continuam com seu fluxo original, sem migração automática.

O catálogo inicial reutiliza `data/cards.py`: apenas definições com ataque,
defesa ou efeitos implementados são oferecidas para batalha. O conteúdo atual
contém cartas de paladino e mago; o deck inimigo pode selecionar essas cartas
executáveis, sem restrição de classe. Não foram inventados monstros, efeitos ou
progressão para preencher as lacunas do catálogo. A ampliação do conteúdo e a
integração do construtor completo do cliente continuam pendentes.

### Comandos de combate

Após autenticar e iniciar a partida:

```json
{"type":"play_card","card_id":"<ID da instância na sua mão>","target_player_id":"<UUID adversário>"}
{"type":"play_card","card_id":"<ID da sua carta>","target_player_id":"<UUID adversário>","target_card_id":"<ID da carta ativa adversária>"}
{"type":"attack","target_player_id":"<UUID adversário>"}
{"type":"defend"}
{"type":"end_turn"}
```

O servidor valida participação, presença, partida ativa, jogador do turno, mão e
alvo. O alvo ofensivo precisa ser um adversário vivo; com mais de um adversário,
é obrigatório selecionar `target_player_id`. Efeitos próprios continuam usando
as regras do motor. `target_card_id` identifica a carta ativa para destruição.
Custos de `attack` e `defend` seguem exatamente o motor existente, que não cobra
AP dessas duas ações; o custo das cartas continua validado por `Battle`.

Os eventos adicionais são `card_played`, `card_effect_applied`, `card_destroyed`,
`turn_changed`, `turn_started`, `battle_state_updated` e `game_finished`.
Cada evento inclui um snapshot filtrado em `data`; eventos de ações incluem
`action` com os IDs públicos, dano direto quando aplicável e efeitos aplicados.
`user_id` no envelope identifica quem realizou a ação. O jogador que deve agir
está em `data.battle.turn.user_id`, junto de `player_id`, `side` e `number`.

O turno inicia no inimigo e percorre os campeões por slot, ignorando derrotados.
A alternância já funciona com um a quatro campeões para evitar limitar a sessão
a dois participantes. O inimigo vence somente quando todos os campeões forem
derrotados; a derrota do inimigo resulta em vitória de `CHAMPIONS`. O servidor
persiste `FINISHED`, `finished_at` e `winner_side` e avisa todos os conectados.

As ações são executadas em uma cópia da sessão, sob o lock da partida. Falhas de
validação, execução ou persistência do resultado não publicam alterações parciais.
O snapshot expõe recursos, efeitos e cartas ativas públicas; somente o destinatário
recebe `hand`. Nenhum destinatário recebe a ordem ou o conteúdo do deck restante.

### Limites desta integração

Personagens, decks e resultado são persistidos em PostgreSQL. A sessão de combate
continua em memória, em um único worker. Uma reconexão ao mesmo processo recupera
o snapshot; reiniciar o servidor não reconstrói a batalha em andamento. Nesse caso,
ações são rejeitadas, sem criar uma nova batalha silenciosamente.

Esta fase não implementa interface, regras novas de compra de cartas, progressão,
equipamentos ou novos comportamentos para efeitos de área e suporte entre aliados.
Esses efeitos continuam com a semântica atual do motor. A integração visual e a
ampliação das interações entre os campeões seguem para as fases 10 e 11; recuperação
durável e política completa de reconexão permanecem para a fase 12.

## Fase 10 — launcher online

O launcher mantém as rotas locais e acrescenta a entrada **Jogar online** ao menu
existente. O fluxo online usa os mesmos estilos, fontes, imagens, cliente Axios e
componente de carta. Não existe um site separado nesta fase.

| Rota do launcher | Tela |
| --- | --- |
| `/login`, `/register` | Autenticação e cadastro |
| `/online` | Menu online |
| `/online/friends` | Amigos e solicitações por e-mail |
| `/online/invites` | Convites de partida, aceitação e recusa |
| `/online/characters` | Personagens persistidos da conta |
| `/online/decks` | Montagem e consulta de decks persistidos |
| `/online/create` | Escolha Enemy/Champion e seleções da partida |
| `/online/lobby/:matchId` | Lobby com um inimigo e quatro vagas de campeão |

`AuthContext` compartilha apenas a sessão autenticada. O token permanece no
`sessionStorage` da janela e é validado em `/auth/me` ao recarregar. O cliente
Axios existente acrescenta o Bearer token; respostas 401 da sessão atual encerram
essa sessão. Rotas online preservam o destino solicitado ao redirecionar ao login.
Sair da conta fecha a conexão do lobby, sem apagar saves locais.

Os serviços `authService`, `friendService`, `gameInviteService`, `matchService`,
`loadoutService` e `gameSocket` concentram a comunicação. Hooks cuidam de carga,
ações pendentes e mensagens de erro; as páginas apresentam os dados. Amigos e
convites atualizam a cada dez segundos enquanto a janela está visível e também
possuem atualização manual.

O formulário de decks trabalha com IDs do catálogo, e os seletores de entrada
usam somente personagens e decks persistidos da conta. O backend continua sendo
responsável por validar propriedade, compatibilidade e vagas. A entrada por
convite oferece as seleções apropriadas ao lado convidado antes de aceitá-lo.

`useLobby` mantém uma conexão autenticada de `GameSocket` por página. A conexão
é encerrada na navegação, desmontagem ou logout. Ações de prontidão/início só são
habilitadas após receber o primeiro snapshot, e esperam a confirmação do servidor.
Não há replay de comandos após falha. A reconexão é manual; ela recupera o estado
atual do processo e preserva o participante. A última partida é lembrada por ID de
usuário no armazenamento local para permitir voltar pelo menu.

Snapshots do lobby incluem apenas nomes públicos, avatar e nome/raça/classe dos
personagens pertencentes aos participantes. E-mails, hashes de senha e dados
completos de personagens/decks não fazem parte dessa projeção. Convites apresentam
o nome de quem convidou. A partida recebe um nome visual gerado a partir do ID.

Depois de `match_started`, o lobby apresenta o estado inicial e o turno recebido.
Os controles visuais completos de batalha permanecem para a fase 11. Não foram
adicionados matchmaking, importação automática de saves locais ou exclusão de
participantes ao navegar para o menu.

### Configuração e verificações

Configure `VITE_API_URL` no ambiente do launcher, conforme `launcher/.env.example`.
O endereço WebSocket é derivado do mesmo endereço, usando WSS quando a API usa
HTTPS. O token é enviado na primeira mensagem, nunca na URL. `CORS_ORIGINS` no
backend é uma lista JSON das origens permitidas; os valores padrão mantêm as
portas locais 3000 e 5173.

Em `launcher`, execute `npm.cmd run build` e `npm.cmd run test:e2e` no Windows
(`npm` em outros sistemas). O Playwright inicia uma instância real do FastAPI com
repositórios em memória em `127.0.0.1:8011` e o launcher em `127.0.0.1:5175`, sem
usar contas ou tabelas do PostgreSQL. O teste usa Edge no Windows; em outros
sistemas, instale Chromium com `npx playwright install chromium`. `PYTHON_BIN` e
`PLAYWRIGHT_CHANNEL` permitem escolher o interpretador e o navegador de teste.
Capturas e traces ficam em `launcher/test-results`, ignorado pelo Git.
