import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Price extends Document {
  @Prop({ required: true, unique: true })
  label: string;

  @Prop({ required: true, default: 'USD' })
  currency: string;

  @Prop({ required: true })
  price: number;
}

export const PriceSchema = SchemaFactory.createForClass(Price);
