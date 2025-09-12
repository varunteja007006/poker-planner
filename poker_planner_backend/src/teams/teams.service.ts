import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateTeamDto } from './dto/create-team.dto';
import { extractToken } from 'src/utils/utils';
import { InjectRepository } from '@nestjs/typeorm';
import { Team } from './entities/team.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { Room } from 'src/rooms/entities/room.entity';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(Team)
    private teamsRepository: Repository<Team>,

    @InjectRepository(User)
    private usersRepository: Repository<User>,

    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
  ) {}

  async checkToken(token: string | undefined): Promise<User> {
    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    const user_token = extractToken(token);

    const user = await this.usersRepository.findOne({
      where: { user_token },
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

    return user;
  }

  async create(
    createTeamDto: CreateTeamDto,
    token: string | undefined,
  ): Promise<Team> {
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

      const room = await this.roomRepository.findOne({
        where: { room_code: createTeamDto.room_code },
      });

      if (!room) {
        throw new Error('Room not found');
      }

      const teamExists = await this.teamsRepository.findOne({
        where: { user, room },
        relations: {
          room: true,
          user: true,
        },
      });

      if (teamExists) {
        return teamExists;
      }

      const team = this.teamsRepository.create({
        user,
        room,
        created_by: user,
        updated_by: user,
        is_room_owner: createTeamDto.is_room_owner,
        is_online: true,
        last_active: new Date(),
      });

      const savedTeam = await this.teamsRepository.save(team);

      return savedTeam;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: error.message,
        },
      );
    }
  }

  async findAll(
    room_code: string | undefined,
    token: string | undefined,
    filterByUser?: boolean,
  ): Promise<Team[]> {
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

      const teams = await this.teamsRepository.find({
        relations: {
          room: true,
          user: true,
        },
        where: {
          room: { room_code },
          user: filterByUser ? { id: user.id } : undefined,
        },
        order: { room: { id: 'DESC' } },
      });

      return teams;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: error.message,
        },
      );
    }
  }

  async findOne(id: number, token: string | undefined): Promise<Team> {
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

      const team = await this.teamsRepository.findOne({
        where: { id, user },
      });

      if (!team) {
        throw new Error('Team not found');
      }

      return team;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: error.message,
        },
      );
    }
  }

  async updateHeartbeat(
    token: string | undefined,
    room_code: string,
    is_online: boolean,
  ): Promise<Team> {
    const user = await this.checkToken(token);

    const room = await this.roomRepository.findOne({
      where: { room_code },
    });

    if (!room) {
      throw new NotFoundException('Room not found');
    }

    const team = await this.teamsRepository.findOne({
      where: { room, user },
    });

    if (!team) {
      throw new NotFoundException('Team not found');
    }

    let updatedTeam = team;

    // Update the current user's team record if status changes
    if (is_online !== team.is_online) {
      team.is_online = is_online;
      team.last_active = new Date();
      updatedTeam = await this.teamsRepository.save(team);
    } else if (is_online) {
      // If user is online and status hasn't changed, just update last_active
      team.last_active = new Date();
      updatedTeam = await this.teamsRepository.save(team);
    }

    return updatedTeam;
  }
}
