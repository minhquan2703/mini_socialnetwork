import { IsEnum, IsNotEmpty } from 'class-validator';
import { RoomType } from '../entities/room.entity';

export class CreateRoomDto {
  @IsNotEmpty({ message: 'receiverId không được trống' })
  receiverId: string;

  @IsNotEmpty({ message: 'type không được để trống' })
  @IsEnum(RoomType)
  type: RoomType;
}
