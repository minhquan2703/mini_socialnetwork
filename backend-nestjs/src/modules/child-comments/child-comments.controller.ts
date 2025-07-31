import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Delete,
  Param,
  Put,
} from '@nestjs/common';
import { ChildCommentsService } from './child-comments.service';
import { CreateChildCommentDto } from './dto/create-child-comment.dto';
import { JwtAuthGuard } from '@/auths/passport/jwt-auth.guard';
import { AuthenticatedRequest } from '@/auths/auths.controller';
import { UpdateChildCommentDto } from './dto/update-child-comment.dto';

@Controller('child-comments')
export class ChildCommentsController {
  constructor(private readonly childCommentsService: ChildCommentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createChildCommentDto: CreateChildCommentDto,
    @Request() req: AuthenticatedRequest,
  ) {
    const userId = req.user?.id;
    return await this.childCommentsService.handleCreateChildComment(
      createChildCommentDto,
      userId,
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    const userId = req.user.id;
    return await this.childCommentsService.remove(id, userId);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async update(
    @Body() updateChildCommentDto: UpdateChildCommentDto,
    @Request() req: AuthenticatedRequest,
  ) {
    const userId = req.user.id;
    return await this.childCommentsService.update(
      updateChildCommentDto,
      userId,
    );
  }
}
