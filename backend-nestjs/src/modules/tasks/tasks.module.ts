import { Module } from '@nestjs/common';
import { TasksService } from './tasks.services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [TasksService],
})
export class TasksModule {}
