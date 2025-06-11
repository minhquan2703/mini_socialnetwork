import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';

export class CreateCommentDto {
  @IsNotEmpty({ message: 'Nội dung bình luận không được để trống' })
  content: string;

  @IsOptional()
  @IsUUID()
  postId: string;

  @IsOptional()
  @IsUUID()
  photoId: string;
}
