import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';

export type CommitmentDocument = Commitment & Document;

@Schema({
  timestamps: true,
})
export class Commitment {
  @Prop({ required: true, unique: true })
  commitmentHash: string;

  @Prop({ required: true })
  userAddress: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, type: SchemaTypes.Buffer })
  secret: string;

  @Prop({ required: true, type: Date, expires: '24h' })
  createdAt: Date;
}

export const CommitmentSchema = SchemaFactory.createForClass(Commitment);
