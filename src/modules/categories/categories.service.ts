/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Category } from './categories.schema';
import { Task } from '../tasks/tasks.schema';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
    @InjectModel(Task.name) private taskModel: Model<Task>,
  ) { }

  async findAllByUser(userId: string): Promise<any[]> {
    return this.categoryModel.aggregate([
      {
        $match: {
          userId: new Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: 'tasks', // تأكد أن اسم المجموعة في MongoDB هو "tasks"
          localField: '_id',
          foreignField: 'categoryId',
          as: 'tasks',
        },
      },
      {
        $project: {
          name: 1,
          userId: 1,
          createdAt: 1,
          updatedAt: 1,
          taskCount: { $size: '$tasks' }, // ✅ عدّ المهام في الفئة
        },
      },
    ])
  }


  async create(category: { name: string; userId: string }) {
    const created = new this.categoryModel({
      name: category.name,
      userId: new Types.ObjectId(category.userId),
    });
    return created.save();
  }

  async update(
    id: string,
    updateData: Partial<{ name: string; userId: string }>
  ): Promise<Category | null> {
    const { userId, ...rest } = updateData;

    const updated = await this.categoryModel.findOneAndUpdate(
      {
        _id: new Types.ObjectId(id),
        userId: new Types.ObjectId(userId), // ← تحقق من ملكية المستخدم
      },
      rest,
      { new: true }
    );

    if (!updated) {
      throw new NotFoundException('الفئة غير موجودة أو ليس لديك صلاحية لتعديلها');
    }

    return updated;
  }


  async delete(id: string, userId: string) {
    const categoryObjectId = new Types.ObjectId(id);
    const userObjectId = new Types.ObjectId(userId);

    // ✅ تحقق من وجود مهام مرتبطة بالفئة
    const taskCount = await this.taskModel.countDocuments({
      categoryId: categoryObjectId,
      userId: userObjectId,
    });

    if (taskCount > 0) {
      throw new BadRequestException('لا يمكن حذف الفئة لوجود مهام مرتبطة بها.');
    }

    const category = await this.categoryModel.findOneAndDelete({
      _id: categoryObjectId,
      userId: userObjectId,
    }).exec();

    if (!category) {
      throw new NotFoundException('الفئة غير موجودة أو ليس لديك صلاحية لحذفها');
    }

    return category;
  }
}
