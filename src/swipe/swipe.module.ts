import { OrdersModule } from 'src/orders/orders.module';
import { UserModule } from 'src/user/user.module';

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SwipeController } from './swipe.controller';
import { Swipe, SwipeSchema } from './swipe.schema';
import { SwipeService } from './swipe.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Swipe.name, schema: SwipeSchema }]),
    OrdersModule,
    UserModule,
  ],
  controllers: [SwipeController],
  providers: [SwipeService],
})
export class SwipeModule {}