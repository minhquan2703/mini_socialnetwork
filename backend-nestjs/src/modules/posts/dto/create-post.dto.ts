import { IsEnum, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';
import { MediaType } from '../entities/post.entity';

export class CreatePostDto {
  @IsNotEmpty({ message: 'Nội dung bài đăng không được để trống' })
  content: string;

  @IsOptional()
  @IsUrl()
  mediaURL: string;

  @IsEnum(MediaType, {
    message: 'mediaType phải là 1 trong các giá trị: text, image, video',
  })
  @IsOptional()
  mediaType?: MediaType;
}
