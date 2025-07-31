import { Comment } from '@/modules/comments/entities/comment.entity';
import { Like } from '@/modules/likes/entities/like.entity';
import { Report } from '@/modules/reports/entities/report.entity';
import { Upload } from '@/modules/uploads/entities/upload.entity';
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
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'text' })
  content: string;

  @Column({ default: false })
  isReported: boolean;

  @Column({ default: false })
  isDeleted: boolean;

  @OneToMany(() => Comment, (comment) => comment.post, { onDelete: 'CASCADE' })
  comments: Comment[];

  @OneToMany(() => Like, (like) => like.post, { onDelete: 'CASCADE' })
  likes: Like[];

  @OneToMany(() => Upload, (upload) => upload.post, { onDelete: 'CASCADE' })
  uploads: Upload[];

  @OneToMany(() => Report, (report) => report.post, { onDelete: 'CASCADE' })
  reports: Report[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
