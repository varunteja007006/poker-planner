import {
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

import { CreateRoomDto } from './dto/create-room.dto';
import { Room } from './entities/room.entity';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { extractToken } from 'src/utils/utils';
import { TeamsService } from 'src/teams/teams.service';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private readonly roomsRepository: Repository<Room>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    private readonly teamsService: TeamsService,
  ) {}

  async create(
    createRoomDto: CreateRoomDto,
    token: string | undefined,
  ): Promise<Room> {
    try {
      if (!token) {
        throw new Error('Token not found');
      }

      const user_token = extractToken(token);

      const user = await this.usersRepository.findOne({
        where: { user_token },
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Create a room
      const room = this.roomsRepository.create({
        ...createRoomDto,
        created_by: user,
        updated_by: user,
      });

      const savedRoom = await this.roomsRepository.save(room);

      // Create a team and mark this user as the room owner for creating the room
      await this.teamsService.create(
        {
          room_code: savedRoom.room_code,
          is_room_owner: true,
        },
        token,
      );

      return savedRoom;
    } catch (error) {
      console.error(error);
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: error.message,
        },
        HttpStatus.NOT_FOUND,
        {
          cause: error.message,
        },
      );
    }
  }

  async findAll(room_code?: string): Promise<Room[]> {
    const rooms = await this.roomsRepository.find({
      relations: {
        created_by: true,
        updated_by: true,
      },
      where: { room_code },
    });

    return rooms;
  }
}