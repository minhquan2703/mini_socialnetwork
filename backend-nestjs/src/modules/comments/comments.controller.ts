import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Query,
  Request,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '@/auths/passport/jwt-auth.guard';
import { PublicOptional } from '@/auths/decorator/customize';
import { Throttle } from '@nestjs/throttler';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    username: string;
  };
}

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @Throttle({ default: { limit: 1, ttl: 5000 } })
  create(@Body() createCommentDto: CreateCommentDto, @Req() req) {
    const userId = req.user.id;
    return this.commentsService.create(createCommentDto, userId);
  }

  @Get('getallcomment-post')
  @PublicOptional()
  async getAllCommentOfOnePost(
    @Query() query: string,
    @Query('current') current: number,
    @Query('pageSize') pageSize: number,
    @Query('postId') postId: string,
    @Request() req: AuthenticatedRequest,
  ) {
    const userId = req.user?.id || null;
    return await this.commentsService.getAllCommentOfOnePost(
      query,
      +current,
      +pageSize,
      userId,
      postId,
    );
  }

  @Get('childcomment')
  @PublicOptional()
  async getChildComment(
    @Query() query: string,
    @Query('current') current: number,
    @Query('pageSize') pageSize: number,
    @Query('commentId') commentId: string,
    @Request() req: AuthenticatedRequest,
  ) {
    const userId = req.user?.id || null;
    return await this.commentsService.getChildComment(
      query,
      +current,
      +pageSize,
      userId,
      commentId,
    );
  }
}
