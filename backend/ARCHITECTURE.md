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

As mãos dos jogadores, o conteúdo dos decks e o estado local da batalha nunca são lidos por esse endpoint.

As salas suportam **um inimigo e até quatro campeões**, utilizando as regras de participação já existentes.

### Integração entre HTTP e WebSocket

As rotas HTTP responsáveis por definir o estado de pronto e iniciar partidas utilizam o mesmo serviço de tempo real.

Ao aceitar um convite, o evento `player_joined` é publicado.

Ao desconectar, apenas a conexão é removida.

Quando a última conexão de um usuário é encerrada, seu estado de presença é alterado. Isso não remove o participante da partida e também não encerra a partida.

Ao abrir novamente um socket autenticado, o cliente recebe o snapshot atual do lobby.

Falhas no envio de mensagens possuem limites definidos e as conexões problemáticas são removidas sem bloquear indefinidamente os clientes saudáveis.

As operações de presença, prontidão e início da partida são serializadas individualmente por sala.

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

### Estado atual de `match_started`

Atualmente, `match_started` representa apenas a transição já existente de `Match` para:

```text
IN_PROGRESS
```

Esse evento **não cria uma instância de `Battle`**.

Comandos de combate são rejeitados até que as **Fases 9 e 11** integrem o mecanismo de batalha existente e o estado individual de cada jogador.

As classes:

```text
Battle
Board
DeckManager
```

permanecem inalteradas.

O mecanismo legado, atualmente desenvolvido para dois participantes, deverá ser adaptado separadamente para trabalhar com propriedade explícita dos recursos e decks individuais de cada jogador.

Essa adaptação deve ser feita sem expor o estado completo e não filtrado do mecanismo de batalha por meio do WebSocket multiplayer.
