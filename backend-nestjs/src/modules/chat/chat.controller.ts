import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '@/auths/passport/jwt-auth.guard';
import { SkipThrottle } from '@nestjs/throttler';
import { CreateChatDto } from './dto/create-chat.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthenticatedRequest } from '@/auths/auths.controller';

@SkipThrottle()
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('files'))
  async postMessage(
    @Body() dto: CreateChatDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: AuthenticatedRequest,
  ) {
    return await this.chatService.saveMessage(dto, req.user.id, files);
  }

  @Get(':roomId')
  @UseGuards(JwtAuthGuard)
  async getMessages(
    @Param('roomId') roomId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.id;
    return this.chatService.getMessagesByRoom(roomId, userId);
  }
}
