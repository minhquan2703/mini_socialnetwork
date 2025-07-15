import { IsEnum, IsOptional } from 'class-validator';
import { LikeType } from '../entities/like.entity';

export class CreateLikeDto {
  @IsEnum(LikeType)
  type: LikeType;

  @IsOptional()
  postId: string;

  @IsOptional()
  commentId: string;

  @IsOptional()
  childCommentId: string;
}
