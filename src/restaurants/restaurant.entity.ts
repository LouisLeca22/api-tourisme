import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RestaurantType } from './enums/restaurant-type.enum';
import { Cuisine } from 'src/common/constants/cuisines.constants';
import { Owner } from 'src/owners/owner.entity';

@Entity()
export class Restaurant {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 96, unique: true })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: RestaurantType })
  type: RestaurantType;

  @Column('int')
  stars: number;

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

  @Column({ type: 'text', array: true })
  cuisines: Cuisine[];

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

  @Column({ length: 5, nullable: true })
  openTwo?: string;

  @Column({ length: 5, nullable: true })
  closeTwo?: string;

  @Column({ length: 1024, nullable: true })
  imageUrl?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Owner, (owner) => owner.restaurants, { eager: true })
  owner: Owner;
}
