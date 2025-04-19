import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReportDocument = Report & Document;

@Schema({ timestamps: true })
export class Report {
  @Prop({ required: true })
  location: string;

  @Prop({ required: true })
  timestamp: number;

  @Prop({ required: true })
  temperature: number;

  @Prop({ required: true })
  pressure: number;

  @Prop({ required: true })
  humidity: number;

  @Prop({ required: true })
  cloudCover: number;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  icon: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: string;
}

export const ReportSchema = SchemaFactory.createForClass(Report);
