/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Task } from './tasks.schema';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<Task>) { }


  async findAllByUser(userId: string): Promise<Task[]> {
    return this.taskModel.find({ userId: new Types.ObjectId(userId) })
      .populate('categoryId')
      .exec();
  }



  async create(task: { title: string; userId: string; categoryId?: string }) {
    try {
      if (!task.userId) {
        throw new Error('userId is required');
      }
      if (!task.title) {
        throw new Error('title is required');
      }
      // ممكن تضيف تحقق من categoryId لو حبيت

      const created = new this.taskModel({
        title: task.title,
        userId: new Types.ObjectId(task.userId),
        ...(task.categoryId && { categoryId: new Types.ObjectId(task.categoryId) }),
      });
      return await created.save();
    } catch (error) {
      console.error('Error creating task:', error);
      throw error;
    }
  }





async update(id: string, updateData: Partial<Task>): Promise<Task | null> {
  if (updateData.categoryId) {
    updateData.categoryId = new Types.ObjectId(updateData.categoryId);
  }
  return this.taskModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
}



  async delete(id: string, userId: string) {
    console.log('Deleting task with id:', id, 'for userId:', userId);

    const task = await this.taskModel.findOneAndDelete({
      _id: new Types.ObjectId(id),
      userId: new Types.ObjectId(userId),
    }).exec();

    if (!task) {
      throw new NotFoundException('Task not found or not authorized');
    }

    return task;
  }



}
