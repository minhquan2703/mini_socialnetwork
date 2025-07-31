import { PartialType } from '@nestjs/mapped-types';
import { CreateCommentDto } from './create-comment.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateCommentDto extends PartialType(CreateCommentDto) {
  @IsNotEmpty({ message: 'id không được bỏ trống' })
  id: string;

  @IsNotEmpty({ message: 'content không được bỏ trống' })
  content: string;
}
