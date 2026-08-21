import { Controller, Get, Patch, Body, Param, ParseIntPipe, Delete } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}


  @Get('profile')
  async getProfile() {
    let user = await this.usersRepository.findOne({ where: { id: 1 } });
    
    // Seed a default user if the database is empty
    if (!user) {
      user = await this.usersRepository.save({ 
        id: 1, 
        name: 'Dexter', 
        email: 'dexter@gmail.com', 
        title: 'Designer', 
        username: 'Dexuser' 
      });
    }
    return user;
  }

  @Patch('profile')
  async updateProfile(@Body() updates: Partial<User>) {
    let user = await this.usersRepository.findOne({ where: { id: 1 } });
    
    if (!user) {
      user = this.usersRepository.create({ id: 1, ...updates });
    } else {
      Object.assign(user, updates);
    }
    
    return this.usersRepository.save(user);
  }


  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersRepository.findOne({ where: { id } });
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updates: Partial<User>) {
    return this.usersRepository.update(id, updates);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersRepository.delete(id);
  }
}
