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
import { validate as isUuid } from 'uuid';
import _ from 'lodash';

@Injectable()
export class PostsService {
  private readonly baseUrl = `${process.env.BACKEND_URL}`;

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

      const savedPost = await this.postRepository.save(post);

      // XỬ LÝ MULTIPLE IMAGES
      let photos: Array<{ id: string; url: string }> = [];

      if (finalMediaType === MediaType.IMAGE && files?.images) {
        try {
          for (const file of files.images) {
            const photo = this.photosRepository.create({
              url: this.createFileUrl(file.filename),
              key: file.filename, //thêm key từ filename
              post: savedPost, // Dùng savedPost thay vì post
              user: user,
            });

            const savedPhoto = await this.photosRepository.save(photo);

            photos.push({
              id: savedPhoto.id,
              url: savedPhoto.url,
            });
          }
        } catch (photoError) {
          throw new BadRequestException(
            'Lỗi khi lưu ảnh: ' + photoError.message,
          );
        }
      }

      // RESPONSE
      return {
        id: savedPost.id,
        content: savedPost.content,
        mediaType: savedPost.mediaType,
        mediaURL: savedPost.mediaURL,
        photos: photos.length > 0 ? photos : [],
        likeCount: 0,
        commentCount: 0,
        isLiked: false,
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          avatarColor: user.avatarColor,
          image: user.image,
        },
        timeBefore: dayjs(savedPost.createdAt).fromNow(),
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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
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
      relations: [`user`, `likes`, `likes.user`, `photos`],
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

    const results = await Promise.all(
      data.map(async (post) => {
        //đếm like của mỗi post
        const likeCount = post.likes?.length || 0;

        //đếm comments riêng (không load toàn bộ data)
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

        //kiểm tra user hiện tại đã like chưa (chỉ khi có userId)
        const isLiked = userId
          ? post.likes?.some((like) => like.user.id === userId) || false
          : undefined;

        //lọại bỏ mảng likes khỏi response để bảo mật
        const { likes, ...postWithoutLikes } = post;

        //kiểm tra xem có phải tác giả ko
        const isAuthor = userId ? post.user.id === userId : undefined;

        return {
          ...postWithoutLikes,
          likeCount,
          commentCount,
          timeBefore,
          createdAt: createdAtFormat,
          updatedAt: updatedAtFormat,
          ...(userId && { isLiked, isAuthor }), //chỉ thêm field isLiked & isAuthor khi có userId
        };
      }),
    );

    return { results, totalPages, current };
  }

  async getAllUpdated(
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

    const allPosts = await this.postRepository.find({
      where: filter,
      relations: [`user`, `likes`, `likes.user`, `photos`],
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

    //tách mảng các bài post nhiều like nhất
    const sortedByLiked = [...allPosts].sort(
      (a, b) => (b.likes.length || 0) - (a.likes.length || 0),
    );
    const topLikedPosts = sortedByLiked.slice(0, 10);

    //tạo mảng không trùng lặp
    const topLikedPostsId = new Set(topLikedPosts.map((post) => post.id));
    const remainingPosts = allPosts.filter((p) => !topLikedPostsId.has(p.id));

    //random 2 mảng
    const randomTopLikedPosts = _.shuffle(topLikedPosts);
    const randomRemainingPosts = _.shuffle(remainingPosts.filter);
    const finalList = [...randomTopLikedPosts, ...randomRemainingPosts];
  }

  // xoá 1 bài viết
  async remove(id: string, userId: string) {
    if (!isUuid(id) || !isUuid(userId)) {
      throw new BadRequestException('ID không đúng định dạng');
    }

    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!post) {
      throw new BadRequestException('Bài viết không tồn tại');
    }

    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('Người dùng không tồn tại');
    }

    const isAuthor = post.user.id === user.id;
    const isAdmin = user.role === 'ADMIN';

    if (!isAuthor && !isAdmin) {
      throw new BadRequestException('Bạn không có quyền xoá bài viết này');
    }

    const result = await this.postRepository.delete(id);
    if (result.affected === 0) {
      throw new BadRequestException('có lỗi xảy ra trong quá trình xoá');
    }
    return { deleted: true };
  }
}
