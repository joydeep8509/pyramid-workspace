import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.setGlobalPrefix('api');
  
  // 🛑 FIX: Explicitly allow ALL methods and origins so Next.js is never blocked
  app.enableCors({
    origin: ['https://pyramid-workspace.vercel.app', 'http://localhost:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');
  console.log('Backend running on http://localhost:3001/api');
}
bootstrap();
