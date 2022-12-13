import { Injectable } from '@nestjs/common';
import axios from 'axios';

import { Game } from './game.entity';

const getGameTopURL = (): string =>
  `https://api.steampowered.com/ISteamChartsService/GetMostPlayedGames/v1/`;
const getGameDetailsURL = (id: string): string =>
  `https://store.steampowered.com/api/appdetails?lan=fr&appids=${id}`;
const getGameReviewsURL = (id: string): string =>
  `https://store.steampowered.com/appreviews/${id}?json=1`;
const searchGameURL = (text: string): string =>
  `https://store.steampowered.com/api/storesearch/?term=${text}&l=french&cc=FR`;

@Injectable()
export class GameService {
  async getTop(size = 10): Promise<Game[]> {
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
              editor: gameResponse.data[value.appid].data.developers[0],
              cover_image: gameResponse.data[value.appid].data.header_image,
              background_image: gameResponse.data[value.appid].data.background,
              price:
                gameResponse.data[value.appid].data.price_overview
                  ?.final_formatted ?? 'Gratuit',
            };
          }

          return { appid: value.appid };
        }),
      );

      return Promise.resolve(formatedResponse);
    }

    return Promise.reject([]);
  }

  async getDetails(id: string): Promise<Game> {
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
        editor: response.data[id].data.developers[0],
        cover_image: response.data[id].data.header_image,
        background_image: response.data[id].data.background,
        price:
          response.data[id].data.price_overview?.final_formatted ?? 'Gratuit',
        description: response.data[id].data.detailed_description,
        reviews: formatedReviews,
      });
    }

    return Promise.reject({});
  }

  async findByName(text: string): Promise<any> {
    const response = await axios.get(searchGameURL(text));

    if (response.status === 200) {
      const formatedResponse = await Promise.all(
        response.data.items.map(async (item) => {
          const detailsResponse = await axios.get(getGameDetailsURL(item.id));

          return {
            id: item.id,
            name: item.name,
            editor: detailsResponse.data[item.id].data.developers[0],
            cover_image: detailsResponse.data[item.id].data.header_image,
            background_image: detailsResponse.data[item.id].data.background,
            price:
              detailsResponse.data[item.id].data.price_overview
                ?.final_formatted ?? 'Gratuit',
          };
        }),
      );
      return Promise.resolve({
        count: response.data.total,
        result: formatedResponse,
      });
    }
    return Promise.reject({ count: 0 });
  }
}
