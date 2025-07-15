import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '@/auths/passport/jwt-auth.guard';
import { SkipThrottle } from '@nestjs/throttler';

@SkipThrottle()
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get(':roomId')
  @UseGuards(JwtAuthGuard)
  async getMessages(@Param('roomId') roomId: string, @Req() req: any) {
    const userId = req.user.id;
    return this.chatService.getMessagesByRoom(roomId, userId);
  }
}
