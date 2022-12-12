import { Controller, Get, Param } from '@nestjs/common';
import { Query } from '@nestjs/common/decorators';
import { AppService } from './app.service';

@Controller('/games')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/top')
  async getTop(@Query('size') size: string): Promise<any[]> {
    return await this.appService.getTop(
      size ? Number.parseInt(size) : undefined,
    );
  }

  @Get('/details/:id')
  async getDetails(@Param('id') id: string): Promise<any> {
    return await this.appService.getDetails(id);
  }

  @Get('/search')
  async searchByText(@Query('text') text: string): Promise<any> {
    return await this.appService.searchGame(text);
  }
}
