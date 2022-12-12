export const getGameTopURL = (): string =>
  `https://api.steampowered.com/ISteamChartsService/GetMostPlayedGames/v1/`;

export const getGameDetailsURL = (id: string): string =>
  `https://store.steampowered.com/api/appdetails?lan=fr&appids=${id}`;

export const getGameReviewsURL = (id: string): string =>
  `https://store.steampowered.com/appreviews/${id}?json=1`;

export const searchGameURL = (text: string): string =>
  `https://store.steampowered.com/api/storesearch/?term=${text}&l=french&cc=FR`;
