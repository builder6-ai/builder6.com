import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SnippetDocument = HydratedDocument<Snippet>;

@Schema()
export class Snippet {
  @Prop({ required: true })
  code: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const SnippetSchema = SchemaFactory.createForClass(Snippet);
