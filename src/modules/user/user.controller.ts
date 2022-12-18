import { Controller, Get, Post, Query } from '@nestjs/common';
import { Body } from '@nestjs/common/decorators';
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
}
