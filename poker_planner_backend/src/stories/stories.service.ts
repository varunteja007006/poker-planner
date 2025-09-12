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

  async submitVote(
    storyId: number, 
    voteValue: number, 
    token: string | undefined
  ): Promise<{ success: boolean; votes: any[]; averageVote?: number }> {
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
        where: { id: storyId },
      });

      if (!story) {
        throw new Error('Story not found');
      }

      // Initialize votes array if null
      const currentVotes = story.votes || [];
      
      // Remove any existing vote from this user
      const filteredVotes = currentVotes.filter(vote => vote.user_id !== user.id);
      
      // Add new vote
      const newVote = {
        user_id: user.id,
        username: user.username,
        vote: voteValue,
        voted_at: new Date(),
      };
      
      const updatedVotes = [...filteredVotes, newVote];

      // Update story with new votes
      await this.storiesRepository.update(storyId, {
        votes: updatedVotes,
      });

      // Calculate average
      const average = updatedVotes.length > 0 
        ? updatedVotes.reduce((sum, vote) => sum + vote.vote, 0) / updatedVotes.length 
        : 0;

      return {
        success: true,
        votes: updatedVotes,
        averageVote: average,
      };
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

  async getVotes(storyId: number): Promise<any[]> {
    try {
      const story = await this.storiesRepository.findOne({
        where: { id: storyId },
        select: ['votes'],
      });

      return story?.votes || [];
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
