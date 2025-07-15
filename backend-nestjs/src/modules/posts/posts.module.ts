import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { User } from '../users/entities/user.entity';
import { Like } from '../likes/entities/like.entity';
import { Comment } from '../comments/entities/comment.entity';
import { CommentsService } from '../comments/comments.service';
import { ChildComment } from '../child-comments/entities/child-comment.entity';
import { UploadsService } from '../uploads/uploads.service';
import { Upload } from '../uploads/entities/upload.entity';
import { CloudinaryService } from '@/commons/services/cloudinary.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Post,
      User,
      Like,
      Comment,
      ChildComment,
      Upload,
    ]),
  ],
  controllers: [PostsController],
  providers: [PostsService, CommentsService, UploadsService, CloudinaryService],
})
export class PostsModule {}
