import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Room } from '../rooms/entities/room.entity';
import { isUUID } from 'class-validator';
import dayjs from 'dayjs';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async saveMessage(dto: CreateChatDto) {
    const { roomId, content, senderId } = dto;
    if (!isUUID(roomId) || !isUUID(senderId)) {
      throw new BadRequestException('Invalid ID ');
    }
    const room = await this.roomRepository.findOne({ where: { id: roomId } });
    if (!room) {
      throw new BadRequestException('Invalid Room');
    }
    const sender = await this.userRepository.findOne({
      where: { id: senderId },
    });
    if (!sender) {
      throw new BadRequestException('Invalid sender');
    }
    const message = new Chat();
    message.sender = sender;
    message.content = content;
    message.room = room;
    await this.chatRepository.save(message);
    return {
      message: {
        id: message.id,
        content: message.content,
        createdAt: message.createdAt,
      },
      room: {
        id: message.room.id,
      },
      sender: {
        id: sender?.id,
        name: sender?.name,
        username: sender?.username,
        email: sender?.email,
        image: sender?.image,
        avatarColor: sender?.avatarColor,
      },
    };
  }

  async getMessagesByRoom(roomId: string, userId: string) {
    if (!isUUID(roomId)) {
      throw new BadRequestException('Invalid roomId');
    }
    const room = await this.roomRepository.findOne({
      where: { id: roomId },
      relations: ['users', 'messages'],
    });
    if (!room) {
      throw new NotFoundException('Room was not found');
    }
    const userInRoom = room.users.some((user) => user.id === userId);
    if (!userInRoom) {
      throw new ForbiddenException('Forbidden Exception');
    }
    const messages = await this.chatRepository.find({
      where: { room: { id: roomId } },
      order: { createdAt: 'ASC' },
      relations: ['sender'],
    });
    const results = messages.map((m) => {
      const createdAtFormat = dayjs(m.createdAt).format(
        'DD/MM/YYYY [-] HH[:]mm',
      );
      const { createdAt, ...messageClone } = m;
      return {
        createdAtFormat,
        ...messageClone,
      };
    });
    return results;
  }
}
