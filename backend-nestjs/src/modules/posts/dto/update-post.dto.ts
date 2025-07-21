import { PartialType } from '@nestjs/mapped-types';
import { CreatePostDto } from './create-post.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @IsNotEmpty({ message: 'id is not allowed to be empty' })
  id: string;

  @IsNotEmpty({ message: 'content is not allowed to be empty' })
  content: string;
}
