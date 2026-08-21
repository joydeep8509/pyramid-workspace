import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';

@Controller('tasks')
export class TasksController {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  @Get()
  findAll() {
    return this.tasksRepository.find({ order: { createdAt: 'DESC' } });
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const task = await this.tasksRepository.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  @Post()
  create(@Body() taskData: Partial<Task>) {
    const task = this.tasksRepository.create(taskData);
    return this.tasksRepository.save(task);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updates: Partial<Task>) {
    await this.tasksRepository.update(id, updates);
    return this.tasksRepository.findOne({ where: { id } });
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.tasksRepository.delete(id);
    return { success: true };
  }
}
