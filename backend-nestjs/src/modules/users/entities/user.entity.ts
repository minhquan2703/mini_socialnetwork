import { ChildComment } from '@/modules/child-comments/entities/child-comment.entity';
import { Comment } from '@/modules/comments/entities/comment.entity';
import { Like } from '@/modules/likes/entities/like.entity';
import { Post } from '@/modules/posts/entities/post.entity';
import { Room } from '@/modules/rooms/entities/room.entity';
import { Upload } from '@/modules/uploads/entities/upload.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
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

  @OneToMany(() => Upload, (upload) => upload.user, { onDelete: 'CASCADE' })
  uploads: Upload[];

  @OneToMany(() => Comment, (comment) => comment.user, { onDelete: 'CASCADE' })
  comments: Comment[];

  @OneToMany(() => ChildComment, (childComment) => childComment.user, {
    onDelete: 'CASCADE',
  })
  childComments: ChildComment[];

  @OneToMany(() => Like, (like) => like.user, { onDelete: 'CASCADE' })
  likes: Like[];

  @ManyToMany(() => Room, (room) => room.users)
  rooms: Room[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
