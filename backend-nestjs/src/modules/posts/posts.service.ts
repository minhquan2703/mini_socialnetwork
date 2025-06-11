// posts.service.ts - Phiên bản đã sửa
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MediaType, Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Like } from '../likes/entities/like.entity';
import { Comment } from '../comments/entities/comment.entity';
import { Photo } from '../photos/entities/photo.entity';
import aqp from 'api-query-params';
import dayjs from 'dayjs';

@Injectable()
export class PostsService {
  private readonly baseUrl = 'http://localhost:8081';

  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Like)
    private likesRepository: Repository<Like>,
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    @InjectRepository(Photo)
    private photosRepository: Repository<Photo>,
  ) {}
  private createFileUrl(filename: string): string {
    return `${this.baseUrl}/uploads/${filename}`;
  }

  async createPost(
    createPostDto: CreatePostDto,
    userId: string,
    files?: {
      images?: Express.Multer.File[];
      video?: Express.Multer.File[];
    },
  ) {
    try {
      // Validate user exists
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new BadRequestException('Người dùng không tồn tại');
      }
      console.log('User found:', user.id);

      // VALIDATION FILES
      if (files?.video && files?.images) {
        throw new BadRequestException(
          'Không thể upload cả video và ảnh cùng lúc',
        );
      }

      if (files?.video && files.video.length > 1) {
        throw new BadRequestException('Chỉ được upload 1 video');
      }

      if (files?.images && files.images.length > 10) {
        throw new BadRequestException('Tối đa 10 ảnh mỗi post');
      }

      // AUTO-DETECT MEDIA TYPE
      let finalMediaType = createPostDto.mediaType || MediaType.TEXT;

      // Override auto-detect nếu có files
      if (files?.video && files.video.length > 0) {
        finalMediaType = MediaType.VIDEO;
      } else if (files?.images && files.images.length > 0) {
        finalMediaType = MediaType.IMAGE;
      }

      console.log('Final media type:', finalMediaType);

      // VALIDATE CONSISTENCY giữa DTO và files
      if (createPostDto.mediaType) {
        if (
          createPostDto.mediaType === MediaType.VIDEO &&
          (!files?.video || files.video.length === 0)
        ) {
          throw new BadRequestException(
            'MediaType là VIDEO nhưng không có file video',
          );
        }

        if (
          createPostDto.mediaType === MediaType.IMAGE &&
          (!files?.images || files.images.length === 0)
        ) {
          throw new BadRequestException(
            'MediaType là IMAGE nhưng không có file ảnh',
          );
        }

        if (
          createPostDto.mediaType === MediaType.TEXT &&
          (files?.video || files?.images)
        ) {
          throw new BadRequestException(
            'MediaType là TEXT nhưng có files đính kèm',
          );
        }
      }

      // TẠO POST
      const post = this.postRepository.create({
        content: createPostDto.content,
        mediaType: finalMediaType,
        user: user,
      });

      // XỬ LÝ MEDIA URL
      let finalMediaURL = createPostDto.mediaURL || null;

      // Auto-generate mediaURL từ uploaded files
      if (finalMediaType === MediaType.VIDEO && files?.video) {
        finalMediaURL = this.createFileUrl(files.video[0].filename);
      }

      // Lưu mediaURL vào post
      if (finalMediaURL) {
        post.mediaURL = finalMediaURL;
      }

      console.log('Saving post...');
      const savedPost = await this.postRepository.save(post);
      console.log('Post saved:', savedPost.id);

      // XỬ LÝ MULTIPLE IMAGES
      let photos: Array<{ id: string; url: string }> = [];

      if (finalMediaType === MediaType.IMAGE && files?.images) {
        console.log('Processing images...');

        try {
          for (const file of files.images) {
            console.log('Processing file:', file.filename);

            const photo = this.photosRepository.create({
              url: this.createFileUrl(file.filename),
              key: file.filename, // Thêm key từ filename
              post: savedPost, // Dùng savedPost thay vì post
              user: user,
            });

            const savedPhoto = await this.photosRepository.save(photo);
            console.log('Photo saved:', savedPhoto.id);

            photos.push({
              id: savedPhoto.id,
              url: savedPhoto.url,
            });
          }
        } catch (photoError) {
          console.error('Error saving photos:', photoError);
          throw new BadRequestException(
            'Lỗi khi lưu ảnh: ' + photoError.message,
          );
        }
      }

      console.log('=== CREATE POST SUCCESS ===');

      // RESPONSE
      return {
        id: savedPost.id,
        content: savedPost.content,
        mediaType: savedPost.mediaType,
        mediaURL: savedPost.mediaURL,
        photos: photos.length > 0 ? photos : [],
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
        },
        createdAt: dayjs(savedPost.createdAt).fromNow(),
        createdAtFormatted: dayjs(savedPost.createdAt).format(
          'DD/MM/YYYY [lúc] HH:mm',
        ),
      };
    } catch (error) {
      console.error('=== CREATE POST ERROR ===');
      console.error('Error details:', error);

      // Re-throw known BadRequestExceptions
      if (error instanceof BadRequestException) {
        throw error;
      }

      // Handle unknown errors
      throw new BadRequestException('Lỗi server: ' + error.message);
    }
  }
  async getAll(
    query: string,
    current: number,
    pageSize: number,
    userId: string | null,
  ) {
    const { filter, sort } = aqp(query);
    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;
    if (!current) current = 1;
    if (!pageSize) pageSize = 10;
    const skip = (current - 1) * pageSize;

    const totalItems = await this.postRepository.count({ where: filter });
    const totalPages = Math.ceil(totalItems / pageSize);

    const data = await this.postRepository.find({
      where: filter,
      take: pageSize,
      skip: skip,
      order: { createdAt: 'DESC', ...sort },
      relations: [`user`, `likes`, `likes.user`, `photos`], // Loại bỏ comments relation
      select: {
        id: true,
        content: true,
        mediaType: true,
        mediaURL: true,
        photos: {
          url: true,
          id: true,
        },
        likes: {
          id: true,
          user: {
            id: true,
          },
        },
        user: {
          id: true,
          name: true,
          username: true,
          image: true,
          avatarColor: true,
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    // Lấy commentCount riêng cho từng post
    const results = await Promise.all(
      data.map(async (post) => {
        // Tính tổng số likes
        const likeCount = post.likes?.length || 0;

        // Đếm comments riêng (không load toàn bộ data)
        const commentCount = await this.commentsRepository.count({
          where: { post: { id: post.id } },
        });

        const timeBefore = dayjs(post.createdAt).fromNow();
        const createdAtFormat = dayjs(post.createdAt).format(
          'DD/MM/YYYY [lúc] HH[:]mm',
        );
        const updatedAtFormat = dayjs(post.updatedAt).format(
          'DD/MM/YYYY [lúc] HH[:]mm',
        );

        // Kiểm tra user hiện tại đã like chưa (chỉ khi có userId)
        const isLiked = userId
          ? post.likes?.some((like) => like.user.id === userId) || false
          : undefined;

        // Loại bỏ mảng likes khỏi response để bảo mật
        const { likes, ...postWithoutLikes } = post;

        // Trả về post với thông tin đã transform
        return {
          ...postWithoutLikes,
          likeCount,
          commentCount,
          timeBefore,
          createdAt: createdAtFormat,
          updatedAt: updatedAtFormat,
          ...(userId && { isLiked }), // Chỉ thêm field isLiked khi có userId
        };
      }),
    );

    return { results, totalPages };
  }
  // async create(createPostDto: CreatePostDto, userId: string) {
  //   const user = await this.userRepository.findOne({ where: { id: userId } });
  //   if (!user) {
  //     throw new BadRequestException('người dùng không tồn tại');
  //   }

  //   const post = this.postRepository.create({
  //     content: createPostDto.content || '',
  //     user: user,
  //     mediaType: createPostDto.mediaType || MediaType.TEXT,
  //   });

  //   return await this.postRepository.save(post);
  // }
}
