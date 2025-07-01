import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StoryPointsService } from './story_points.service';
import { CreateStoryPointDto } from './dto/create-story_point.dto';
import { UpdateStoryPointDto } from './dto/update-story_point.dto';

@Controller('story-points')
export class StoryPointsController {
  constructor(private readonly storyPointsService: StoryPointsService) {}

  @Post()
  create(@Body() createStoryPointDto: CreateStoryPointDto) {
    return this.storyPointsService.create(createStoryPointDto);
  }

  @Get()
  findAll() {
    return this.storyPointsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storyPointsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStoryPointDto: UpdateStoryPointDto) {
    return this.storyPointsService.update(+id, updateStoryPointDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storyPointsService.remove(+id);
  }
}
