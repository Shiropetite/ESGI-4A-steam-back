import { Module } from '@nestjs/common';
import { GameModule } from './modules/game/game.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [GameModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
