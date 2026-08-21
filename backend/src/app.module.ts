import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from './tasks/tasks.module';
import { ProjectsModule } from './projects/projects.module'; 
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
        
        // Dynamically fetch all credentials
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT') || 4000,
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE') || 'test',
        
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        
        synchronize: configService.get<string>('NODE_ENV') !== 'production',

        ssl: {
          minVersion: 'TLSv1.2',
          rejectUnauthorized: true,
        },
        extra: {
          ssl: {
            minVersion: 'TLSv1.2',
            rejectUnauthorized: true,
          },
        },
      }),
    }),
    TasksModule,
    ProjectsModule,
    UsersModule,
  ],
})
export class AppModule { }
