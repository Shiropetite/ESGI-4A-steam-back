import { Controller, Get, Param, Query } from '@nestjs/common';
import { Game, GameDetail } from './game.entity';
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
  ): Promise<{ count: number; result: Game[] }> {
    return await this.service.findByName(name);
  }

  @Get('/:id/details')
  async getDetails(@Param('id') id: string): Promise<GameDetail> {
    return await this.service.getDetails(id);
  }
}
