import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';

@Controller('projects')
export class ProjectsController {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  @Get()
  findAll() {
    return this.projectsRepository.find({ order: { createdAt: 'DESC' } });
  }

  @Post()
  create(@Body() projectData: Partial<Project>) {
    const project = this.projectsRepository.create(projectData);
    return this.projectsRepository.save(project);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updates: Partial<Project>) {
    await this.projectsRepository.update(id, updates);
    return this.projectsRepository.findOne({ where: { id } });
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.projectsRepository.delete(id);
    return { success: true };
  }
}