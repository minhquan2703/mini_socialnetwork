import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async saveMessage(dto: CreateChatDto) {
    const message = this.chatRepository.create(dto);
    const sender = await this.userRepository.findOne({
      where: { id: dto.senderId },
    });
    await this.chatRepository.save(message);
    return {
      message,
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

  async getMessagesByRoom(roomId: string) {
    return this.chatRepository.find({
      where: { roomId },
      order: { createdAt: 'ASC' },
      relations: ['sender'],
    });
  }
}
