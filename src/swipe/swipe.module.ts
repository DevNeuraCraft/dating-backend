import { Module } from '@nestjs/common';
import { Swipe, SwipeSchema } from './swipe.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Swipe.name, schema: SwipeSchema }]),
  ],
})
export class SwipeModule {}
