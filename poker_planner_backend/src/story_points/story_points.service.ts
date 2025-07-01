import { Injectable } from '@nestjs/common';
import { CreateStoryPointDto } from './dto/create-story_point.dto';
import { UpdateStoryPointDto } from './dto/update-story_point.dto';

@Injectable()
export class StoryPointsService {
  create(createStoryPointDto: CreateStoryPointDto) {
    return 'This action adds a new storyPoint';
  }

  findAll() {
    return `This action returns all storyPoints`;
  }

  findOne(id: number) {
    return `This action returns a #${id} storyPoint`;
  }

  update(id: number, updateStoryPointDto: UpdateStoryPointDto) {
    return `This action updates a #${id} storyPoint`;
  }

  remove(id: number) {
    return `This action removes a #${id} storyPoint`;
  }
}
