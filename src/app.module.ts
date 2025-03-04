import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { SwipeModule } from './swipe/swipe.module';
import { validate } from './utils/config';
import { CityModule } from './city/city.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true, validate: validate}),
    MongooseModule.forRoot(process.env.MONGO_CONNECT || ''),
    UserModule,
    SwipeModule,
    CityModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
