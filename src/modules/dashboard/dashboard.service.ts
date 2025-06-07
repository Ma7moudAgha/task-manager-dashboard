/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { TasksService } from '../tasks/tasks.service';

@Injectable()
export class DashboardService {
  constructor(private tasksService: TasksService) { }

  async getStatsForUser(userId: string) {
    const all = await this.tasksService.findAllByUser(userId);

    const completed = all.filter(task => task.completed).length;
    const pending = all.length - completed;

    return {
      total: all.length,
      completed,
      pending,
    };
  }
}
