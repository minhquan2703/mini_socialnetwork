import { ChildComment } from '@/modules/child-comments/entities/child-comment.entity';
import { Like } from '@/modules/likes/entities/like.entity';
import { Post } from '@/modules/posts/entities/post.entity';
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
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Post, (post) => post.comments, { onDelete: 'CASCADE' })
  post: Post;

  @ManyToOne(() => User, (user) => user.comments, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => Like, (like) => like.comment, { onDelete: 'CASCADE' })
  likes: Like[];

  @OneToMany(() => ChildComment, (childComment) => childComment.comment, {
    onDelete: 'CASCADE',
  })
  childComments: ChildComment[];

  @OneToMany(() => Upload, (upload) => upload.comment, { onDelete: 'CASCADE' })
  upload: Upload[];

  @Column({ type: 'text' })
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
