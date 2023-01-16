import { Controller, Get, Param, Query } from '@nestjs/common';
import { Game, Reviews } from './game.entity';
import { GameService } from './game.service';

@Controller('/games')
export class GameController {
  constructor(private readonly service: GameService) {}

  @Get('/top')
  async getTop(@Query('size') size: string): Promise<{ games: Game[] }> {
    return await this.service.getTop(size ? Number.parseInt(size) : undefined);
  }

  @Get('/search')
  async findByName(
    @Query('name') name: string,
  ): Promise<{ count: number; games: Game[] }> {
    return await this.service.findByName(name);
  }

  @Get('/:id/reviews')
  async getReviews(@Param('id') id: string): Promise<{ reviews: Reviews[] }> {
    return { reviews: await this.service.getReviews(id) };
  }
}
