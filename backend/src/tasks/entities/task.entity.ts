// backend/src/tasks/entities/task.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ default: 'To Do' })
  status: string; // 'To Do', 'Doing', 'Completed', 'On Hold'

  @Column({ default: 'No Priority' })
  priority: string; // 'Urgent', 'High', 'Medium', 'Low', 'No Priority'

  @Column({ nullable: true })
  dueDate: string; // Storing as string for easy parsing (e.g., '12 Sep 2026')

  @Column('simple-array', { nullable: true })
  tags: string[]; // e.g., ['Design', 'Development']

  @Column('simple-array', { nullable: true })
  members: string[]; // Usernames or avatar references

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}