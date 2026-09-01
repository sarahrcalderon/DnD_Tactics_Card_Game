export interface RouteCoordinate {
  x: number;
  y: number;
}

export interface CampaignPoint extends RouteCoordinate {
  id: number;
  name: string;
  isBoss?: boolean;

  /**
   * Índice do ponto correspondente dentro de ROUTE_PATH.
   *
   * Isso permite que o jogador percorra vários pontos
   * intermediários entre uma batalha e outra.
   */
  pathIndex: number;
}