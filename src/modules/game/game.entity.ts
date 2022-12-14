export class Game {
  id: string;
  name: string;
  publisher: string;
  mini_image: string;
  bg_image: string;
  price: string;
  description: string;
}

export class GameDetail extends Game {
  cover_image: string;
  reviews: {
    name: string;
    good_grade: boolean;
    review: string;
  }[];
}
