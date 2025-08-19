import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FileType } from './enums/file-type.enum';

@Entity()
export class Upload {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({
    length: 1024,
  })
  name: string;

  @Column({
    length: 1024,
  })
  path: string;

  @Column({
    type: 'enum',
    enum: FileType,
    default: FileType.IMAGE,
  })
  type: string;

  @Column({
    length: 128,
  })
  mime: string;

  @Column()
  size: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
