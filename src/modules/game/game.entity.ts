export class Game {
  id: string;
  name: string;
  publisher: string;
  mini_image: string;
  bg_image: string;
  price: string;
  description: string;
  cover_image: string;
}

export class GameReview {
  username: string;
  good_grade: boolean;
  text: string;
}
