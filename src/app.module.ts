import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CityModule } from './city/city.module';
import { HttpExceptionFilter } from './exception.filter';
import { OrdersModule } from './orders/orders.module';
import { SwipeModule } from './swipe/swipe.module';
import { UserModule } from './user/user.module';

import { validate } from './utils/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validate }),
    MongooseModule.forRoot(process.env.MONGO_CONNECT || ''),
    UserModule,
    SwipeModule,
    CityModule,
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
  ],
})
export class AppModule {}
