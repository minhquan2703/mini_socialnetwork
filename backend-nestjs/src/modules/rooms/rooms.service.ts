import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Room, RoomType } from './entities/room.entity';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
  ) {}

  async createRoomChat(receiverId: string, senderId: string) {
    const sender = await this.userRepository.findOne({
      where: { id: senderId },
    });
    const receiver = await this.userRepository.findOne({
      where: { id: receiverId },
    });
    if (!receiver || !sender) {
      throw new BadRequestException('Error Authenticated');
    }
    const room = this.roomRepository.create({
      type: RoomType.PRIVATE,
      users: [sender, receiver],
    });
    await this.roomRepository.save(room);
    return room;
  }

  async privatedChat(receiverId: string, senderId: string) {
    const rooms = await this.roomRepository.find({
      where: { type: RoomType.PRIVATE },
      relations: ['users'],
    });

    // Tìm phòng có đúng 2 user, gồm cả sender và receiver
    const room = rooms.find(
      (room) =>
        room.users.length === 2 &&
        room.users.some((u) => u.id === senderId) &&
        room.users.some((u) => u.id === receiverId),
    );

    if (room) {
      return { roomId: room.id };
    }
    // Nếu chưa có, tạo mới
    const newRoom = await this.createRoomChat(receiverId, senderId);
    return { roomId: newRoom.id };
  }

  async getAllRooms(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['rooms'],
    });
    return user?.rooms ?? [];
  }

  async findById(roomId: string) {
    return await this.roomRepository.findOne({ where: { id: roomId } });
  }
}
