import { Player } from './Player';

export default interface Lobby {
  id: string;
  name: string;
  createdAt: Date;
  gameInProgress: boolean;
  gameSelected: string | null;
  players: Player[];
  playlist: string[];
}
