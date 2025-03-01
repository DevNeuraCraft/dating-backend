import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { SwipeStatus } from './enum/swipe-status.enum';
import { SwipeType } from './enum/swipe-type.enum';
import { User } from 'src/user/user.schema';

@Schema({ timestamps: true })
export class Swipe {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  swiper_id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  swiped_id: Types.ObjectId;

  @Prop({ type: String, enum: SwipeType, required: true })
  swipe_type: string;

  @Prop({ type: String, enum: SwipeStatus, default: SwipeStatus.IGNORED })
  status: string;
}

export type SwipeDocument = Swipe & Document;
export const SwipeSchema = SchemaFactory.createForClass(Swipe);
