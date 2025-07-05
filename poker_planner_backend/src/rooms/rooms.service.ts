import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

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
    private roomsRepository: Repository<Room>,

    @InjectRepository(User)
    private usersRepository: Repository<User>,

    private teamsService: TeamsService,
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

      const room = this.roomsRepository.create({
        ...createRoomDto,
        created_by: user,
        updated_by: user,
      });

      const savedRoom = await this.roomsRepository.save(room);

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

  async findAll(): Promise<Room[]> {
    try {
      const rooms = await this.roomsRepository.find({
        relations: {
          created_by: true,
          updated_by: true,
        },
      });
      return rooms;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Something went wrong with finding the rooms',
        },
        HttpStatus.NOT_FOUND,
        {
          cause: 'Something went wrong with finding the rooms',
        },
      );
    }
  }

  async findOne(id: number): Promise<Room> {
    try {
      const room = await this.roomsRepository.findOne({
        relations: {
          created_by: true,
          updated_by: true,
        },
        where: { id },
      });

      if (!room) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'Room not found',
          },
          HttpStatus.NOT_FOUND,
          {
            cause: 'Room not found',
          },
        );
      }

      return room;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Something went wrong with finding the room',
        },
        HttpStatus.NOT_FOUND,
        {
          cause: 'Something went wrong with finding the room',
        },
      );
    }
  }

  async update(id: number, updateRoomDto: UpdateRoomDto): Promise<boolean> {
    try {
      const user = await this.usersRepository.findOne({
        where: { id: updateRoomDto['userId'] },
      });

      if (!user) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'User not found',
          },
          HttpStatus.NOT_FOUND,
          {
            cause: 'User not found',
          },
        );
      }

      const updatedRoom = await this.roomsRepository.update(id, {
        ...updateRoomDto,
        updated_by: user,
      });
      return !!updatedRoom.affected;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Something went wrong with updating the room',
        },
        HttpStatus.NOT_FOUND,
        {
          cause: 'Something went wrong with updating the room',
        },
      );
    }
  }

  async remove(id: number): Promise<boolean> {
    try {
      const deletedRoom = await this.roomsRepository.delete(id);
      return !!deletedRoom.affected;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Something went wrong with deleting the room',
        },
        HttpStatus.NOT_FOUND,
        {
          cause: 'Something went wrong with deleting the room',
        },
      );
    }
  }
}
