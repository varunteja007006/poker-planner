import {
  Controller,
  Get,
  Post,
  Body,
  Headers,
  Query,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  create(
    @Body() createRoomDto: CreateRoomDto,
    @Headers('Authorization') token: string | undefined,
  ) {
    return this.roomsService.create(createRoomDto, token);
  }

  @Get()
  findAll(@Query('room_code') room_code: string) {
    return this.roomsService.findAll(room_code);
  }
}
