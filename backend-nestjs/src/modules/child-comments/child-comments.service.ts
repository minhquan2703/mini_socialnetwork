import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateChildCommentDto } from './dto/create-child-comment.dto';
import { User } from '../users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../comments/entities/comment.entity';
import { ChildComment } from './entities/child-comment.entity';
import dayjs from 'dayjs';

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
    childComment.content = content;
    childComment.user = user;
    childComment.comment = comment;

    await this.childCommentRepository.save(childComment);
    return {
      id: childComment.id,
      content: childComment.content,
      createdAtFormat,
      likeCount: 0,
      isLiked: false,
      user: {
        id: childComment.user.id,
        username: childComment.user.username,
        name: childComment.user.name,
        image: childComment.user.image,
        avatarColor: childComment.user.avatarColor,
      },
    };
  }
}
