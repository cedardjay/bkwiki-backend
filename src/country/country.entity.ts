import { Entity, Unique, PrimaryGeneratedColumn, Column, } from 'typeorm';

@Entity()
@Unique(['name', 'suffix'])  // Both together must be unique
export class Country {
  @PrimaryGeneratedColumn('increment') //can use uuid, then change id type to string
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