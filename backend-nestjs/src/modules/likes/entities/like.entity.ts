import { Comment } from '@/modules/comments/entities/comment.entity';
import { Photo } from '@/modules/photos/entities/photo.entity';
import { Post } from '@/modules/posts/entities/post.entity';
import { User } from '@/modules/users/entities/user.entity';
import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Like {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @ManyToOne(() => Post, (post) => post.likes, { onDelete: 'CASCADE' })
  post: Post;

  @ManyToOne(() => Comment, (comment) => comment.likes, { onDelete: 'CASCADE' })
  comment: Comment;

  @ManyToOne(() => User, (user) => user.likes)
  user: User;

  @ManyToOne(() => Photo, (photo) => photo.likes, { onDelete: 'CASCADE' })
  photo: Photo;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
