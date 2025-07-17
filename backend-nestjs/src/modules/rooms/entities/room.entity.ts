import { Chat } from '@/modules/chat/entities/chat.entity';
import { Upload } from '@/modules/uploads/entities/upload.entity';
import { User } from '@/modules/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToMany,
  OneToMany,
  JoinTable,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

export enum RoomType {
  PRIVATE = 'PRIVATE',
  GROUP = 'GROUP',
}

@Entity()
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  theme: string;

  @Column({ nullable: true })
  adminId: string;

  @Column({ nullable: true })
  avatar: string;

  @ManyToOne(() => User, { nullable: true })
  admin: User;

  @Column({ type: 'enum', enum: RoomType })
  type: RoomType;

  @Column({ default: false })
  isBlocked: boolean;

  @OneToMany(() => Upload, (upload) => upload.room, { onDelete: 'CASCADE' })
  uploads: Upload[];

  @OneToMany(() => Chat, (chat) => chat.room, { onDelete: 'CASCADE' })
  messages: Chat[];

  @ManyToMany(() => User, (user) => user.rooms, { onDelete: 'CASCADE' })
  @JoinTable()
  users: User[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
