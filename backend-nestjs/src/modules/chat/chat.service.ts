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
import { Upload } from '../uploads/entities/upload.entity';

interface FormattedMessage {
  id: string;
  content?: string;
  createdAtFormat: string;
  sender: {
    id: string;
    name: string;
    username: string;
    image: string;
    avatarColor: string | null;
  };
  uploads?: Upload[];
}
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

  async getMessagesByRoomPagination(
    roomId: string,
    userId: string,
    cursor: string,
    limit: number,
  ) {
    // 1. Validate input
    await this.validateRoomAccess(roomId, userId);

    // const { cursor, limit = 20 } = paginationDto;
    const safeLimit = Math.min(Math.max(limit, 1), 50); // Giới hạn 1-50 messages

    // 2. Query messages với cursor pagination
    const messages = await this.queryMessagesWithCursor(
      roomId,
      cursor,
      safeLimit,
    );

    // 3. Kiểm tra có còn tin nhắn cũ hơn không
    const hasMore = messages.length > safeLimit;
    const messagesToReturn = hasMore ? messages.slice(0, safeLimit) : messages;

    // 4. Sắp xếp và format tin nhắn
    const formattedMessages = this.formatMessagesForDisplay(messagesToReturn);

    // 5. Tạo cursor cho lần load tiếp theo
    const nextCursor = this.generateNextCursor(formattedMessages, hasMore);

    return {
      data: formattedMessages,
      hasMore,
      nextCursor,
    };
  }

  private generateNextCursor(
    formattedMessages: FormattedMessage[],
    hasMore: boolean,
  ): string | undefined {
    if (!hasMore || formattedMessages.length === 0) {
      return undefined;
    }

    // Tin nhắn cũ nhất là phần tử đầu tiên (sau khi đã reverse)
    return formattedMessages[0].id;
  }

  private formatMessagesForDisplay(messages: Chat[]) {
    // Reverse để có thứ tự chronological (tin cũ ở đầu, tin mới ở cuối)
    const chronologicalMessages = [...messages].reverse();

    return chronologicalMessages.map((message) => {
      const createdAtFormat = dayjs(message.createdAt).format(
        'DD/MM/YYYY [-] HH[:]mm',
      );

      return {
        id: message.id,
        content: message.content || undefined,
        createdAtFormat,
        sender: {
          id: message.sender.id,
          name: message.sender.name,
          username: message.sender.username,
          image: message.sender.image,
          avatarColor: message.sender.avatarColor || null,
        },
        uploads: message.uploads,
      };
    });
  }
  private async validateRoomAccess(
    roomId: string,
    userId: string,
  ): Promise<void> {
    if (!isUUID(roomId)) {
      throw new BadRequestException('Invalid roomId format');
    }

    const room = await this.roomRepository.findOne({
      where: { id: roomId },
      relations: ['users'],
      select: {
        id: true,
        users: {
          id: true,
        },
      },
    });

    if (!room) {
      throw new NotFoundException('Room was not found');
    }

    const userHasAccess = room.users.some((user) => user.id === userId);
    if (!userHasAccess) {
      throw new ForbiddenException('Forbidden Exception');
    }
  }

  private async queryMessagesWithCursor(
    roomId: string,
    cursor: string | undefined,
    limit: number,
  ): Promise<Chat[]> {
    const queryBuilder = this.chatRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.sender', 'sender')
      .leftJoinAndSelect('message.uploads', 'uploads')
      .where('message.roomId = :roomId', { roomId })
      .select([
        'message.id',
        'message.content',
        'message.createdAt',
        'message.updatedAt',
        'sender.id',
        'sender.name',
        'sender.username',
        'sender.image',
        'sender.avatarColor',
        'uploads',
      ])
      .orderBy('message.createdAt', 'DESC')
      .limit(limit + 1); // +1 để check hasMore

    //nếu có cursor, chỉ lấy tin nhắn cũ hơn cursor đó
    if (cursor) {
      queryBuilder.andWhere(
        'message.createdAt < (SELECT createdAt FROM chat WHERE id = :cursor)',
        { cursor },
      );
    }

    return await queryBuilder.getMany();
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
