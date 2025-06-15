import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Query,
  Request,
  BadRequestException,
  UploadedFiles,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { JwtAuthGuard } from '@/auths/passport/jwt-auth.guard';
import { PublicOptional } from '@/auths/decorator/customize';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import {
  FileValidationService,
  MulterConfigService,
} from './config/multer.config';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { Throttle } from '@nestjs/throttler';

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
  // @Throttle({ default: { limit: 1, ttl: 90000 } })
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'images', maxCount: 9 },
        { name: 'video', maxCount: 1 },
      ],
      MulterConfigService.getConfig(),
    ),
  )
  async create(
    @Body('content') content: string,
    @Request() req: AuthenticatedRequest,
    @UploadedFiles()
    files: {
      images?: Express.Multer.File[];
      video?: Express.Multer.File[];
    },
  ) {
    if (!content || content.trim() === '') {
      throw new BadRequestException('Nội dung không được để trống');
    }

    if (files?.images) {
      FileValidationService.validateImages(files.images);
    }
    if (files?.video && files.video.length > 0) {
      FileValidationService.validateVideo(files.video[0]);
    }

    const createPostDto: CreatePostDto = {
      content: content.trim(),
    };

    return await this.postsService.createPost(
      createPostDto,
      req.user.id,
      files,
    );
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
