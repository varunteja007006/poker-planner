import { Room } from 'src/rooms/entities/room.entity';
import { StoryPoint } from 'src/story_points/entities/story_point.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export const STORY_POINT_EVALUATION_STATUSES = {
  PENDING: 'pending',
  IN_PROGRESS: 'in progress',
  COMPLETED: 'completed',
};

@Entity()
export class Story {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  title: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  description: string;

  @Column({
    type: 'int',
    nullable: true,
  })
  finalized_story_points: number;

  @Column({
    type: 'enum',
    enum: STORY_POINT_EVALUATION_STATUSES,
    nullable: false,
    default: STORY_POINT_EVALUATION_STATUSES.PENDING,
  })
  story_point_evaluation_status: string;

  @ManyToOne(() => Room, (room) => room.id)
  @JoinColumn({ name: 'room_id' })
  room: Room;

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

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'deleted_by' })
  deleted_by: User;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'created_by' })
  created_by: User;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'updated_by' })
  updated_by: User;

  @OneToMany(() => StoryPoint, (story_point) => story_point.story)
  story_points: StoryPoint[];
}
