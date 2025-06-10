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
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { JwtAuthGuard } from '@/auths/passport/jwt-auth.guard';
import { PublicOptional } from '@/auths/decorator/customize';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    username: string;
  };
}
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createPostDto: CreatePostDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return await this.postsService.create(createPostDto, req.user.id);
  }

  @Get()
  @PublicOptional()
  async findAll(
    @Query() query: string,
    @Query('current') current: number,
    @Query('pageSize') pageSize: number,
    @Request() req: AuthenticatedRequest,
  ) {
    const userId = req.user?.id || null;

    return await this.postsService.getAll(query, +current, +pageSize, userId);
  }
}
