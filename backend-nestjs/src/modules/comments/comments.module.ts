import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Photo } from '../photos/entities/photo.entity';
import { Post } from '../posts/entities/post.entity';
import { User } from '../users/entities/user.entity';
import { ChildComment } from '../child-comments/entities/child-comment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment, Photo, Post, User, ChildComment]),
  ],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
