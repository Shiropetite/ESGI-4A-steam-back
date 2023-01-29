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

  @Put('/change-password')
  async changePassword(
    @Query('email') email: string,
    @Query('pwd') newPassword: string,
  ): Promise<User> {
    return await this.service.changePassword(email, newPassword);
  }

  @Put('/:id/add-like/:idGame')
  async like(
    @Param('id') id: string,
    @Param('idGame') idGame: string,
  ): Promise<User> {
    return await this.service.like(id, idGame);
  }

  @Put('/:id/remove-like/:idGame')
  async unlike(
    @Param('id') id: string,
    @Param('idGame') idGame: string,
  ): Promise<User> {
    return await this.service.unlike(id, idGame);
  }

  @Put('/:id/add-wishlist/:idGame')
  async wishlist(
    @Param('id') id: string,
    @Param('idGame') idGame: string,
  ): Promise<User> {
    return await this.service.wishlist(id, idGame);
  }

  @Put('/:id/remove-wishlist/:idGame')
  async unwishlist(
    @Param('id') id: string,
    @Param('idGame') idGame: string,
  ): Promise<User> {
    return await this.service.unwishlist(id, idGame);
  }
}
