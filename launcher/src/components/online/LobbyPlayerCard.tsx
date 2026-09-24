import { useState } from 'react';
import styled from 'styled-components';
import type { LobbyPlayer } from '../../types/online.types';
import { Muted, Row, Tag } from '../../styles/onlineStyles';

const Card = styled.article<{ $enemy?: boolean; $empty?: boolean }>`
  min-width: 0;
  min-height: 245px;
  padding: 24px 18px;
  text-align: center;
  border: 1px ${({ $empty }) => ($empty ? 'dashed' : 'solid')}
    ${({ $enemy }) => ($enemy ? '#92524b' : '#827049')};
  background: ${({ $enemy }) =>
    $enemy
      ? 'linear-gradient(160deg, #341f25, #13151c)'
      : 'linear-gradient(160deg, #282b30, #13151c)'};
  opacity: ${({ $empty }) => ($empty ? 0.65 : 1)};
  border-radius: 4px;

  h3 {
    margin: 12px 0 7px;
    color: #ecd4a4;
    overflow-wrap: anywhere;
    font-family: 'Cinzel', Georgia, serif;
  }

  p {
    overflow-wrap: anywhere;
  }

  ${Row} {
    justify-content: center;
    margin-top: 14px;
  }
`;

const Avatar = styled.div`
  width: 62px;
  height: 62px;
  margin: auto;
  display: grid;
  place-items: center;
  border: 1px solid #957d52;
  border-radius: 50%;
  background: #0b0e15;
  font-size: 1.6rem;
  color: #ddc28b;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
  }
`;

export function LobbyPlayerCard({
  player,
  enemy,
  own,
  slot,
}: {
  player?: LobbyPlayer;
  enemy?: boolean;
  own?: boolean;
  slot: number;
}) {
  const [failed, setFailed] = useState(false);
  const name =
    player?.username || (enemy ? 'Jogador inimigo' : `Campeão ${slot}`);

  return (
    <Card
      $enemy={enemy}
      $empty={!player}
      aria-label={enemy ? 'Vaga do inimigo' : `Vaga do campeão ${slot}`}
    >
      <Avatar aria-hidden="true">
        {player?.avatar_url &&
        /^https?:\/\//.test(player.avatar_url) &&
        !failed ? (
          <img src={player.avatar_url} alt="" onError={() => setFailed(true)} />
        ) : player ? (
          name.slice(0, 1).toUpperCase()
        ) : (
          '+'
        )}
      </Avatar>

      <h3>
        {player ? name : 'Vaga disponível'}
        {own && ' · Você'}
      </h3>

      {player ? (
        <>
          <Muted>
            {enemy
              ? 'Comandante do deck inimigo'
              : player.character_name || 'Campeão selecionado'}
          </Muted>

          {!enemy && (
            <Muted>
              {[player.race_id, player.class_id].filter(Boolean).join(' · ')}
            </Muted>
          )}

          <Row>
            <Tag $good={player.connected}>
              {player.connected ? 'Conectado' : 'Desconectado'}
            </Tag>
            <Tag $good={player.ready}>
              {player.ready ? 'Pronto' : 'Preparando'}
            </Tag>
          </Row>
        </>
      ) : (
        <Muted>
          {enemy
            ? 'Convide um amigo para comandar o inimigo.'
            : 'Um aliado pode se juntar à expedição.'}
        </Muted>
      )}
    </Card>
  );
}
