import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Snippet, SnippetSchema } from './schemas/snippet.schema';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/play'),
    MongooseModule.forFeature([{ name: Snippet.name, schema: SnippetSchema }]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
