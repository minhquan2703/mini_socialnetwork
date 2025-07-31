import { Comment } from '@/modules/comments/entities/comment.entity';
import { Post } from '@/modules/posts/entities/post.entity';
import { User } from '@/modules/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Report {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  reason: string;

  @Column()
  type: string;

  @Column()
  content: string;

  @Column({ default: false })
  isTackled: boolean;

  @ManyToOne(() => User, (user) => user.authoredReports, {
    onDelete: 'CASCADE',
  })
  author: User;

  @ManyToOne(() => User, (user) => user.reports, {
    onDelete: 'CASCADE',
  })
  user: User;

  @ManyToOne(() => Comment, (comment) => comment.reports, {
    onDelete: 'CASCADE',
  })
  comment: Comment;

  @ManyToOne(() => Post, (post) => post.reports, { onDelete: 'CASCADE' })
  post: Post;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
