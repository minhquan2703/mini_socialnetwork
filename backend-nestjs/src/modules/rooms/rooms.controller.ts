import { Controller, Get, Param, UseGuards, Req, Post, Body } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { JwtAuthGuard } from '@/auths/passport/jwt-auth.guard';
import { CreateRoomDto } from './dto/create-room.dto';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    username: string;
  };
}

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

  @Get('all')
  @UseGuards(JwtAuthGuard)
  async getAllRooms(@Req() req: AuthenticatedRequest) {
    const userId = req.user.id;
    return await this.roomsService.getAllRooms(userId);
  }
}
