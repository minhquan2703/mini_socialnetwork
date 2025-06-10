import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  //chạy mỗi 1 phút
  @Cron('* * * * *')
  async handleDeleteExpiredUsers() {
    const now = new Date();

    const expiredUsers = await this.userRepository.find({
      where: {
        isActive: false,
        codeExpired: LessThan(now),
      },
    });

    if (expiredUsers.length > 0) {
      for (const user of expiredUsers) {
        await this.userRepository.delete(user.id);
        this.logger.warn(`Đã xoá user chưa xác thực: ${user.email}`);
      }
    }
  }
}
