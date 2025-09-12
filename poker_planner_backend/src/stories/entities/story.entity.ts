import { Room } from 'src/rooms/entities/room.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export type StoryPointEvaluationStatus =
  | 'pending'
  | 'in progress'
  | 'completed';

export const STORY_POINT_EVALUATION_STATUSES = {
  PENDING: 'pending' as const,
  IN_PROGRESS: 'in progress' as const,
  COMPLETED: 'completed' as const,
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
    type: 'json',
    nullable: true,
    default: '[]',
    comment: 'Array of user votes: [{user_id: number, username: string, vote: number, voted_at: timestamp}]'
  })
  votes: Array<{
    user_id: number;
    username: string;
    vote: number;
    voted_at: Date;
  }>;

  @Column({
    type: 'enum',
    enum: STORY_POINT_EVALUATION_STATUSES,
    nullable: false,
    default: STORY_POINT_EVALUATION_STATUSES.PENDING,
  })
  story_point_evaluation_status: StoryPointEvaluationStatus;

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
}
