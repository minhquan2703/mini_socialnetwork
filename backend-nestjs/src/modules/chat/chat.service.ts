import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepo: Repository<Chat>,
  ) {}

  async saveMessage(dto: CreateChatDto) {
    const message = this.chatRepo.create(dto);
    return this.chatRepo.save(message);
  }

  async getMessagesByRoom(roomId: string) {
    return this.chatRepo.find({
      where: { roomId },
      order: { createdAt: 'ASC' },
      relations: ['sender'],
    });
  }
}
