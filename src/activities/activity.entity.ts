import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ActivityType } from './enums/activity-type.enum';
import { Language } from 'src/common/constants/languages.constants';
import { Owner } from 'src/owners/owner.entity';

@Entity()
export class Activity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 96, unique: true })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: ActivityType })
  type: ActivityType;

  @Column('int')
  duration: number;

  @Column('int')
  requiredAge: number;

  @Column({ type: 'text', array: true })
  languages: Language[];

  @Column()
  address: string;

  @Column({ length: 100 })
  city: string;

  @Column({ length: 10 })
  postCode: string;

  @Column('double precision')
  latitude: number;

  @Column('double precision')
  longitude: number;

  @Column()
  priceRange: string;

  @Column('int')
  from: number;

  @Column('int')
  to: number;

  @Column()
  open: string;

  @Column()
  close: string;

  @Column({ length: 1024, nullable: true })
  imageUrl?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Owner, (owner) => owner.activities, {
    eager: true,
  })
  owner: Owner;
}
