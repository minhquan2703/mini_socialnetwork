import { Module } from '@nestjs/common';
import { ChildCommentsService } from './child-comments.service';
import { ChildCommentsController } from './child-comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChildComment } from './entities/child-comment.entity';
import { Comment } from '../comments/entities/comment.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ChildComment, Comment, User])],
  controllers: [ChildCommentsController],
  providers: [ChildCommentsService],
})
export class ChildCommentsModule {}
