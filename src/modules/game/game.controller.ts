import { Controller, Get, Param } from '@nestjs/common';
import { Query } from '@nestjs/common/decorators';
import { GameService } from './game.service';
import { Game } from './game.entity';

@Controller('/games')
export class GameController {
  constructor(private readonly service: GameService) {}

  @Get('/top')
  async getTop(@Query('size') size: string): Promise<Game[]> {
    return await this.service.getTop(size ? Number.parseInt(size) : undefined);
  }

  @Get('/search')
  async findByName(@Query('name') name: string): Promise<Game> {
    return await this.service.findByName(name);
  }

  @Get('/:id/details')
  async getDetails(@Param('id') id: string): Promise<Game> {
    return await this.service.getDetails(id);
  }
}
