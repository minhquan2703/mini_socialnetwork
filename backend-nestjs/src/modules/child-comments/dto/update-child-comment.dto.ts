import { PartialType } from '@nestjs/mapped-types';
import { CreateChildCommentDto } from './create-child-comment.dto';

export class UpdateChildCommentDto extends PartialType(CreateChildCommentDto) {}
