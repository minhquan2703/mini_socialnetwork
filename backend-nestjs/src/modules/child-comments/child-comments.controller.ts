import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ChildCommentsService } from './child-comments.service';
import { CreateChildCommentDto } from './dto/create-child-comment.dto';
import { JwtAuthGuard } from '@/auths/passport/jwt-auth.guard';
import { AuthenticatedRequest } from '@/auths/auths.controller';

@Controller('child-comments')
export class ChildCommentsController {
  constructor(private readonly childCommentsService: ChildCommentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async childCommentOnComment(
    @Body() createChildCommentDto: CreateChildCommentDto,
    @Request() req: AuthenticatedRequest,
  ) {
    const userId = req.user?.id;
    return await this.childCommentsService.handleCreateChildComment(
      createChildCommentDto,
      userId,
    );
  }
}
