import {
  Controller,
  Post,
  Body,
  Get,
  BadRequestException,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { LobbyService } from './lobby.service';
import Lobby from '@repo/shared-types/types/Lobby';
import Game from '@repo/shared-types/types/Game';

@Controller('lobby')
export class LobbyController {
  constructor(private readonly lobbyService: LobbyService) {
    this.lobbyService.createLobby("Melwin's Lobby", '12345');
  }

  @Get('games')
  getGames(): Game[] {
    return [
      {
        id: 'blackjack',
        name: 'Blackjack',
        description: 'A classic card game of chance and skill',
        playerRange: [1, 6],
      },
      {
        id: 'yacht',
        name: 'Yacht',
        description: 'A game of chance and strategy',
        playerRange: [2, 4],
      },
    ];
  }

  @Get()
  getLobby(@Query('id') id: string): Lobby {
    const lobby = this.lobbyService.getLobbyById(id);
    if (!lobby) throw new NotFoundException('Lobby not found');
    return lobby;
  }

  @Get('/all')
  getAllLobbies(): Lobby[] {
    return this.lobbyService.getAllLobbies();
  }

  @Post()
  createLobby(@Body('name') name: string) {
    if (!name) throw new BadRequestException('Lobby name is required');
    const lobby: Lobby = this.lobbyService.createLobby(name);
    return lobby;
  }
}
