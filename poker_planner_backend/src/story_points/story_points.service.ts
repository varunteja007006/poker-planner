import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateStoryPointDto } from './dto/create-story_point.dto';
import { UpdateStoryPointDto } from './dto/update-story_point.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { StoryPoint } from './entities/story_point.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { extractToken } from 'src/utils/utils';
import { Story } from 'src/stories/entities/story.entity';

@Injectable()
export class StoryPointsService {
  constructor(
    @InjectRepository(StoryPoint)
    private storyPointsRepository: Repository<StoryPoint>,

    @InjectRepository(User)
    private usersRepository: Repository<User>,

    @InjectRepository(Story)
    private storiesRepository: Repository<Story>,
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
    createStoryPointDto: CreateStoryPointDto,
    token: string | undefined,
  ) {
    const user = await this.checkToken(token);

    const story = await this.storiesRepository.findOne({
      where: { id: createStoryPointDto.story_id },
    });

    if (!story) {
      throw new NotFoundException('Story not found');
    }

    const storyPoint = this.storyPointsRepository.create({
      ...createStoryPointDto,
      user,
      story,
      created_by: user,
      updated_by: user,
    });

    return await this.storyPointsRepository.save(storyPoint);
  }

  async findAll(token: string | undefined, storyId?: string) {
    const user = await this.checkToken(token);

    const storyPoints = await this.storyPointsRepository.find({
      where: { story: { id: storyId ? Number(storyId) : undefined } },
      relations: {
        story: true,
        user: true,
      },
    });

    return storyPoints;
  }

  async findOne(id: number, token: string | undefined) {
    await this.checkToken(token);

    const storyPoint = await this.storyPointsRepository.findOne({
      where: { id },
      relations: {
        story: true,
        user: true,
      },
    });

    if (!storyPoint) {
      throw new NotFoundException('Story point not found');
    }

    return storyPoint;
  }

  async update(
    id: number,
    updateStoryPointDto: UpdateStoryPointDto,
    token: string | undefined,
  ) {
    const user = await this.checkToken(token);

    const storyPoint = await this.storyPointsRepository.findOne({
      where: { id },
    });

    if (!storyPoint) {
      throw new NotFoundException('Story point not found');
    }

    const updatedStoryPoint = await this.storyPointsRepository.update(id, {
      ...updateStoryPointDto,
      updated_by: user,
      updated_at: new Date(),
    });

    return !!updatedStoryPoint.affected;
  }

  async remove(id: number, token: string | undefined) {
    await this.checkToken(token);

    const storyPoint = await this.storyPointsRepository.findOne({
      where: { id },
    });

    if (!storyPoint) {
      throw new NotFoundException('Story point not found');
    }

    const deletedStoryPoint = await this.storyPointsRepository.delete(id);

    return !!deletedStoryPoint.affected;
  }
}
