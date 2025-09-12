import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Headers,
  Query,
} from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';

@Controller('teams')
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  create(
    @Body() createTeamDto: CreateTeamDto,
    @Headers('Authorization') token: string | undefined,
  ) {
    return this.teamsService.create(createTeamDto, token);
  }

  @Get()
  findAll(
    @Query('room_code') room_code: string | undefined,
    @Query('filterByUser') filterByUser: boolean | undefined,
    @Headers('Authorization') token: string | undefined,
  ) {
    return this.teamsService.findAll(room_code, token, filterByUser);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Headers('Authorization') token: string | undefined,
  ) {
    return this.teamsService.findOne(+id, token);
  }
}
