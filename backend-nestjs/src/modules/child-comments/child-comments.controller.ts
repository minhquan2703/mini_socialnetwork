import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ChildCommentsService } from './child-comments.service';
import { CreateChildCommentDto } from './dto/create-child-comment.dto';
import { JwtAuthGuard } from '@/auths/passport/jwt-auth.guard';

interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    username: string;
  };
}
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
