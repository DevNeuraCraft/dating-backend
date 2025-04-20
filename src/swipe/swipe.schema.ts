import { Document, Types } from 'mongoose';
import { User } from 'src/user/user.schema';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SwipeStatus } from './enum/swipe-status.enum';
import { SwipeType } from './enum/swipe-type.enum';

@Schema({ timestamps: true, versionKey: false })
export class Swipe {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true, index: true })
  swiper_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true, index: true })
  swiped_id: Types.ObjectId;

  @Prop({ type: String, enum: SwipeType, required: true })
  swipe_type: string;

  @Prop({ type: String, enum: SwipeStatus, default: SwipeStatus.IGNORED })
  status: string;
}

export type SwipeDocument = Swipe & Document;
export const SwipeSchema = SchemaFactory.createForClass(Swipe);

SwipeSchema.index(
  { swiper_id: 1, swiped_id: 1 },
  { unique: true, name: 'unique_swiper_swiped' },
);
