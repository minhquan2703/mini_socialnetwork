import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { Photo } from '../photos/entities/photo.entity';
import { Post } from '../posts/entities/post.entity';
import { User } from '../users/entities/user.entity';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(Photo)
    private photoRepository: Repository<Photo>,
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}
  // create(createCommentDto: CreateCommentDto) {
  //   return 'This action adds a new comment';
  // }
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
    await this.commentRepository.save(comment);
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
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
      },
    };
  }

  findAll() {
    return `This action returns all comments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} comment`;
  }

  update(id: number, updateCommentDto: UpdateCommentDto) {
    return `This action updates a #${id} comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
