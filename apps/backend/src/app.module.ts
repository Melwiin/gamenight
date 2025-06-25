import { Module } from '@nestjs/common';
import { LobbyModule } from './lobby/lobby.modules';

@Module({
  imports: [LobbyModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
