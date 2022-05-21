import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { KeyExchangeModule } from './key-exchange/key-exchange.module';
@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_CONNECTION_STRING),
    AuthModule,
    UsersModule,
    KeyExchangeModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
