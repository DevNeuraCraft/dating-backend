import { Document } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Gender } from './enum/gender.enum';

@Schema({ timestamps: true, versionKey: false })
export class User {
  @Prop({ required: true, unique: true, type: Number, index: true })
  id: number;

  @Prop({ type: String })
  first_name?: string;

  @Prop({ type: String })
  last_name?: string;

  @Prop({ type: String })
  username?: string;

  @Prop({ type: String })
  language_code?: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  about: string;

  @Prop({ type: Number, required: true })
  age: number;

  @Prop({ type: String, required: true })
  city: string;

  @Prop({ type: String, enum: Gender, required: true })
  gender: Gender;

  @Prop({ type: [String], default: [] })
  images: string[];
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);