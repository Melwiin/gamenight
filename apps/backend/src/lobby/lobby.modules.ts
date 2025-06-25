import { Logger, Module } from '@nestjs/common';
import { LobbyGateway } from './lobby.gateway';
import { LobbyService } from './lobby.service';
import { LobbyController } from './lobby.controller';

@Module({
  imports: [],
  providers: [LobbyGateway, LobbyService, Logger],
  controllers: [LobbyController],
})
export class LobbyModule {}
