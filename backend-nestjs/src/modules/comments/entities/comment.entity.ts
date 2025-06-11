import { Like } from '@/modules/likes/entities/like.entity';
import { Photo } from '@/modules/photos/entities/photo.entity';
import { Post } from '@/modules/posts/entities/post.entity';
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

  @ManyToOne(() => Photo, (photo) => photo.comment, { onDelete: 'CASCADE' })
  photo: Photo;

  @Column({ type: 'text' })
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
