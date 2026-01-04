import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Snippet } from './schemas/snippet.schema';
import { CreateSnippetDto } from './dto/create-snippet.dto';

@Injectable()
export class AppService {
  constructor(@InjectModel(Snippet.name) private snippetModel: Model<Snippet>) {}

  getHello(): string {
    return 'Hello World!';
  }

  async create(createSnippetDto: CreateSnippetDto): Promise<Snippet> {
    const createdSnippet = new this.snippetModel(createSnippetDto);
    return createdSnippet.save();
  }

  async findAll(): Promise<Snippet[]> {
    return this.snippetModel.find().exec();
  }

  async findOne(id: string): Promise<Snippet> {
    const snippet = await this.snippetModel.findById(id).exec();
    if (!snippet) {
      throw new NotFoundException(`Snippet #${id} not found`);
    }
    return snippet;
  }

  buildHtml(code: string): string {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
    ${code}
</body>
</html>`;
  }
}
