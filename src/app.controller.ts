import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';
import { AppService } from './app.service';
import { CreateSnippetDto } from './dto/create-snippet.dto';
import { Snippet } from './schemas/snippet.schema';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('api/snippets')
  async create(@Body() createSnippetDto: CreateSnippetDto): Promise<Snippet> {
    return this.appService.create(createSnippetDto);
  }

  @Get('api/snippets')
  async findAll(): Promise<Snippet[]> {
    return this.appService.findAll();
  }

  @Get('api/snippets/:id')
  async findOne(@Param('id') id: string): Promise<Snippet> {
    return this.appService.findOne(id);
  }

  @Get(':id')
  async getSnippetPage(@Param('id') id: string, @Res() res: Response) {
    return res.sendFile(join(__dirname, '..', 'public', 'index.html'));
  }
}
