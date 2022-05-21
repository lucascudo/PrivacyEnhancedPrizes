import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('PrivacyEnhancedPrizes')
    .setDescription('The PrivacyEnhancedPrizes API description')
    .setVersion('1.0')
    .addTag('PrivacyEnhancedPrizes')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
