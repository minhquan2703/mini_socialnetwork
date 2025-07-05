import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikesController } from './likes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from './entities/like.entity';
import { Post } from '../posts/entities/post.entity';
import { Comment } from '../comments/entities/comment.entity';
import { Photo } from '../photos/entities/photo.entity';
import { User } from '../users/entities/user.entity';
import { ChildComment } from '../child-comments/entities/child-comment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Like, Post, Comment, ChildComment, Photo, User]),
  ],
  controllers: [LikesController],
  providers: [LikesService],
})
export class LikesModule {}
