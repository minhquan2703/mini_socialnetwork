import { Room } from '@/modules/rooms/entities/room.entity';
import { User } from '@/modules/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'senderId' })
  sender: User;

  @ManyToOne(() => Room, { onDelete: 'CASCADE' })
  room: Room;

  @Column()
  content: string;

  @CreateDateColumn()
  createdAt: Date;
  message: Room[];
}
