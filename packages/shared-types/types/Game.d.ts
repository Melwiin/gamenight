type PlayerRange = [number, number];

export default interface Game {
  id: string;
  name: string;
  description: string;
  playerRange: PlayerRange;
}
