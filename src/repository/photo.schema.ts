import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PhotoDocument = Photo & Document;

@Schema()
export class Photo {
  @Prop({ required: true })
  url: string;

  @Prop({ required: true })
  key: string;

  @Prop({ required: true })
  userId: string;

  @Prop({ type: [String], default: [] })
  tags: string[];
}

export const PhotoSchema = SchemaFactory.createForClass(Photo);
