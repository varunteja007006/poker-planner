import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

import { Client } from './entities/client.entity';
import { User } from 'src/users/entities/user.entity';

import { Repository } from 'typeorm';
import { extractToken } from 'src/utils/utils';

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientsRepository: Repository<Client>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(
    createClientDto: CreateClientDto,
    token: string | undefined,
  ): Promise<Client> {
    try {
      if (!token) {
        throw new Error('Token not found');
      }

      const user_token = extractToken(token);

      const user = await this.usersRepository.findOne({
        where: { user_token },
      });

      if (!user) {
        throw new Error('User not found');
      }

      const clientExists = await this.clientsRepository.findOne({
        where: {
          user,
          client_id: createClientDto.client_id,
          session_id: createClientDto.session_id,
        },
      });

      if (clientExists) {
        return clientExists;
      }

      const client = this.clientsRepository.create({
        ...createClientDto,
        user,
        created_by: user,
        updated_by: user,
      });

      const savedClient = await this.clientsRepository.save(client);

      return savedClient;
    } catch (error) {
      console.error(error);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: error.message,
        },
      );
    }
  }

  async findAll(): Promise<Client[]> {
    try {
      const clients = await this.clientsRepository.find();
      return clients;
    } catch (error) {
      console.error(error);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: error.message,
        },
      );
    }
  }

  async findOne(id: number, token: string | undefined): Promise<Client> {
    try {
      if (!token) {
        throw new Error('Token not found');
      }

      const user_token = extractToken(token);

      const user = await this.usersRepository.findOne({
        where: { user_token },
      });

      if (!user) {
        throw new Error('User not found');
      }

      const client = await this.clientsRepository.findOne({
        where: { id },
      });

      if (!client) {
        throw new Error('Client not found');
      }

      return client;
    } catch (error) {
      console.error(error);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: error.message,
        },
      );
    }
  }

  async update(
    id: number,
    updateClientDto: UpdateClientDto,
    token: string | undefined,
  ): Promise<boolean> {
    try {
      if (!token) {
        throw new Error('Token not found');
      }

      const user_token = extractToken(token);

      const user = await this.usersRepository.findOne({
        where: { user_token },
      });

      if (!user) {
        throw new Error('User not found');
      }

      const client = await this.clientsRepository.findOne({
        where: { id },
      });

      if (!client) {
        throw new Error('Client not found');
      }

      const updatedClient = await this.clientsRepository.update(id, {
        ...updateClientDto,
        updated_by: user,
      });

      return !!updatedClient.affected;
    } catch (error) {
      console.error(error);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: error.message,
        },
      );
    }
  }

  async remove(id: number, token: string | undefined): Promise<boolean> {
    try {
      if (!token) {
        throw new Error('Token not found');
      }

      const user_token = extractToken(token);

      const user = await this.usersRepository.findOne({
        where: { user_token },
      });

      if (!user) {
        throw new Error('User not found');
      }

      const client = await this.clientsRepository.findOne({
        where: { id },
      });

      if (!client) {
        throw new Error('Client not found');
      }

      const deletedClient = await this.clientsRepository.delete(id);

      return !!deletedClient.affected;
    } catch (error) {
      console.error(error);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.message,
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: error.message,
        },
      );
    }
  }
}
