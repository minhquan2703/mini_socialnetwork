import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from './entities/report.entity';
import { User } from '../users/entities/user.entity';
import { Post } from '../posts/entities/post.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Report, User, Post])],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
