import {
  Controller,
  Get,
  Body,
  UseGuards,
  Query,
  Request,
  Delete,
  Param,
  Post,
  UseInterceptors,
  UploadedFiles,
  Req,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { JwtAuthGuard } from '@/auths/passport/jwt-auth.guard';
import { PublicOptional } from '@/auths/decorator/customize';
import { SkipThrottle } from '@nestjs/throttler';
import { CommentsService } from '../comments/comments.service';
import { AuthenticatedRequest } from '@/auths/auths.controller';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly commentsService: CommentsService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('files', 9))
  async create(
    @Body() createPostDto: CreatePostDto,
    @UploadedFiles() files: Express.Multer.File[],
    @Req() req: AuthenticatedRequest,
  ) {
    const post = await this.postsService.createPost(
      createPostDto,
      files,
      req.user.id,
    );

    return {
      message: 'Post created successfully',
      data: post,
    };
  }

  @Get(':postId/comments')
  @PublicOptional()
  async getComments(
    @Query() query: string,
    @Param('postId') postId: string,
    @Query('current') current: number,
    @Query('pageSize') pageSize: number,
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

  @Get()
  @PublicOptional()
  @SkipThrottle({ default: true })
  async findAll(
    @Query() query: string,
    @Query('current') current: number,
    @Query('pageSize') pageSize: number,
    @Request() req: AuthenticatedRequest,
  ) {
    const userId = req.user?.id || null;

    return await this.postsService.getAll(query, +current, +pageSize, userId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    const userId = req.user?.id;
    return this.postsService.remove(id, userId);
  }

  // @Patch('')
  // @UseGuards(JwtAuthGuard)
  // @SkipThrottle({ default: true })
  // async edit() {
  //   return await this.postsService.editPost()
  // }
}
