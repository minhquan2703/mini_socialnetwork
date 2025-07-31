import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateChildCommentDto } from './dto/create-child-comment.dto';
import { User } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../comments/entities/comment.entity';
import { ChildComment } from './entities/child-comment.entity';
import dayjs from 'dayjs';
import { UpdateChildCommentDto } from './dto/update-child-comment.dto';

@Injectable()
export class ChildCommentsService {
  constructor(
    @InjectRepository(ChildComment)
    private childCommentRepository: Repository<ChildComment>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}
  async handleCreateChildComment(
    createChildCommentDto: CreateChildCommentDto,
    userId: string,
  ) {
    const { commentId, content } = createChildCommentDto;
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('Error Authenticated');
    }
    const comment = await this.commentRepository.findOne({
      where: { id: commentId },
    });
    if (!comment) {
      throw new BadRequestException('invalid Comment');
    }

    const createdAtFormat = dayjs().format('DD/MM/YYYY [-] HH[:]mm');
    const childComment = new ChildComment();
    const timeBefore = dayjs(childComment.createdAt).fromNow();
    childComment.content = content;
    childComment.user = user;
    childComment.comment = comment;

    await this.childCommentRepository.save(childComment);
    return {
      id: childComment.id,
      content: childComment.content,
      createAt: createdAtFormat,
      timeBefore,
      likeCount: 0,
      isLiked: false,
      isAuthor: true,
      user: {
        id: childComment.user.id,
        username: childComment.user.username,
        name: childComment.user.name,
        image: childComment.user.image,
        avatarColor: childComment.user.avatarColor,
      },
    };
  }

  async remove(id: string, userId: string) {
    const childComment = await this.childCommentRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!childComment) {
      throw new BadRequestException('Child comment was not found');
    }
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('User was not found');
    }
    if (user.role !== 'ADMIN') {
      if (childComment.user.id !== userId) {
        throw new ForbiddenException('Forbidden Exception');
      }
    }
    await this.childCommentRepository.delete(id);
    return { deleted: true, id: id };
  }

  async update(updateChildCommentDto: UpdateChildCommentDto, userId: string) {
    const { id, content } = updateChildCommentDto;
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('User was not found');
    }
    const childComment = await this.childCommentRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!childComment) {
      throw new BadRequestException('Child comment was not found');
    }
    if (childComment.user.id !== userId) {
      throw new ForbiddenException('Forbidden Exception');
    }
    await this.childCommentRepository.update(id, { content: content });
    return { id, content };
  }
}
