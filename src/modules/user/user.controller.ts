import { Controller, Get, Post, Query } from '@nestjs/common';
import { Body, Param, Put } from '@nestjs/common/decorators';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('/users')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Get('/signin')
  async signIn(
    @Query('email') email: string,
    @Query('pwd') password: string,
  ): Promise<User> {
    return await this.service.signIn(email, password);
  }

  @Post('/signup')
  async signUp(@Body() newUser: User): Promise<User> {
    return await this.service.signUp(newUser);
  }

  @Put('/add-like/:id/:idGame')
  async like(
    @Param('id') id: string,
    @Param('idGame') idGame: string,
  ): Promise<void> {
    await this.service.like(id, idGame);
  }

  @Put('/remove-like/:id/:idGame')
  async unlike(
    @Param('id') id: string,
    @Param('idGame') idGame: string,
  ): Promise<void> {
    await this.service.unlike(id, idGame);
  }

  @Put('/add-wishlist/:id/:idGame')
  async wishlist(
    @Param('id') id: string,
    @Param('idGame') idGame: string,
  ): Promise<void> {
    await this.service.wishlist(id, idGame);
  }

  @Put('/remove-wishlist/:id/:idGame')
  async unwishlist(
    @Param('id') id: string,
    @Param('idGame') idGame: string,
  ): Promise<void> {
    await this.service.unwishlist(id, idGame);
  }
}
