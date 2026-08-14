// src/users/dto/update-user.dto.ts
import { PartialType } from '@nestjs/mapped-types'; // You may need to run: npm i @nestjs/mapped-types
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}