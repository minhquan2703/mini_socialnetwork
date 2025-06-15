import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { Photo } from '../photos/entities/photo.entity';
import { Post } from '../posts/entities/post.entity';
import { User } from '../users/entities/user.entity';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import aqp from 'api-query-params';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    @InjectRepository(Photo)
    private photoRepository: Repository<Photo>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createCommentDto: CreateCommentDto, userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('người dùng không tồn tại');
    }
    if (!createCommentDto.photoId && !createCommentDto.postId) {
      throw new BadRequestException('Phải cung cấp postId hoặc photoId');
    }
    if (createCommentDto.postId && createCommentDto.photoId) {
      throw new BadRequestException(
        'Không thể bình luận cho cả bài viết và ảnh cùng lúc',
      );
    }
    let post;
    if (createCommentDto.postId) {
      post = await this.postRepository.findOne({
        where: { id: createCommentDto.postId },
      });
      if (!post) {
        throw new BadRequestException('Bài viết không tồn tại');
      }
    }
    let photo;
    if (createCommentDto.photoId) {
      photo = await this.photoRepository.findOne({
        where: { id: createCommentDto.photoId },
      });
      if (!photo) {
        throw new BadRequestException('Ảnh không tồn tại');
      }
    }
    const comment = new Comment();
    comment.content = createCommentDto.content || '';
    comment.user = user;
    if (post) {
      comment.post = post;
    }
    if (photo) {
      comment.photo = photo;
    }
    await this.commentsRepository.save(comment);
    const timeBefore = dayjs(comment.createdAt).fromNow();
    const createdAtFormat = dayjs(comment.createdAt).format(
      'DD/MM/YYYY [lúc] hh [giờ] mm [phút]',
    );
    const updatedAtFormat = dayjs(comment.updatedAt).format(
      'DD/MM/YYYY [lúc] hh [giờ] mm [phút]',
    );
    dayjs.locale('vi');
    return {
      id: comment.id,
      content: comment.content,
      createdAt: createdAtFormat,
      updatedAt: updatedAtFormat,
      timeBefore: timeBefore,
      likeCount: 0,
      isLiked: false,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        image: user.image,
        avatarColor: user.avatarColor,
      },
    };
  }

  async getAllCommentOfOnePost(
    query: string,
    current: number,
    pageSize: number,
    userId: string | null,
    postId: string,
  ) {
    const post = await this.postRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new BadRequestException('không tìm thấy bài viết');
    }
    const { filter, sort } = aqp(query);
    if (filter.current) delete filter.current;
    if (filter.pageSize) delete filter.pageSize;
    let filterPostId = postId; // Mặc định dùng postId từ parameter
    if (filter.postId) {
      filterPostId = filter.postId; // Có thể override bằng query string
      delete filter.postId; // Xóa khỏi filter
    }
    if (!current) current = 1;
    if (!pageSize) pageSize = 5;
    const skip = (current - 1) * pageSize;

    const whereCondition = {
      ...filter,
      post: { id: filterPostId }, // Chỉ lấy comment của post này
    };

    // Đếm tổng số comment
    const totalItems = await this.commentsRepository.count({
      where: whereCondition,
    });
    const totalPages = Math.ceil(totalItems / pageSize);

    const data = await this.commentsRepository.find({
      where: whereCondition,
      take: pageSize,
      skip: skip,
      order: { createdAt: 'DESC', ...sort },
      relations: [`user`, `likes`, `likes.user`],
      select: {
        id: true,
        content: true,
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
      data.map(async (comment) => {
        // Tính tổng số likes
        const likeCount = comment.likes?.length || 0;

        const timeBefore = dayjs(comment.createdAt).fromNow();
        const createdAtFormat = dayjs(comment.createdAt).format(
          'DD/MM/YYYY [lúc] HH[:]mm',
        );
        const updatedAtFormat = dayjs(comment.updatedAt).format(
          'DD/MM/YYYY [lúc] HH[:]mm',
        );

        // Kiểm tra user hiện tại đã like chưa (chỉ khi có userId)
        const isLiked = userId
          ? comment.likes?.some((like) => like.user.id === userId) || false
          : undefined;

        const { likes, ...commentWithoutLikes } = comment;

        return {
          ...commentWithoutLikes,
          likeCount,
          timeBefore,
          createdAt: createdAtFormat,
          updatedAt: updatedAtFormat,
          ...(userId && { isLiked }),
        };
      }),
    );

    return { results, totalPages };
  }
}
