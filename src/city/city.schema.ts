import { Document } from 'mongoose';

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ versionKey: false })
export class City {
  @Prop({ required: true, unique: true, type: String })
  name: string;
}

export type CityDocument = City & Document;
export const CitySchema = SchemaFactory.createForClass(City);
