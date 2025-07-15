import {
  Controller,
  Get,
  Param,
  UseGuards,
  Req,
  Post,
  Body,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { JwtAuthGuard } from '@/auths/passport/jwt-auth.guard';
import { CreateRoomDto } from './dto/create-room.dto';
import { AuthenticatedRequest } from '@/auths/auths.controller';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post('private')
  @UseGuards(JwtAuthGuard)
  async createPrivatedRoomChat(
    @Body() createRoomDto: CreateRoomDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const senderId = req.user.id;
    return await this.roomsService.privatedChat(createRoomDto, senderId);
  }
  @Get('/detail/:roomId')
  @UseGuards(JwtAuthGuard)
  async getDetailRoom(
    @Param('roomId') roomId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.id;
    return await this.roomsService.getDetailRoom(userId, roomId);
  }
  @Get('all')
  @UseGuards(JwtAuthGuard)
  async getAllRooms(@Req() req: AuthenticatedRequest) {
    const userId = req.user.id;
    return await this.roomsService.getAllRooms(userId);
  }
}
