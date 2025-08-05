import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateReportDto } from '@/modules/reports/dto/create-report.dto';
import { UpdateReportDto } from '@/modules/reports/dto/update-report.dto';
import { Report } from '@/modules/reports/entities/report.entity';
import { User } from '@/modules/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import dayjs from 'dayjs';
import { Post } from '@/modules/posts/entities/post.entity';
import { Comment } from '@/modules/comments/entities/comment.entity';
import { ChildComment } from '@/modules/child-comments/entities/child-comment.entity';
import { UsersService } from '@/modules/users/users.service';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
    @InjectRepository(ChildComment)
    private childCommentRepository: Repository<ChildComment>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Report)
    private reportRepository: Repository<Report>,
    private readonly userService: UsersService,
  ) {}
  async create(createReportDto: CreateReportDto, userId: string) {
    const user = await this.userService.findUserById(userId);
    switch (createReportDto.type) {
      case 'POST':
        return this.reportPost(createReportDto, user);
      case 'COMMENT':
        return this.reportComment(createReportDto, user);
      case 'CHILDCOMMENT':
        return this.reportChildComment(createReportDto, user);
      default:
        throw new BadRequestException('INVALID_REPORT_TYPE');
    }
  }

  findAll() {
    return `This action returns all reports`;
  }

  findOne(id: number) {
    return `This action returns a #${id} report`;
  }

  update(id: number, updateReportDto: UpdateReportDto) {
    return `This action updates a #${id} report`;
  }

  remove(id: number) {
    return `This action removes a #${id} report`;
  }

  async reportPost(data: CreateReportDto, user: User) {
    const { content, id, reason, type } = data;
    const post = await this.postRepository.findOne({ where: { id } });
    if (!post) {
      throw new BadRequestException('Post was not found');
    }
    await this.checkDuplicateReport(type, 'post', id, user.id);
    const report = new Report();
    report.type = type;
    report.reason = reason;
    report.content = content;
    report.post = post;
    report.author = user;
    await this.reportRepository.save(report);
    return report.id;
  }

  async reportComment(data: CreateReportDto, user: User) {
    const { content, id, reason, type } = data;
    const comment = await this.commentRepository.findOne({ where: { id } });
    if (!comment) {
      throw new BadRequestException('Comment was not found');
    }
    await this.checkDuplicateReport(type, 'comment', id, user.id);
    const report = new Report();
    report.type = type;
    report.reason = reason;
    report.content = content;
    report.comment = comment;
    report.author = user;
    await this.reportRepository.save(report);
    return report.id;
  }
  async reportChildComment(data: CreateReportDto, user: User) {
    const { content, id, reason, type } = data;
    const childComment = await this.childCommentRepository.findOne({
      where: { id },
    });
    if (!childComment) {
      throw new BadRequestException('Child comment was not found');
    }
    await this.checkDuplicateReport(type, 'childComment', id, user.id);
    const report = new Report();
    report.type = type;
    report.reason = reason;
    report.content = content;
    report.childComment = childComment;
    report.author = user;
    await this.reportRepository.save(report);
    return report.id;
  }

  private async checkDuplicateReport(
    type: string,
    targetField: keyof Report,
    targetId: string,
    userId: string,
  ) {
    const existReport = await this.reportRepository.findOne({
      where: {
        [targetField]: { id: targetId },
        author: { id: userId },
      },
    });
    if (existReport) {
      const createdAt = dayjs(existReport.createdAt).format(
        'HH[:]mm [-] DD/MM/YYYY',
      );
      throw new BadRequestException(`DUPLICATE_REPORT#${createdAt}`);
    }
  }
}
