import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { AuthsModule } from '@/auths/auths.module';
import { User } from '../users/entities/user.entity';
import { RoomsService } from '../rooms/rooms.service';
import { Room } from '../rooms/entities/room.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Chat, User, Room]), AuthsModule],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway, RoomsService],
})
export class ChatModule {}
