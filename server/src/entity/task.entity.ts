import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { TaskStatus } from '../constants';
import { User } from './user.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ default: TaskStatus.TODO })
  status: string;

  @Column('datetime', { default: null, nullable: true })
  dueAt: string;

  @Column({ type: 'uuid' })
  userId: string;

  @JoinColumn({ name: 'userId' })
  @ManyToOne(() => User, (user) => user)
  user: User;
}
