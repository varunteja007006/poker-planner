import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
} from '@nestjs/common';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';

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
  findAll(@Headers('Authorization') token: string | undefined) {
    return this.teamsService.findAll(token);
  }

  @Get(':id')
  findOne(
    @Param('id') id: string,
    @Headers('Authorization') token: string | undefined,
  ) {
    return this.teamsService.findOne(+id, token);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTeamDto: UpdateTeamDto,
    @Headers('Authorization') token: string | undefined,
  ) {
    return this.teamsService.update(+id, updateTeamDto, token);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
    @Headers('Authorization') token: string | undefined,
  ) {
    return this.teamsService.remove(+id, token);
  }
}
