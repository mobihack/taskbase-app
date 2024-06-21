import {
  BeforeInsert,
  Column,
  Entity,
  JoinTable,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { bcryptService } from '../services';
import { Task } from './task.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column({ select: false })
  password: string;

  @JoinTable()
  @OneToMany(() => Task, (task) => task.user, {
    cascade: true,
  })
  tasks: Task[];

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = bcryptService().password({ password: this.password });
    }
  }
}
