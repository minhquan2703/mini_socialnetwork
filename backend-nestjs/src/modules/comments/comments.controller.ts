import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Query,
  Request,
  Delete,
  Param,
  Put,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { JwtAuthGuard } from '@/auths/passport/jwt-auth.guard';
import { PublicOptional } from '@/auths/decorator/customize';
import { SkipThrottle, Throttle } from '@nestjs/throttler';
import { AuthenticatedRequest } from '@/auths/auths.controller';
import { UpdateCommentDto } from './dto/update-comment.dto';

@SkipThrottle()
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @SkipThrottle({ default: false })
  @Throttle({ default: { limit: 1, ttl: 5000 } })
  create(
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: AuthenticatedRequest,
  ) {
    const userId = req.user.id;
    return this.commentsService.create(createCommentDto, userId);
  }

  @Get('all')
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

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    const userId = req.user?.id;
    return this.commentsService.remove(id, userId);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  update(
    @Body() updateCommentDto: UpdateCommentDto,
    @Request() req: AuthenticatedRequest,
  ) {
    const userId = req.user?.id;
    return this.commentsService.update(updateCommentDto, userId);
  }
}
