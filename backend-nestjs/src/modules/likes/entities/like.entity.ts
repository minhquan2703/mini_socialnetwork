import { Comment } from '@/modules/comments/entities/comment.entity';
import { Photo } from '@/modules/photos/entities/photo.entity';
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
import { ChildComment } from '@/modules/child-comments/entities/child-comment.entity';
export enum LikeType {
  POST = 'post',
  COMMENT = 'comment',
  PHOTO = 'photo',
  CHILDCOMMENT = 'child-comment',
}
@Entity()
export class Like {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  type: LikeType;

  @ManyToOne(() => Post, (post) => post.likes, { onDelete: 'CASCADE' })
  post: Post;

  @ManyToOne(() => Comment, (comment) => comment.likes, { onDelete: 'CASCADE' })
  comment: Comment;

  @ManyToOne(() => ChildComment, (childComment) => childComment.likes, {
    onDelete: 'CASCADE',
  })
  childComment: ChildComment;

  @ManyToOne(() => User, (user) => user.likes, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Photo, (photo) => photo.likes, { onDelete: 'CASCADE' })
  photo: Photo;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
