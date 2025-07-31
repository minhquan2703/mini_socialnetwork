import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { Report } from '@/modules/reports/entities/report.entity';
import { User } from '@/modules/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import dayjs from 'dayjs';
import { Post } from '@/modules/posts/entities/post.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Report)
    private reportRepository: Repository<Report>,
  ) {}
  async create(createReportDto: CreateReportDto, userId: string) {
    const { id, reason, content } = createReportDto;
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException('User was not found');
    }

    const post = await this.postRepository.findOne({ where: { id: id } });
    if (!post) {
      throw new BadRequestException('Post was not found');
    }
    const existReport = await this.reportRepository.findOne({
      where: { post: { id: id }, author: { id: userId } },
    });
    if (existReport) {
      const createdAt = dayjs(existReport.createdAt).format(
        'DD/MM/YYYY [lúc] hh [giờ] mm [phút]',
      );
      throw new BadRequestException(
        `Bạn đã báo cáo bài đăng này vào ${createdAt}`,
      );
    }
    const report = new Report();
    report.type = 'POST';
    report.reason = reason;
    report.content = content;
    report.post = post;
    report.author = user;
    await this.reportRepository.save(report);
    return {
      id: report.id,
      type: report.type,
    };
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
}
