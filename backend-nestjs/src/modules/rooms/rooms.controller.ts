import { Controller, Get, Body, Param, UseGuards, Req } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { JwtAuthGuard } from '@/auths/passport/jwt-auth.guard';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    username: string;
  };
}

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get('private/:receiverId')
  @UseGuards(JwtAuthGuard)
  async createPrivatedRoomChat(
    @Param('receiverId') receiverId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const senderId = req.user.id;
    return await this.roomsService.privatedChat(receiverId, senderId);
  }

  @Get('all')
  @UseGuards(JwtAuthGuard)
  async getAllRooms(@Req() req: AuthenticatedRequest) {
    const userId = req.user.id;
    return await this.roomsService.getAllRooms(userId);
  }
}
