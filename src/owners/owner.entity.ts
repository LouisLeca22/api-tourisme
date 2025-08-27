import { Exclude } from 'class-transformer';
import { Accommodation } from 'src/accommodations/accommodation.entity';
import { Activity } from 'src/activities/activity.entity';
import { RoleType } from 'src/auth/enums/role-types.enum';
import { Event } from 'src/events/event.entity';
import { Place } from 'src/places/place.entity';
import { Restaurant } from 'src/restaurants/restaurant.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Owner {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({
    length: 96,
    unique: true,
  })
  name: string;

  @Column()
  @Column({
    length: 96,
    unique: true,
  })
  email: string;

  @Column({
    length: 255,
    nullable: true,
  })
  @Exclude()
  password?: string;

  @Column({
    nullable: true,
  })
  @Exclude()
  googleId?: string;

  @Column({
    length: 20,
    nullable: true,
  })
  phoneNumber?: string;

  @Column({
    length: 2083,
    nullable: true,
  })
  websiteUrl?: string;

  @Column({
    type: 'enum',
    enum: RoleType,
    nullable: false,
    default: RoleType.User,
  })
  @Exclude()
  role: RoleType;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => Event, (event) => event.owner, { cascade: true })
  events: Event[];

  @OneToMany(() => Restaurant, (restaurant) => restaurant.owner, {
    cascade: true,
  })
  restaurants: Restaurant[];

  @OneToMany(() => Accommodation, (accommodation) => accommodation.owner, {
    cascade: true,
  })
  accommodations: Accommodation[];

  @OneToMany(() => Place, (place) => place.owner, { cascade: true })
  places: Place[];

  @OneToMany(() => Activity, (activity) => activity.owner, { cascade: true })
  activities: Activity[];
}
