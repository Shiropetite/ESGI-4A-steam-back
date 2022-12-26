import { Game } from './../game/game.entity';

export class User {
  id: string;
  name: string;
  email: string;
  password: string;
  likedGames: Game[];
  wishlistedGames: Game[];
}
