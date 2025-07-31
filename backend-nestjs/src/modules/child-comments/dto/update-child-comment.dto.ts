import { PartialType } from '@nestjs/mapped-types';
import { CreateChildCommentDto } from './create-child-comment.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateChildCommentDto extends PartialType(CreateChildCommentDto) {
  @IsNotEmpty({ message: 'id không được bỏ trống' })
  id: string;

  @IsNotEmpty({ message: 'content không được bỏ trống' })
  content: string;
}
