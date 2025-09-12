import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Headers,
  Get,
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

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateStoryDto: UpdateStoryDto,
    @Headers('Authorization') token: string | undefined,
  ) {
    return this.storiesService.update(+id, updateStoryDto, token);
  }

  @Post(':id/vote')
  submitVote(
    @Param('id') id: string,
    @Body() body: { vote: number },
    @Headers('Authorization') token: string | undefined,
  ) {
    return this.storiesService.submitVote(+id, body.vote, token);
  }

  @Get(':id/votes')
  getVotes(@Param('id') id: string) {
    return this.storiesService.getVotes(+id);
  }
}
