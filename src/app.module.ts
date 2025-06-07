/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './modules/tasks/tasks.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CategoriesModule } from './modules/categories/categories.module';

@Module({
  imports: [
    // MongooseModule.forRoot('mongodb://localhost:27017/task-manager'),
    MongooseModule.forRoot('mongodb://mongodb+srv://magha7989:A0DbwuoyI1eWeu1y@cluster0.d3xjc4n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/task-manager'),
    TasksModule,
    AuthModule,
    UsersModule,
    CategoriesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
