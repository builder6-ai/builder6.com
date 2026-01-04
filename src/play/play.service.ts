import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Db } from 'mongodb';
import { Snippet } from './schemas/snippet.schema';
import { SnippetVersion } from './schemas/snippet-version.schema';
import { CreateSnippetDto } from './dto/create-snippet.dto';

@Injectable()
export class PlayService {
  constructor(@Inject('DATABASE_CONNECTION') private db: Db) {}

  private generateId(length = 6): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  async save(createSnippetDto: CreateSnippetDto, userId?: string): Promise<Snippet> {
    const { code, id } = createSnippetDto;
    const now = new Date();

    // 1. Try to update existing snippet if ID is provided
    if (id) {
      const existingSnippet = await this.db.collection<Snippet>('play_snippets').findOne({ _id: id });
      
      // If snippet exists AND belongs to the current user
      if (existingSnippet && existingSnippet.ownerId === userId && userId) {
        const newVersion: SnippetVersion = {
          _id: this.generateId(),
          snippetId: id,
          code: existingSnippet.code, // Save previous code as version
          createdAt: existingSnippet.updatedAt || existingSnippet.createdAt,
          versionId: this.generateId(4)
        };

        // Save version
        await this.db.collection<SnippetVersion>('play_snippet_versions').insertOne(newVersion);

        // Update current snippet
        await this.db.collection<Snippet>('play_snippets').updateOne(
          { _id: id },
          {
            $set: {
              code: code,
              updatedAt: now
            }
          }
        );
        
        return { ...existingSnippet, code, updatedAt: now };
      }
    }

    // 2. Create new snippet (Fork or New)
    const newSnippet: Snippet = {
      _id: this.generateId(),
      code,
      ownerId: userId,
      createdAt: now,
      updatedAt: now,
    };
    await this.db.collection<Snippet>('play_snippets').insertOne(newSnippet);
    return newSnippet;
  }

  async getVersions(snippetId: string): Promise<SnippetVersion[]> {
    return this.db.collection<SnippetVersion>('play_snippet_versions')
      .find({ snippetId })
      .sort({ createdAt: -1 })
      .toArray();
  }

  async findAll(): Promise<Snippet[]> {
    return this.db.collection<Snippet>('play_snippets').find().toArray();
  }

  async findOne(id: string): Promise<Snippet> {
    const snippet = await this.db
      .collection<Snippet>('play_snippets')
      .findOne({ _id: id });
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
