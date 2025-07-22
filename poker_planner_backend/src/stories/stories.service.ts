import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateStoryDto } from './dto/create-story.dto';
import { UpdateStoryDto } from './dto/update-story.dto';
import { extractToken } from 'src/utils/utils';
import { Room } from 'src/rooms/entities/room.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Story, StoryPointEvaluationStatus } from './entities/story.entity';

@Injectable()
export class StoriesService {
  constructor(
    @InjectRepository(Story)
    private readonly storiesRepository: Repository<Story>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Room)
    private readonly roomsRepository: Repository<Room>,
  ) {}

  async create(
    createStoryDto: CreateStoryDto,
    token: string | undefined,
  ): Promise<Story> {
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

      const room = await this.roomsRepository.findOne({
        where: { room_code: createStoryDto.room_code },
      });

      if (!room) {
        throw new Error('Room not found');
      }

      const story = this.storiesRepository.create({
        ...createStoryDto,
        room,
        created_by: user,
        updated_by: user,
      });

      const savedStory = await this.storiesRepository.save(story);

      return savedStory;
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
    token: string | undefined,
    room_code: string | undefined,
    story_point_evaluation_status: StoryPointEvaluationStatus | undefined,
  ): Promise<Story[]> {
    try {
      if (!token) {
        throw new Error('Token not found');
      }

      if (!room_code) {
        throw new Error('Room code not found');
      }

      const user_token = extractToken(token);

      const user = await this.usersRepository.findOne({
        where: { user_token },
      });

      if (!user) {
        throw new Error('User not found');
      }

      const room = await this.roomsRepository.findOne({
        where: { room_code },
      });

      if (!room) {
        throw new Error('Room not found');
      }

      const stories = await this.storiesRepository.find({
        where: { room: { id: room.id }, story_point_evaluation_status },
      });

      return stories;
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

  async findOne(id: number, token: string | undefined): Promise<Story> {
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

      const story = await this.storiesRepository.findOne({
        where: { id },
      });

      if (!story) {
        throw new Error('Story not found');
      }

      return story;
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

  async update(
    id: number,
    updateStoryDto: UpdateStoryDto,
    token: string | undefined,
  ): Promise<boolean> {
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

      const story = await this.storiesRepository.findOne({
        where: { id },
      });

      if (!story) {
        throw new Error('Story not found');
      }

      const updatedStory = await this.storiesRepository.update(id, {
        ...updateStoryDto,
        updated_by: user,
      });

      return !!updatedStory.affected;
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

  async remove(id: number, token: string | undefined): Promise<boolean> {
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

      const story = await this.storiesRepository.findOne({
        where: { id },
      });

      if (!story) {
        throw new Error('Story not found');
      }

      const deletedStory = await this.storiesRepository.delete(id);

      return !!deletedStory.affected;
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
}
