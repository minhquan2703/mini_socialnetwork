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
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'images', maxCount: 10 }, // Tối đa 10 ảnh
        { name: 'video', maxCount: 1 }, // Tối đa 1 video
      ],
      MulterConfigService.getConfig(),
    ), // ← Sử dụng config từ service
  )
  async create(
    @Body('content') content: string, // ← Lấy trực tiếp field content
    @Request() req: AuthenticatedRequest,
    @UploadedFiles()
    files: {
      images?: Express.Multer.File[];
      video?: Express.Multer.File[];
    },
  ) {
    console.log('=== UNIFIED CREATE POST ===');
    console.log('Content:', content);
    console.log('Images:', files?.images?.length || 0);
    console.log('Video:', files?.video?.length || 0);

    // Manual validation cho content
    if (!content || content.trim() === '') {
      throw new BadRequestException('Nội dung không được để trống');
    }

    // Validate files nếu có
    if (files?.images) {
      FileValidationService.validateImages(files.images);
    }
    if (files?.video && files.video.length > 0) {
      FileValidationService.validateVideo(files.video[0]);
    }

    // Tạo DTO object
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
