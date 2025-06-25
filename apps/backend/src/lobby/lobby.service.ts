import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import Lobby from '@repo/shared-types/types/Lobby';
import { Socket } from 'socket.io';
import Player from '@repo/shared-types/types/Player';
import Message from '@repo/shared-types/types/Message';
import { randomUUID } from 'crypto';

@Injectable()
export class LobbyService {
  private readonly logger = new Logger(LobbyService.name);

  private lobbies: Map<string, Lobby> = new Map();

  public createLobby(name: string, customId?: string): Lobby {
    let id = customId ?? this.generateId();
    while (this.lobbies.has(id)) {
      id = this.generateId();
    }

    const lobby: Lobby = {
      id,
      name,
      createdAt: new Date(),
      gameInProgress: false,
      gameSelected: null,
      players: [],
      playlist: [],
    };
    this.lobbies.set(id, lobby);
    return lobby;
  }

  public getLobbyById(id: string): Lobby | undefined {
    return this.lobbies.get(id);
  }

  public getAllLobbies(): Lobby[] {
    return Array.from(this.lobbies.values());
  }

  public async joinLobby(client: Socket, lobbyId: string, username: string) {
    if (this.isPlayerInLobby(client.id))
      throw new BadRequestException('Already in a lobby');
    if (!username) throw new BadRequestException('Username is required');
    if (!lobbyId) throw new BadRequestException('Lobby ID is required');

    const lobby = this.getLobbyById(lobbyId);
    if (!lobby) throw new BadRequestException('Lobby not found');

    const player: Player = { id: client.id, name: username };
    lobby.players.push(player);
    await client.join(lobbyId);

    return lobby;
  }

  public async leaveLobby(client: Socket) {
    const playerId = client.id;

    const lobby = this.findLobbyByPlayerId(playerId);
    if (!lobby) throw new BadRequestException('Not in a Lobby');

    lobby.players = lobby.players.filter(
      (player: Player) => player.id !== playerId,
    );

    await client.leave(lobby.id);

    return lobby;
  }

  public sendChatMessage(client: Socket, content: string) {
    const lobby = this.findLobbyByPlayerId(client.id);
    const player = this.findPlayerInLobby(client.id);

    if (!lobby || !player)
      throw new BadRequestException('Player is in no lobby');

    const message: Message = {
      id: randomUUID(),
      content,
      senderId: client.id,
      senderName: player.name,
      timestamp: new Date(),
    };

    client.emit('chatMessage', message);
    client.to(lobby.id).emit('chatMessage', message);
  }

  selectGame(client: Socket, gameId: string) {
    const lobby = this.findLobbyByPlayerId(client.id);

    if (!lobby) throw new BadRequestException('Player is in no lobby');

    lobby.playlist = [];
    lobby.playlist.push(gameId);
    lobby.gameSelected = gameId;

    this.emitLobbyState(client, lobby);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  startGame(client: Socket) {}

  private emitLobbyState(client: Socket, lobby: Lobby) {
    client.emit('lobbyState', lobby);
    client.to(lobby.id).emit('lobbyState', lobby);
  }

  private isPlayerInLobby(playerId: string): boolean {
    return Array.from(this.lobbies.entries()).some(([, lobby]) =>
      lobby.players.some((player: Player) => player.id === playerId),
    );
  }

  private findLobbyByPlayerId(playerId: string): Lobby | undefined {
    return Array.from(this.lobbies.entries()).find(([, lobby]) =>
      lobby.players.some((player: Player) => player.id === playerId),
    )?.[1];
  }

  private findPlayerInLobby(playerId: string): Player | undefined {
    const entry = Array.from(this.lobbies.entries()).find(([, lobby]) =>
      lobby.players.some((player: Player) => player.id === playerId),
    );

    if (!entry) return undefined;

    const [, lobby] = entry;
    return lobby.players.find(
      (player: Player) => player.id === playerId,
    ) as Player;
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 7);
  }
}
