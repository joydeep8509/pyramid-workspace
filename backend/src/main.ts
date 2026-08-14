// backend/src/main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 1. Force all routes to start with /api (e.g., http://localhost:3001/api/tasks)
  app.setGlobalPrefix('api');

  // 2. Enable CORS for your frontend
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // 3. Run strictly on 3001 to avoid colliding with Next.js
  await app.listen(3001);
  console.log('Backend running on http://localhost:3001/api');
}
bootstrap();