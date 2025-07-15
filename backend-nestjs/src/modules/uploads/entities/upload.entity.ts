import { Comment } from '@/modules/comments/entities/comment.entity';
import { Post } from '@/modules/posts/entities/post.entity';
import { Room } from '@/modules/rooms/entities/room.entity';
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
export class Upload {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  url: string;

  @Column({ nullable: true })
  publicId: string;

  @Column({ nullable: true })
  type: string;

  @ManyToOne(() => User, (user) => user.uploads, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Comment, (comment) => comment.upload)
  comment: Comment;

  @ManyToOne(() => Post, (post) => post.uploads, { onDelete: 'CASCADE' })
  post: Post;

  @ManyToOne(() => Room, (room) => room.uploads, { onDelete: 'CASCADE' })
  room: Room;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
