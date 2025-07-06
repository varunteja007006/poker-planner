import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
  Query,
} from '@nestjs/common';
import { StoriesService } from './stories.service';
import { CreateStoryDto } from './dto/create-story.dto';
import { UpdateStoryDto } from './dto/update-story.dto';

@Controller('stories')
export class StoriesController {
  constructor(private readonly storiesService: StoriesService) {}

  @Post()
  create(
    @Body() createStoryDto: CreateStoryDto,
    @Headers('Authorization') token: string | undefined,
  ) {
    return this.storiesService.create(createStoryDto, token);
  }

  @Get()
  findAll(
    @Headers('Authorization') token: string | undefined,
    @Query('room_code') room_code: string | undefined,
  ) {
    return this.storiesService.findAll(token, room_code);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Headers('Authorization') token: string | undefined,
  ) {
    return this.storiesService.findOne(+id, token);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateStoryDto: UpdateStoryDto,
    @Headers('Authorization') token: string | undefined,
  ) {
    return this.storiesService.update(+id, updateStoryDto, token);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Headers('Authorization') token: string | undefined,
  ) {
    return this.storiesService.remove(+id, token);
  }
}
