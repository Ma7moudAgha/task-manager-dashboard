/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TasksService } from './tasks.service';
import { Task } from './tasks.schema';
import { Types } from 'mongoose';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private tasksService: TasksService) { }

  @Get()
  getTasks(@Request() req) {
    return this.tasksService.findAllByUser(req.user.userId);
  }

  @Post()
  async createTask(@Body() body: { title: string; categoryId?: string }, @Request() req) {
    try {
      const taskData = {
        title: body.title,
        userId: req.user.userId,
        ...(body.categoryId && { categoryId: body.categoryId }),
      };
      return await this.tasksService.create(taskData);
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }

@Put(':id')
updateTask(
  @Param('id') id: string,
  @Body() body: Partial<{ title: string; completed: boolean; categoryId?: string }>
) {
  const updateData: Partial<Task> = {};

  if (body.title !== undefined) {
    updateData.title = body.title;
  }
  if (body.completed !== undefined) {
    updateData.completed = body.completed;
  }
  if (body.categoryId !== undefined) {
    updateData.categoryId = new Types.ObjectId(body.categoryId);
  }

  return this.tasksService.update(id, updateData);
}


  @Delete(':id')
  deleteTask(@Param('id') id: string, @Request() req) {
    return this.tasksService.delete(id, req.user.userId) // ← مرّر userId
  }


}
