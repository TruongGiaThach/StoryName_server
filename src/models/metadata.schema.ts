import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchema } from './base.schema';

@Schema({ timestamps: true })
export class Metadata extends BaseSchema {
  @Prop({ required: true, unique: true })
  tokenId: string;

  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  image: string;

  @Prop({ required: true })
  url: string;
}

export const MetadataSchema = SchemaFactory.createForClass(Metadata);
