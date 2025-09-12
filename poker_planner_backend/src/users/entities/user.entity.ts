import { Client } from 'src/clients/entities/client.entity';
import { Team } from 'src/teams/entities/team.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
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
    nullable: true,
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

  @OneToMany(() => Client, (client) => client.user) // 'client.user' refers to the 'user' property in the Client entity
  clients: Client[]; // A user can have many clients

  @OneToMany(() => Team, (team) => team.user)
  teams: Team[];
}
