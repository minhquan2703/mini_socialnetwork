import { BadRequestException } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  handleConnection(client: Socket) {
    const token = client.handshake.auth?.token;
    if (!token) {
      throw new BadRequestException('Không xác định được người dùng');
    }
    client.data.userId = 'demo_user_id';
    console.log('User connected:', client.id);
  }
  handleDisconnect(client: Socket) {
    console.log('user disconnect: ', client.id);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, roomId: string) {
    client.join(roomId);
    console.log(`User joined room: ${roomId}`);
  }

  @SubscribeMessage('sendMessage')
  handleSendMessage(
    client: Socket,
    payload: { roomId: string; content: string },
  ) {
    const userId = client.data.userId;
    this.server.to(payload.roomId).emit('receiveMessage', {
      senderId: userId,
      content: payload.content,
      createdAt: new Date().toISOString(),
    });
  }
}
