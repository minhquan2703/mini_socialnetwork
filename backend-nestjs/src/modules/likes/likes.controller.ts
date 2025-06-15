import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  ParseEnumPipe,
  ParseUUIDPipe,
} from '@nestjs/common';
import { LikesService } from './likes.service';
import { CreateLikeDto, LikeType } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';
import { JwtAuthGuard } from '@/auths/passport/jwt-auth.guard';
import { Throttle } from '@nestjs/throttler';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    username: string;
  };
}
@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post('toggle')
  @UseGuards(JwtAuthGuard)
  async toggleLike(
    @Body() createLikeDto: CreateLikeDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return await this.likesService.toggleLike(createLikeDto, req.user.id);
  }

  //check like status của user
  @Get('status/:type/:entityId')
  @UseGuards(JwtAuthGuard)
  async checkLikeStatus(
    @Param('type', new ParseEnumPipe(LikeType)) type: LikeType,
    @Param('entityId', ParseUUIDPipe) entityId: string,
    @Req() req: AuthenticatedRequest,
  ) {
    return await this.likesService.checkLikeStatus(type, entityId, req.user.id);
  }

  //lấy tất cả lượt like của user
  @Get(':type/:entityId')
  async getEntityLikes(
    @Param('type', new ParseEnumPipe(LikeType)) type: LikeType,
    @Param('entityId', ParseUUIDPipe) entityId: string,
  ) {
    return await this.likesService.getEntityLikes(type, entityId);
  }
}
