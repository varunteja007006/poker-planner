import { Injectable } from '@nestjs/common';
import { CreateStoryDto } from './dto/create-story.dto';
import { UpdateStoryDto } from './dto/update-story.dto';

@Injectable()
export class StoriesService {
  create(createStoryDto: CreateStoryDto, token: string | undefined) {
    return 'This action adds a new story';
  }

  findAll(token: string | undefined) {
    return `This action returns all stories`;
  }

  findOne(id: number, token: string | undefined) {
    return `This action returns a #${id} story`;
  }

  update(
    id: number,
    updateStoryDto: UpdateStoryDto,
    token: string | undefined,
  ) {
    return `This action updates a #${id} story`;
  }

  remove(id: number, token: string | undefined) {
    return `This action removes a #${id} story`;
  }
}
