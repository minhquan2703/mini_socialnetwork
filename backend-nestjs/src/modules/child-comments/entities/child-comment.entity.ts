import { Comment } from '@/modules/comments/entities/comment.entity';
import { Like } from '@/modules/likes/entities/like.entity';
import { Report } from '@/modules/reports/entities/report.entity';
import { User } from '@/modules/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class ChildComment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.childComments, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => Like, (like) => like.childComment, { onDelete: 'CASCADE' })
  likes: Like[];

  @OneToMany(() => Report, (report) => report.childComment, {
    onDelete: 'CASCADE',
  })
  reports: Report[];

  @ManyToOne(() => Comment, (comment) => comment.childComments, {
    onDelete: 'CASCADE',
  })
  comment: Comment;

  @Column({ type: 'text' })
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
