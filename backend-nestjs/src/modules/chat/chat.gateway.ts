import { BadRequestException } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { JwtService } from '@nestjs/jwt';
import { RoomsService } from '../rooms/rooms.service';
import { User } from '../users/entities/user.entity';
import dayjs from 'dayjs';
@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
    private readonly roomService: RoomsService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.auth?.token;
      console.log('New connection attempt:', client.id);

      if (!token) {
        client.disconnect();
        return;
      }

      // Verify JWT token
      try {
        const payload = await this.jwtService.verifyAsync(token, {
          secret: process.env.JWT_SECRET,
        });

        client.data.user = {
          id: payload.id || payload.sub,
          email: payload.email,
          username: payload.username,
          name: payload.name,
        };

        console.log(
          'User connected successfully:',
          client.id,
          client.data.user,
        );
      } catch (jwtError) {
        console.error('JWT verification failed:', jwtError);
        client.emit('error', { message: 'Authentication failed' });
        client.disconnect();
        return;
      }
    } catch (error) {
      console.error('Connection error:', error);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log('User disconnected:', client.id);
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomId: string,
  ) {
    await client.join(roomId);
    console.log(`User ${client.data.user?.id} joined room: ${roomId}`);

    // Thông báo cho client đã join thành công
    client.emit('joinedRoom', { roomId, success: true });
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    payload: { roomId: string; content: string },
  ) {
    const { roomId, content } = payload;
    const sender: User = client.data.user;
    if (!sender) {
      throw new BadRequestException('Error Authenticated');
    }
    const room = await this.roomService.findById(roomId);
    if (!room) {
      throw new BadRequestException('Invalid Room');
    }
    console.log('check message', roomId, content);
    if (room?.isBlocked) {
      throw new BadRequestException('isBlocked');
    }

    // Lưu tin nhắn vào database
    const saved = await this.chatService.saveMessage({
      roomId: roomId,
      content: content,
      senderId: sender.id,
    });
    const createdAtFormat = dayjs(saved.message.createdAt).format(
      'DD/MM/YYYY [-] HH[:]mm',
    );
    this.server.to(room.id).emit('receiveMessage', {
      id: saved.message.id,
      roomId: saved.room.id,
      senderId: saved.sender?.id,
      sender: {
        id: saved.sender.id,
        name: saved.sender?.name,
        username: saved.sender?.username,
        image: saved.sender?.image,
        avatarColor: saved.sender?.avatarColor,
      },
      content: saved.message.content,
      createdAtFormat: createdAtFormat,
    });
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() roomId: string,
  ) {
    client.leave(roomId);
    console.log(`User ${client.data.user?.id} left room: ${roomId}`);
  }
}
