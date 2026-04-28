import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, IntegerType } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  status: boolean;

  @Column({ nullable: true })
  image: string;
}