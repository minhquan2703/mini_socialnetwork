import { Comment } from '@/modules/comments/entities/comment.entity';
import { Like } from '@/modules/likes/entities/like.entity';
import { Photo } from '@/modules/photos/entities/photo.entity';
import { Post } from '@/modules/posts/entities/post.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ length: 150, unique: true, nullable: true })
  username: string;

  @Column()
  password: string;

  @Column({ length: 200, nullable: true })
  name: string;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column({ default: 'USER' })
  role: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  image: string;

  @Column({ type: 'text', nullable: true })
  avatarColor: string | null;

  @Column({ default: false })
  isActive: boolean;

  @Column({ nullable: true })
  codeId!: string;

  @Column({ nullable: true })
  codeExpired!: Date;

  @OneToMany(() => Post, (post) => post.user, { onDelete: 'CASCADE' })
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.user, { onDelete: 'CASCADE' })
  comments: Comment[];

  @OneToMany(() => Like, (like) => like.user, { onDelete: 'CASCADE' })
  likes: Like[];

  @OneToMany(() => Photo, (photo) => photo.user, { onDelete: 'CASCADE' })
  photos: Photo[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
