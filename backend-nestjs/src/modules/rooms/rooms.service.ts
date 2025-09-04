import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Room, RoomType } from './entities/room.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { Chat } from '../chat/entities/chat.entity';
import dayjs from 'dayjs';
import { Upload } from '../uploads/entities/upload.entity';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Chat)
    private chatRepository: Repository<Chat>,
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
    @InjectRepository(Upload)
    private uploadRepository: Repository<Upload>,
  ) {}

  async createRoomChat(createRoomDto: CreateRoomDto, senderId: string) {
    const { receiverId, type } = createRoomDto;
    const sender = await this.userRepository.findOne({
      where: { id: senderId },
    });
    const receiver = await this.userRepository.findOne({
      where: { id: receiverId },
    });
    if (!receiver) {
      throw new BadRequestException('Receiver not found');
    }
    if (!sender) {
      throw new BadRequestException('User not found');
    }
    const room = this.roomRepository.create({
      type: type,
      users: [sender, receiver],
    });
    await this.roomRepository.save(room);
    return room;
  }

  async privatedChat(createRoomDto: CreateRoomDto, senderId: string) {
    const { receiverId, type } = createRoomDto;
    if (receiverId === senderId) {
      throw new BadRequestException('Invalid Receiver');
    }
    const rooms = await this.roomRepository.find({
      where: { type: RoomType.PRIVATE },
      relations: ['users'],
    });

    //tìm phòng có đúng 2 user sender và receiver
    const room = rooms.find(
      (room) =>
        room.users.length === 2 &&
        room.users.some((u) => u.id === senderId) &&
        room.users.some((u) => u.id === receiverId),
    );

    if (room) {
      return room;
    }
    const newRoom = await this.createRoomChat({ receiverId, type }, senderId);
    return newRoom;
  }

  async getAllRooms(userId: string) {
    const user: User | null = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['rooms', 'rooms.users'],
    });
    if (!user) {
      throw new BadRequestException('Invalid user');
    }
    const rooms = user.rooms;
    if (!rooms || rooms.length === 0) {
      return [];
    }
    const results = await Promise.all(
      rooms.map(async (room) => {
        const lastestMessage = await this.chatRepository.findOne({
          where: { room: { id: room.id } },
          order: { createdAt: 'DESC' },
          relations: ['sender'],
          select: {
            sender: {
              id: true,
              username: true,
              name: true,
              image: true,
              avatarColor: true,
            },
          },
        });
        const timeBefore = lastestMessage
          ? dayjs(lastestMessage.createdAt).fromNow()
          : '';
        let receiver: Partial<User>;

        if (room.type === RoomType.PRIVATE) {
          const others = room.users.filter((u) => u.id !== user.id);
          if (others.length === 0) {
            return null;
          }
          receiver = {
            id: others[0].id,
            name: others[0].name,
            username: others[0].username,
            image: others[0].image,
            avatarColor: others[0].avatarColor,
          };
        } else if (room.type === RoomType.GROUP) {
          receiver = {
            name: room.name,
            image: room.avatar,
          } as User;
        } else {
          throw new BadRequestException('Invalid type room');
        }
        return {
          id: room.id,
          type: room.type,
          receiver,
          lastestMessage: lastestMessage
            ? {
                ...lastestMessage,
                timeBefore,
              }
            : null,
        };
      }),
    );
    const filteredResults = results.filter((i) => i !== null);
    const sortedResults = filteredResults.sort((a, b) => {
      // Room có tin nhắn mới nhất xếp trước
      const aTime = a.lastestMessage?.createdAt || new Date(0);
      const bTime = b.lastestMessage?.createdAt || new Date(0);

      return new Date(bTime).getTime() - new Date(aTime).getTime();
    });
    return sortedResults;
  }

  async getDetailRoom(userId: string, roomId: string) {
    const room = await this.roomRepository.findOne({
      where: { id: roomId },
      relations: ['users'],
      select: {
        id: true,
        theme: true,
        avatar: true,
        type: true,
        name: true,
        admin: {
          id: true,
          name: true,
          username: true,
          avatarColor: true,
          image: true,
        },
        users: {
          id: true,
          name: true,
          username: true,
          avatarColor: true,
          image: true,
        },
      },
    });
    if (!room) {
      throw new BadRequestException('Room was not found');
    }
    return room;
  }

  async getFiles(userId: string, roomId: string) {
    const room = await this.roomRepository.findOne({
      where: { id: roomId },
      relations: ['users'],
      select: {
        id: true,
        users: { id: true },
      },
    });

    if (!room) {
      throw new BadRequestException('Room was not found');
    }

    if (userId && !room.users.some((u) => u.id === userId)) {
      throw new BadRequestException('Forbidden Exception');
    }

    const uploads = await this.uploadRepository.find({
      where: {
        chat: {
          room: { id: roomId },
        },
      },
      relations: ['user', 'chat'],
      select: {
        id: true,
        url: true,
        type: true,
        createdAt: true,
        user: {
          id: true,
          name: true,
          username: true,
          avatarColor: true,
          image: true,
        },
      },
      order: { createdAt: 'DESC' },
    });

    return uploads;
  }

  async findById(roomId: string) {
    return await this.roomRepository.findOne({ where: { id: roomId } });
  }
}
