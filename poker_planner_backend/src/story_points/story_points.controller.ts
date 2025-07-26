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
import { StoryPointsService } from './story_points.service';
import { CreateStoryPointDto } from './dto/create-story_point.dto';
import { UpdateStoryPointDto } from './dto/update-story_point.dto';

@Controller('story-points')
export class StoryPointsController {
  constructor(private readonly storyPointsService: StoryPointsService) {}

  @Post()
  create(
    @Body() createStoryPointDto: CreateStoryPointDto,
    @Headers('Authorization') token: string | undefined,
  ) {
    return this.storyPointsService.create(createStoryPointDto, token);
  }

  @Get()
  findAll(
    @Headers('Authorization') token: string | undefined,
    @Query('storyId') storyId?: string,
  ) {
    return this.storyPointsService.findAll(token, storyId);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Headers('Authorization') token: string | undefined,
  ) {
    return this.storyPointsService.findOne(+id, token);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateStoryPointDto: UpdateStoryPointDto,
    @Headers('Authorization') token: string | undefined,
  ) {
    return this.storyPointsService.update(+id, updateStoryPointDto, token);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Headers('Authorization') token: string | undefined,
  ) {
    return this.storyPointsService.remove(+id, token);
  }
}
