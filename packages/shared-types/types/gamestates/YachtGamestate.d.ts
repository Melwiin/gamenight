import Player from '../Player';

export interface YachtCategories {
  ones: number;
  twos: number;
  threes: number;
  fours: number;
  fives: number;
  sixes: number;
  
  bonus: number;
  
  choice: number;
  
  fourOfAKind: number;
  fullHouse: number;
  smallStraight: number;
  largeStraight: number;
  yacht: number;
}

export default interface YachtGamestate {
  dice: number[];
  inThrow: boolean;
  playerInTurn: Player;
  playerInfo: { player: Player, scores: YachtCategories };
}
