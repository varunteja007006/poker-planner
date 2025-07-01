import { PartialType } from '@nestjs/mapped-types';
import { CreateStoryPointDto } from './create-story_point.dto';

export class UpdateStoryPointDto extends PartialType(CreateStoryPointDto) {}
