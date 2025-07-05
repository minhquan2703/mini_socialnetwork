import { Comment } from '@/modules/comments/entities/comment.entity';
import { Like } from '@/modules/likes/entities/like.entity';
import { Post } from '@/modules/posts/entities/post.entity';
import { Room } from '@/modules/rooms/entities/room.entity';
import { User } from '@/modules/users/entities/user.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Photo extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // @Column()
  // caption: string;

  @Column({ nullable: true })
  key?: string;

  @Column()
  url: string;

  @ManyToOne(() => User, (user) => user.photos, { onDelete: 'CASCADE' })
  user: User;

  @OneToMany(() => Like, (like) => like.photo, { onDelete: 'CASCADE' })
  likes: Like[];

  @OneToMany(() => Comment, (comment) => comment.photo, { onDelete: 'CASCADE' })
  comment: Comment[];

  @ManyToOne(() => Post, (post) => post.photos, { onDelete: 'CASCADE' })
  post: Post;

  @ManyToOne(() => Room, (room) => room.photos, { onDelete: 'CASCADE' })
  room: Room;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
