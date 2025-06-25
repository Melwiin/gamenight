import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { LobbyService } from './lobby.service';
import { Logger } from '@nestjs/common';

@WebSocketGateway({ cors: true })
export class LobbyGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly lobbyService: LobbyService,
    private readonly logger: Logger,
  ) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.lobbyService
      .leaveLobby(client)
      .then((lobby) => {
        this.server.to(lobby?.id).emit('playerLeft', lobby);
      })
      .catch(() => {});
  }

  @SubscribeMessage('joinLobby')
  handleJoinLobby(
    @ConnectedSocket() client: Socket,
    @MessageBody() joinRequest: { lobbyId: string; playerName: string },
  ) {
    this.lobbyService
      .joinLobby(client, joinRequest.lobbyId, joinRequest.playerName)
      .then((lobby) => {
        client.emit('lobbyJoined', 'success', lobby);
        this.server.to(joinRequest.lobbyId).emit('playerJoined', lobby);
      })
      .catch((error) => {
        if (error instanceof Error) {
          client.emit('err', error.message);
        } else {
          client.emit('err', 'Unknown error');
        }
      });
  }

  @SubscribeMessage('leaveLobby')
  handleLeaveLobby(@ConnectedSocket() client: Socket) {
    this.lobbyService
      .leaveLobby(client)
      .then((lobby) => {
        this.server.to(lobby?.id).emit('playerLeft', lobby);
      })
      .catch(() => {});
  }

  @SubscribeMessage('sendChatMessage')
  handleSendChatMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() content: string,
  ) {
    this.lobbyService.sendChatMessage(client, content);
  }

  @SubscribeMessage('selectGame')
  handleSelectGame(
    @ConnectedSocket() client: Socket,
    @MessageBody() gameId: string,
  ) {
    this.lobbyService.selectGame(client, gameId);
  }

  @SubscribeMessage('startGame')
  handleStartGame(@ConnectedSocket() client: Socket) {
    this.lobbyService.startGame(client);
  }
}
