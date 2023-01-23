import { Injectable } from '@nestjs/common';
import axios from 'axios';

import { Game, GameReview } from './game.entity';

const getTopUrl = (): string =>
  `https://api.steampowered.com/ISteamChartsService/GetMostPlayedGames/v1/`;
const getGameDetailsUrl = (id: string, lang: string): string =>
  `https://store.steampowered.com/api/appdetails?appids=${id}&l=${lang}`;
const getGameReviewsUrl = (id: string): string =>
  `https://store.steampowered.com/appreviews/${id}?json=1`;
const findByNameUrl = (text: string, lang: string): string =>
  `https://store.steampowered.com/api/storesearch/?term=${text}&l=${lang}`;

@Injectable()
export class GameService {
  /**
   * Get the top game of steam
   * @param size - number of games to fetch
   * @returns list of games
   */
  async getTop(size = 10, lang = 'french'): Promise<{ games: Game[] }> {
    const searchTopGamesIds = await axios.get(getTopUrl());

    if (searchTopGamesIds && searchTopGamesIds.status === 200) {
      const steamRanks = searchTopGamesIds.data.response.ranks;

      let games = steamRanks.slice(0, size);
      games = await Promise.all(
        games.map(async (game): Promise<Game> => {
          return await this.getGameDetails(game.id, lang);
        }),
      );

      return Promise.resolve({ games: games });
    }

    return Promise.reject({ games: [] });
  }

  /**
   * Find a game by name
   * @param text - search terms
   * @returns games corresponding to search terms
   */
  async findByName(
    text: string,
    lang = 'french',
  ): Promise<{ count: number; games: Game[] }> {
    const steamGames = await axios.get(findByNameUrl(text, 'french'));

    if (steamGames && steamGames.status === 200) {
      const games = await Promise.all(
        steamGames.data.items.map(async (game): Promise<Game> => {
          return await this.getGameDetails(game.id, lang);
        }),
      );

      return Promise.resolve({
        count: games.length,
        games: games,
      });
    }
    return Promise.reject({ count: 0, games: [] });
  }

  /**
   * Get a game by id
   * @param id - game id
   * @returns game
   */
  async getGameDetails(id: string, lang = 'french'): Promise<Game> {
    const steamGameDetail = await axios.get(getGameDetailsUrl(id, lang));

    if (steamGameDetail && steamGameDetail.status === 200) {
      console.log(steamGameDetail);
      return Promise.resolve({
        id: id,
        name: steamGameDetail.data[id].data.name,
        publisher: steamGameDetail.data[id].data.developers[0],
        mini_image: steamGameDetail.data[id].data.header_image,
        bg_image: steamGameDetail.data[id].data.background,
        cover_image: steamGameDetail.data[id].data.background_raw,
        description: steamGameDetail.data[id].data.detailed_description,
        price:
          steamGameDetail.data[id].data.price_overview?.final_formatted ??
          lang === 'french'
            ? 'Gratuit'
            : 'Free',
      });
    }

    return Promise.reject({});
  }

  /**
   * Get reviews of a steam game
   * @param id - game id
   * @returns list of reviews
   */
  async getGameReviews(id: string): Promise<GameReview[]> {
    const steamGameReviews = await axios.get(getGameReviewsUrl(id));

    if (steamGameReviews && steamGameReviews.status === 200) {
      const reviews = await Promise.all(
        steamGameReviews.data.reviews.map((r): GameReview => {
          return {
            username: `User_${(Math.random() * 1000).toFixed(0)}`,
            good_grade: r.voted_up,
            text: r.review,
          };
        }),
      );

      return reviews;
    }

    return Promise.reject({});
  }
}
