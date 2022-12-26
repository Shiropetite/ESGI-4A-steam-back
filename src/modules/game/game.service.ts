import { Injectable } from '@nestjs/common';
import axios from 'axios';

import { Game, GameDetail } from './game.entity';

const getGameTopURL = (): string =>
  `https://api.steampowered.com/ISteamChartsService/GetMostPlayedGames/v1/`;
const getGameDetailsURL = (id: string): string =>
  `https://store.steampowered.com/api/appdetails?l=french&appids=${id}`;
const getGameReviewsURL = (id: string): string =>
  `https://store.steampowered.com/appreviews/${id}?json=1`;
const searchGameURL = (text: string): string =>
  `https://store.steampowered.com/api/storesearch/?term=${text}&l=french&cc=FR`;

@Injectable()
export class GameService {
  async getTop(size = 10): Promise<{ games: Game[] }> {
    const response = await axios.get(getGameTopURL());

    if (response.status === 200 && response) {
      let formatedResponse = [];
      const ranks = response.data.response.ranks;

      formatedResponse = ranks.slice(0, size);
      formatedResponse = await Promise.all(
        formatedResponse.map(async (value) => {
          const gameResponse = await axios.get(getGameDetailsURL(value.appid));

          if (gameResponse.status === 200) {
            return {
              id: value.appid,
              name: gameResponse.data[value.appid].data.name,
              publisher: gameResponse.data[value.appid].data.developers[0],
              mini_image: gameResponse.data[value.appid].data.header_image,
              bg_image: gameResponse.data[value.appid].data.background,
              description:
                gameResponse.data[value.appid].data.detailed_description,
              price:
                gameResponse.data[value.appid].data.price_overview
                  ?.final_formatted ?? 'Gratuit',
            };
          }

          return { appid: value.appid };
        }),
      );

      return Promise.resolve({ games: formatedResponse });
    }

    return Promise.reject({ games: [] });
  }

  async getDetails(id: string): Promise<GameDetail> {
    const response = await axios.get(getGameDetailsURL(id));
    const responseReviews = await axios.get(getGameReviewsURL(id));

    const formatedReviews = await Promise.all(
      responseReviews.data.reviews.map((r) => {
        return {
          name: 'Patate',
          good_grade: r.voted_up,
          review: r.review,
        };
      }),
    );

    if (response.status === 200) {
      return Promise.resolve({
        id,
        name: response.data[id].data.name,
        publisher: response.data[id].data.developers[0],
        mini_image: response.data[id].data.header_image,
        cover_image: response.data[id].data.background_raw,
        bg_image: response.data[id].data.background,
        price:
          response.data[id].data.price_overview?.final_formatted ?? 'Gratuit',
        description: response.data[id].data.detailed_description,
        reviews: formatedReviews,
      });
    }

    return Promise.reject({});
  }

  async findByName(text: string): Promise<{ count: number; games: Game[] }> {
    const response = await axios.get(searchGameURL(text));

    if (response.status === 200) {
      const formatedResponse = await Promise.all(
        response.data.items.map(async (item) => {
          const detailsResponse = await axios.get(getGameDetailsURL(item.id));

          return {
            id: item.id,
            name: item.name,
            publisher: detailsResponse.data[item.id].data.developers[0],
            mini_image: detailsResponse.data[item.id].data.header_image,
            bg_image: detailsResponse.data[item.id].data.background,
            price:
              detailsResponse.data[item.id].data.price_overview
                ?.final_formatted ?? 'Gratuit',
            description:
              detailsResponse.data[item.id].data.detailed_description,
          };
        }),
      );
      return Promise.resolve({
        count: response.data.total,
        games: formatedResponse,
      });
    }
    return Promise.reject({ count: 0, games: [] });
  }

  async getGameById(id: string): Promise<Game> {
    const detailsResponse = await axios.get(getGameDetailsURL(id));

    if (detailsResponse.status === 200) {
      return Promise.resolve({
        id: id,
        name: detailsResponse.data[id].data.name,
        publisher: detailsResponse.data[id].data.developers[0],
        mini_image: detailsResponse.data[id].data.header_image,
        bg_image: detailsResponse.data[id].data.background,
        price:
          detailsResponse.data[id].data.price_overview?.final_formatted ??
          'Gratuit',
        description: detailsResponse.data[id].data.detailed_description,
      });
    }

    return Promise.reject(null);
  }
}
