import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  username: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    unique: true,
    default: 'USER__' + uuidv4(),
  })
  user_token: string;

  @Column({
    nullable: false,
    default: true,
  })
  is_active: boolean;

  @Column({
    nullable: true,
    default: new Date(),
  })
  created_at: Date;

  @Column({
    nullable: true,
    default: new Date(),
  })
  updated_at: Date;

  @Column({
    nullable: true,
    default: null,
  })
  deleted_at: Date;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  deleted_by: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  created_by: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  updated_by: string;
}
