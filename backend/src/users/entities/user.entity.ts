import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'Dexter' })
  name: string;

  @Column({ unique: true, default: 'dexter@gmail.com' })
  email: string;

  @Column({ default: 'Designer' })
  title: string;

  @Column({ default: 'Dexuser' })
  username: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
