import { IsEnum, IsOptional, IsUUID } from 'class-validator';

export enum LikeType {
  POST = 'post',
  COMMENT = 'comment',
  PHOTO = 'photo',
}
export class CreateLikeDto {
  @IsEnum(LikeType)
  type: LikeType;

  @IsOptional()
  @IsUUID()
  postId?: string;

  @IsOptional()
  @IsUUID()
  commentId?: string;

  @IsOptional()
  @IsUUID()
  photoId?: string;
}
