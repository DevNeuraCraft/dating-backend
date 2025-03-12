import { Module } from '@nestjs/common';
import { Swipe, SwipeSchema } from './swipe.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { SwipeController } from './swipe.controller';
import { SwipeService } from './swipe.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Swipe.name, schema: SwipeSchema }]),
  ],
  controllers: [SwipeController],
  providers: [SwipeService],
})
export class SwipeModule {}
