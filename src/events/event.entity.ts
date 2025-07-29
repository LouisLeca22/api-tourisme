import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { EventType } from './enmus/event-type-enum';
import { Language } from 'src/common/constants/languages.constants';
import { Owner } from 'src/owners/owner.entity';

@Entity()
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 96 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: EventType })
  type: EventType;

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

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp' })
  endDate: Date;

  @Column()
  priceRange: string;

  @Column({ type: 'text', array: true })
  languages: Language[];

  @Column('int')
  requiredAge: number;

  @Column({ length: 1024, nullable: true })
  imageUrl?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Owner, (owner) => owner.events, { eager: true })
  owner: Owner;
}
