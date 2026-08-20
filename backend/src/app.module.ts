import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from './tasks/tasks.module';
import { ProjectsModule } from './projects/projects.module'; // Add this
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        driver: require('mysql2'),

        // Inside app.module.ts useFactory:
        host: configService.get<string>('DB_HOST'),
        port: 4000,
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: 'test',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true, // Note: Set to false in production deployment

        ssl: {
          minVersion: 'TLSv1.2',
          rejectUnauthorized: true,
        },
        // 🛑 2. Extra config pushes it directly into the mysql2 connection pool
        extra: {
          ssl: {
            minVersion: 'TLSv1.2',
            rejectUnauthorized: true,
          },
        },
      }),
    }),
    TasksModule, // Add the TasksModule to the main imports array
    ProjectsModule,
    UsersModule,
  ],
})
export class AppModule { }