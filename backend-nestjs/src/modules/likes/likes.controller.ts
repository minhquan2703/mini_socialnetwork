import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { LikesService } from './likes.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { JwtAuthGuard } from '@/auths/passport/jwt-auth.guard';

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
}
