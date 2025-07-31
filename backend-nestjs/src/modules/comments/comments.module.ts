import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Post } from '../posts/entities/post.entity';
import { User } from '../users/entities/user.entity';
import { ChildComment } from '../child-comments/entities/child-comment.entity';
import { Upload } from '../uploads/entities/upload.entity';
import { Report } from '../reports/entities/report.entity';
import { UploadsService } from '../uploads/uploads.service';
import { CloudinaryService } from '@/commons/services/cloudinary.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Comment,
      Upload,
      Post,
      User,
      ChildComment,
      Report,
    ]),
  ],
  controllers: [CommentsController],
  providers: [CommentsService, UploadsService, CloudinaryService],
})
export class CommentsModule {}
