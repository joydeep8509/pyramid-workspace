// backend/src/tasks/tasks.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksController } from './tasks.controller';
import { Task } from './entities/task.entity';

@Module({
  // Register the Task entity so TypeORM can inject the repository
  imports: [TypeOrmModule.forFeature([Task])],
  controllers: [TasksController],
})
export class TasksModule {}