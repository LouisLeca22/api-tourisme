import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { AccommodationType } from './enums/accommodation-type.enum';
import { Amenity } from 'src/common/constants/amenities.constants';
import { Owner } from 'src/owners/owner.entity';

@Entity()
export class Accommodation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 96 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: AccommodationType })
  type: AccommodationType;

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
  amenities: Amenity[];

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

  @ManyToOne(() => Owner, (owner) => owner.accommodations, {
    eager: true,
  })
  owner: Owner;
}
