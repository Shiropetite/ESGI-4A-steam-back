import { Controller, Get, Param, Query } from '@nestjs/common';
import { Game, GameReview } from './game.entity';
import { GameService } from './game.service';

@Controller('/games')
export class GameController {
  constructor(private readonly service: GameService) {}

  @Get('/top')
  async getTop(
    @Query('size') size: string,
    @Query('lang') lang: string,
  ): Promise<{ games: Game[] }> {
    return await this.service.getTop(
      size ? Number.parseInt(size) : undefined,
      lang != 'français' ? lang : undefined,
    );
  }

  @Get('/search')
  async findByName(
    @Query('name') name: string,
    @Query('lang') lang: string,
  ): Promise<{ count: number; games: Game[] }> {
    return await this.service.findByName(
      name,
      lang != 'français' ? lang : undefined,
    );
  }

  @Get('/:id/reviews')
  async getReviews(
    @Param('id') id: string,
  ): Promise<{ reviews: GameReview[] }> {
    return { reviews: await this.service.getGameReviews(id) };
  }
}
