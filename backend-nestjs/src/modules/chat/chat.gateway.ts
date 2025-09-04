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
import dayjs from 'dayjs';

interface Sender {
  id: string;
  name: string;
  username: string;
  image: string;
  avatarColor: string;
}

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

    //thông báo cho client đã join thành công
    // client.emit('joinedRoom', { roomId, success: true });
  }

  @SubscribeMessage('notify.success')
  notifySuccess(
    @ConnectedSocket() client: Socket,
    @MessageBody()
    payload: {
      roomId: string;
      id: string;
      content?: string;
      tempId: string;
      createdAt: Date;
      sender: Sender;
      uploads?: Express.Multer.File[];
    },
  ) {
    const { roomId, id, createdAt, sender, content, uploads, tempId } = payload;
    const createdAtFormat = dayjs(createdAt).format('DD/MM/YYYY [-] HH[:]mm');
    this.server.to(roomId).emit('message.success', {
      id: id,
      tempId: tempId,
      sender: {
        id: sender.id,
        name: sender.name,
        username: sender.username,
        image: sender.image,
        avatarColor: sender.avatarColor,
      },
      content: content,
      uploads: uploads,
      createdAtFormat: createdAtFormat,
      status: 'success',
    });
    client.broadcast.emit('message.success', {
      id: id,
      sender: {
        id: sender.id,
        name: sender.name,
        username: sender.username,
        image: sender.image,
        avatarColor: sender.avatarColor,
      },
      content: content,
      uploads: uploads,
      createdAtFormat: createdAtFormat,
      status: 'success',
    });
  }

  @SubscribeMessage('handleBlockOrUnBlock')
  handleBlockOrUnBlock(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { blocked: boolean },
  ) {
    const { blocked } = payload;
    if (blocked) {
      client.broadcast.emit('blockOrUnBlock', { blocked: true });
    } else {
      client.broadcast.emit('blockOrUnBlock', { blocked: false });
    }

    // client.emit('blockOrUnBlock', { blocked });
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
