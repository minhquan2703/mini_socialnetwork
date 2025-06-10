import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MediaType, Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Like } from '../likes/entities/like.entity';
import { Comment } from '../comments/entities/comment.entity';
import aqp from 'api-query-params';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Like)
    private likesRepository: Repository<Like>,
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
  ) {}
  createtest(createPostDto: CreatePostDto) {
    return createPostDto;
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
      order: sort,
      relations: [`user`, `likes`, `likes.user`, `comments`, `comments.user`],
      select: {
        id: true,
        content: true,
        mediaType: true,
        mediaURL: true,
        comments: {
          id: true,
          content: true,
          user: {
            id: true,
            username: true,
            name: true,
          },
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
        },
        createdAt: true,
        updatedAt: true,
      },
    });
    const results = data.map((post) => {
      // Tính tổng số likes
      const likeCount = post.likes?.length || 0;

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
        ...(userId && { isLiked }), // Chỉ thêm field isLiked khi có userId
      };
    });
    return { results, totalPages };
  }

  async create(createPostDto: CreatePostDto, userId: string) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('người dùng không tồn tại');
    }
    const post = new Post();
    post.content = createPostDto.content || 'haha';
    post.user = user;
    post.mediaType = createPostDto.mediaType || MediaType.TEXT;

    return await this.postRepository.save(post);
  }
}
