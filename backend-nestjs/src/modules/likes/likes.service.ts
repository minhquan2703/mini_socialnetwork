import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateLikeDto } from './dto/create-like.dto';
import { Like, LikeType } from './entities/like.entity';
import { Post } from '../posts/entities/post.entity';
import { Repository } from 'typeorm';
import { Comment } from '../comments/entities/comment.entity';
import { Photo } from '../photos/entities/photo.entity';
import { User } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ChildComment } from '../child-comments/entities/child-comment.entity';

type LikeWhereCondition = {
  user: { id: string };
  post?: { id: string };
  comment?: { id: string };
  childComment?: { id: string };
  photo?: { id: string };
};

@Injectable()
export class LikesService {
  constructor(
    @InjectRepository(Like)
    private likesRepository: Repository<Like>,
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    @InjectRepository(ChildComment)
    private childCommentsRepository: Repository<ChildComment>,
    @InjectRepository(Photo)
    private photosRepository: Repository<Photo>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async toggleLike(createLikeDto: CreateLikeDto, userId: string) {
    const { postId, commentId, photoId, childCommentId, type } = createLikeDto;

    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const whereCondition: LikeWhereCondition = { user: { id: userId } };
    let entity: Post | Comment | Photo | ChildComment | null = null;
    let entityType: string;

    switch (type) {
      case LikeType.POST:
        if (!postId) {
          throw new BadRequestException('postId is required');
        }

        entity = await this.postsRepository.findOne({
          where: { id: postId },
        });

        if (!entity) {
          throw new NotFoundException('Post not found');
        }

        whereCondition.post = { id: postId };
        entityType = 'post';
        break;

      case LikeType.COMMENT:
        if (!createLikeDto.commentId) {
          throw new BadRequestException('commentId is required');
        }

        entity = await this.commentsRepository.findOne({
          where: { id: commentId },
        });

        if (!entity) {
          throw new NotFoundException('Comment not found');
        }

        whereCondition.comment = { id: commentId };
        entityType = 'comment';
        break;

      case LikeType.CHILDCOMMENT:
        if (!childCommentId) {
          throw new BadRequestException('childCommentId is required');
        }
        entity = await this.childCommentsRepository.findOne({
          where: { id: childCommentId },
        });
        if (!entity) {
          throw new BadRequestException('ChildComment has not found');
        }
        whereCondition.childComment = { id: childCommentId };
        entityType = 'child-comment';
        break;

      case LikeType.PHOTO:
        if (photoId) {
          throw new BadRequestException('photoId is required');
        }

        entity = await this.photosRepository.findOne({
          where: { id: photoId },
        });

        if (!entity) {
          throw new NotFoundException('Photo has not found');
        }

        whereCondition.photo = { id: photoId };
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
        isLiked: false,
      };
    } else {
      const like = new Like();
      like.user = user;
      like.type = type;
      switch (type) {
        case LikeType.POST:
          like.post = entity as Post;
          break;
        case LikeType.COMMENT:
          like.comment = entity as Comment;
          break;
        case LikeType.CHILDCOMMENT:
          like.childComment = entity as ChildComment;
          break;
        case LikeType.PHOTO:
          like.photo = entity as Photo;
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
}
