import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Country {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  name: string;

  @Column()
  suffix: string;

  @Column()
  countryCode: number;

  @Column({ default: true })
  status: boolean;

  @Column({ nullable: true })
  image: string;
}