import { Comment } from '@/modules/comments/entities/comment.entity';
import { Like } from '@/modules/likes/entities/like.entity';
import { Photo } from '@/modules/photos/entities/photo.entity';
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

export enum MediaType {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
}

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
  user: User;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'enum', enum: MediaType, default: MediaType.TEXT })
  mediaType: MediaType;


  @Column({ nullable: true })
  mediaURL: string;

  @OneToMany(() => Comment, (comment) => comment.post, { onDelete: 'CASCADE' })
  comments: Comment[];

  @OneToMany(() => Like, (like) => like.post, { onDelete: 'CASCADE' })
  likes: Like[];

  @OneToMany(() => Photo, (photo) => photo.user, { onDelete: 'CASCADE' })
  photos: Photo[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
