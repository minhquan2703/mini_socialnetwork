import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { User } from '../users/entities/user.entity';
import { Chat } from '../chat/entities/chat.entity';
import { Upload } from '../uploads/entities/upload.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Room, User, Chat, Upload])],
  controllers: [RoomsController],
  providers: [RoomsService],
  exports: [RoomsService],
})
export class RoomsModule {}
