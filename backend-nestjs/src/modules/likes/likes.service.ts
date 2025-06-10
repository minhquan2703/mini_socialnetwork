import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateLikeDto, LikeType } from './dto/create-like.dto';
import { UpdateLikeDto } from './dto/update-like.dto';
import { Like } from './entities/like.entity';
import { Post } from '../posts/entities/post.entity';
import { Repository } from 'typeorm';
import { Comment } from '../comments/entities/comment.entity';
import { Photo } from '../photos/entities/photo.entity';
import { User } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private likesRepository: Repository<Like>,
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    @InjectRepository(Photo)
    private photosRepository: Repository<Photo>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async toggleLike(createLikeDto: CreateLikeDto, userId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    let whereCondition: any = { user: { id: userId } };
    let entity: any = null;
    let entityType: string;

    switch (createLikeDto.type) {
      case LikeType.POST:
        if (!createLikeDto.postId) {
          throw new BadRequestException('postId is required');
        }

        entity = await this.postsRepository.findOne({
          where: { id: createLikeDto.postId },
        });

        if (!entity) {
          throw new NotFoundException('Post not found');
        }

        whereCondition.post = { id: createLikeDto.postId };
        entityType = 'post';
        break;

      case LikeType.COMMENT:
        if (!createLikeDto.commentId) {
          throw new BadRequestException('commentId is required');
        }

        entity = await this.commentsRepository.findOne({
          where: { id: createLikeDto.commentId },
        });

        if (!entity) {
          throw new NotFoundException('Comment not found');
        }

        whereCondition.comment = { id: createLikeDto.commentId };
        entityType = 'comment';
        break;

      case LikeType.PHOTO:
        if (!createLikeDto.photoId) {
          throw new BadRequestException('photoId is required');
        }

        entity = await this.photosRepository.findOne({
          where: { id: createLikeDto.photoId },
        });

        if (!entity) {
          throw new NotFoundException('Photo not found');
        }

        whereCondition.photo = { id: createLikeDto.photoId };
        entityType = 'photo';
        break;

      default:
        throw new BadRequestException('Invalid like type');
    }

    const existingLike = await this.likesRepository.findOne({
      where: whereCondition,
    });

    if (existingLike) {
      await this.likesRepository.remove(existingLike);
      return {
        action: 'unliked',
        message: `Successfully unliked ${entityType}`,
        isLiked: false,
      };
    } else {
      const like = new Like();
      like.user = user;

      switch (createLikeDto.type) {
        case LikeType.POST:
          like.post = entity;
          break;
        case LikeType.COMMENT:
          like.comment = entity;
          break;
        case LikeType.PHOTO:
          like.photo = entity;
          break;
      }

      const savedLike = await this.likesRepository.save(like);

      return {
        action: 'liked',
        message: `Successfully liked ${entityType}`,
        isLiked: true,
        user: {
          id: user.id,
          name: user?.name,
          username: user.username,
        },
        like: {
          id: savedLike.id,
          createdAt: savedLike.createdAt,
        },
      };
    }
  }

  async checkLikeStatus(type: LikeType, entityId: string, userId: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });
    let whereCondition: any = { user: { id: userId } };

    switch (type) {
      case LikeType.POST:
        whereCondition.post = { id: entityId };
        break;
      case LikeType.COMMENT:
        whereCondition.comment = { id: entityId };
        break;
      case LikeType.PHOTO:
        whereCondition.photo = { id: entityId };
        break;
    }

    const like = await this.likesRepository.findOne({
      where: whereCondition,
    });

    return {
      isLiked: !!like,
      likeId: like?.id || null,
      user: {
        id: user?.id,
        name: user?.name,
        username: user?.username,
      },
    };
  }

  async getEntityLikes(type: LikeType, entityId: string) {
    let whereCondition: any = {};

    switch (type) {
      case LikeType.POST:
        whereCondition.post = { id: entityId };
        break;
      case LikeType.COMMENT:
        whereCondition.comment = { id: entityId };
        break;
      case LikeType.PHOTO:
        whereCondition.photo = { id: entityId };
        break;
      default:
        throw new BadRequestException('không thể xác định vật thể được like');
    }

    const likes = await this.likesRepository.find({
      where: whereCondition,
      relations: ['user'],
    });

    return {
      count: likes.length,
      likes: likes.map((like) => ({
        id: like.id,
        user: {
          id: like.user.id,
          username: like.user.username,
          name: like.user.name,
        },
        createdAt: like.createdAt,
      })),
    };
  }
}
