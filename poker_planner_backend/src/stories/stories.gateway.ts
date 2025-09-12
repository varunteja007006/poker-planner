import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { Story } from './entities/story.entity';
import { Injectable } from '@nestjs/common';
import { StoriesService } from './stories.service';

@WebSocketGateway({
  cors: {
    origin: '*',
    // origin: "http://localhost:3000",
    // credentials: true,
  },
})
@Injectable()
export class StoriesGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly storiesService: StoriesService) {}

  @SubscribeMessage('stories:check')
  check(@ConnectedSocket() socket: Socket) {
    this.server.emit('stories:check', {
      clientId: socket.id,
      message: {
        connected: true,
        message: 'stories ws ok',
      },
    });
  }

  @SubscribeMessage('stories:create')
  created(@ConnectedSocket() socket: Socket, @MessageBody() body: Story) {
    this.server.to(body.room.room_code).emit('stories:created', {
      clientId: socket.id,
      message: `${body.created_by.username} started the game`,
      body,
    });
  }

  @SubscribeMessage('stories:update')
  async updated(@ConnectedSocket() socket: Socket, @MessageBody() body: Story) {
    const isCompleted = body.story_point_evaluation_status === 'completed';
    const message = isCompleted ? 'ended game' : 'started game';

    if (!body.room?.room_code) {
      console.error('Room code is missing in the request body');
      return;
    }

    let responseData: any = {
      clientId: socket.id,
      message: `${body.created_by.username} ${message}`,
      body,
    };

    // If story is completed, include vote statistics for the chart
    if (isCompleted && body.votes && body.votes.length > 0) {
      // Group votes by story point value and count them
      const voteGroups: { [key: string]: number } = {};
      let totalVotes = 0;
      let totalPoints = 0;

      body.votes.forEach(vote => {
        const voteValue = vote.vote.toString();
        voteGroups[voteValue] = (voteGroups[voteValue] || 0) + 1;
        totalVotes++;
        totalPoints += vote.vote;
      });

      // Convert to array format expected by chart
      const groupByStoryPointArray = Object.entries(voteGroups).map(([name, value]) => ({
        name,
        value
      }));

      const averageStoryPoint = totalVotes > 0 ? totalPoints / totalVotes : 0;

      responseData = {
        ...responseData,
        groupByStoryPointArray,
        averageStoryPoint: Number(averageStoryPoint.toFixed(2))
      };
    }

    // emit the updated story to the room
    this.server.to(body.room.room_code).emit('stories:updated', responseData);

    return {
      story: body,
    };
  }

  @SubscribeMessage('story-points:create')
  async createVote(
    @ConnectedSocket() socket: Socket, 
    @MessageBody() body: { 
      story_point: number; 
      story_id: number; 
      token: string; 
      room_code: string;
    }
  ) {
    try {
      const result = await this.storiesService.submitVote(
        body.story_id, 
        body.story_point, 
        body.token
      );

      // Transform votes to match frontend expectations
      const storyPoints = result.votes.map(vote => ({
        id: `${body.story_id}-${vote.user_id}`, // synthetic ID
        story_point: vote.vote,
        is_active: true,
        created_at: vote.voted_at,
        updated_at: vote.voted_at,
        deleted_at: null,
        user: {
          id: vote.user_id,
          username: vote.username,
        },
      }));

      // Emit to room about the new vote
      this.server.to(body.room_code).emit('vote:submitted', {
        clientId: socket.id,
        storyId: body.story_id,
        votes: storyPoints,
        averageVote: result.averageVote,
      });

      // Find the current user's vote for the response
      const currentUserVote = storyPoints.find(sp => 
        sp.user.id === result.votes.find(v => v.vote === body.story_point)?.user_id
      );

      return {
        success: true,
        vote: currentUserVote,
        votes: storyPoints,
        averageVote: result.averageVote,
      };
    } catch (error) {
      console.error('Error creating vote:', error);
      return { success: false, error: error.message };
    }
  }
}
