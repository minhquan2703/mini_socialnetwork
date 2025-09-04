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
import { UploadsService } from '../uploads/uploads.service';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
    @InjectRepository(Room)
    private readonly roomRepository: Repository<Room>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private uploadsService: UploadsService,
  ) {}

  async saveMessage(
    dto: CreateChatDto,
    userId: string,
    files: Express.Multer.File[],
  ) {
    const { roomId, content } = dto;
    if (!isUUID(roomId) || !isUUID(userId)) {
      throw new BadRequestException('Invalid ID ');
    }
    if (!content && files?.length === 0) {
      throw new BadRequestException('Content & file is not allowed to empty');
    }
    const room = await this.roomRepository.findOne({ where: { id: roomId } });
    if (!room) {
      throw new BadRequestException('Invalid Room');
    }
    const sender = await this.userRepository.findOne({
      where: { id: userId },
    });
    if (!sender) {
      throw new BadRequestException('Invalid sender');
    }
    const message = new Chat();
    message.sender = sender;
    message.content = content;
    message.room = room;
    if (files && files.length > 0) {
      if (files[0].mimetype.includes('video') && files.length > 1) {
        throw new BadRequestException('Maximum is 1 video or 4 images');
      }
      if (files[0].mimetype.includes('image')) {
        if (files.length > 4) {
          throw new BadRequestException('Maximum is 1 video or 4 images');
        }
        files.forEach((image) => {
          if (!image.mimetype.includes('image')) {
            throw new BadRequestException('Maximum is 1 video or 4 images');
          }
        });
      }
      const uploads = await this.uploadsService.uploadMultipleChat(
        files,
        userId,
      );
      message.uploads = uploads;
    }

    const savedMessage = await this.chatRepository.save(message);
    return {
      message: {
        id: savedMessage.id,
        content: savedMessage.content,
        createdAt: savedMessage.createdAt,
      },
      room: {
        id: savedMessage.room.id,
      },
      sender: {
        id: sender?.id,
        name: sender?.name,
        username: sender?.username,
        email: sender?.email,
        image: sender?.image,
        avatarColor: sender?.avatarColor,
      },
      uploads: savedMessage.uploads,
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
      relations: ['sender', 'uploads'],
      select: {
        sender: {
          id: true,
          name: true,
          username: true,
          image: true,
          avatarColor: true,
        },
      },
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
