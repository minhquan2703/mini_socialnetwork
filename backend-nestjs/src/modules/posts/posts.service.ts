// posts.service.ts - Phiên bản đã sửa
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Like } from '../likes/entities/like.entity';
import { Comment } from '../comments/entities/comment.entity';
import aqp from 'api-query-params';
import dayjs from 'dayjs';
import { validate as isUuid } from 'uuid';
import _ from 'lodash';
import { UploadsService } from '../uploads/uploads.service';

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
    private uploadsService: UploadsService,
  ) {}
  async createPost(
    createPostDto: CreatePostDto,
    files: Express.Multer.File[],
    userId: string,
  ) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('User was not found');
    }
    const { content } = createPostDto;
    const post = new Post();
    post.content = content;
    post.user = user;

    //upload files nếu có
    if (files && files.length > 0) {
      const uploads = await this.uploadsService.uploadMultiplePost(
        files,
        userId,
      );
      post.uploads = uploads;
    }
    const savedPost = await this.postRepository.save(post);

    return {
      id: savedPost.id,
      content: savedPost.content,
      isLiked: false,
      likeCount: 0,
      commentCount: 0,
      user: {
        id: user.id,
        image: user.image,
        avatarColor: user.avatarColor,
        name: user.name,
        username: user.username,
      },
    };
  }

  async findOne(id: string) {
    const post = await this.postRepository.findOne({
      where: { id },
      relations: ['user', 'uploads'],
    });
    return post;
  }

  async findAll(): Promise<Post[]> {
    return this.postRepository.find({
      relations: ['user', 'uploads'],
      order: { createdAt: 'DESC' },
    });
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
      relations: [`user`, `likes`, `likes.user`, `uploads`],
      select: {
        id: true,
        content: true,
        uploads: {
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
    // Xóa tất cả uploads liên quan
    if (post.uploads.length > 0) {
      for (const upload of post.uploads) {
        await this.uploadsService.deleteUpload(upload.id);
      }
    }
    const result = await this.postRepository.delete(id);
    if (result.affected === 0) {
      throw new BadRequestException('có lỗi xảy ra trong quá trình xoá');
    }
    return { deleted: true };
  }
}
