import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const user = this.usersRepository.create({
        ...createUserDto,
        created_by: createUserDto['username'],
        updated_by: createUserDto['username'],
        user_token: 'USER__' + uuidv4(),
      });
      const savedUser = await this.usersRepository.save(user);
      return savedUser;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Something went wrong with creating the user',
        },
        HttpStatus.NOT_FOUND,
        {
          cause: 'Something went wrong with creating the user',
        },
      );
    }
  }

  async findOne(id: number): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({ where: { id } });

      if (!user) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'User not found',
          },
          HttpStatus.NOT_FOUND,
          {
            cause: 'User not found',
          },
        );
      }

      return user;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Something went wrong with finding the user',
        },
        HttpStatus.NOT_FOUND,
        {
          cause: 'Something went wrong with finding the user',
        },
      );
    }
  }
}
