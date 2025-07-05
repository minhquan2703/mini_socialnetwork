import { IsNotEmpty } from 'class-validator';

export class CreateChildCommentDto {
  @IsNotEmpty({ message: 'content is not allowed to empty' })
  content: string;
  @IsNotEmpty({ message: 'commentId is not allowed to empty' })
  commentId: string;
}
