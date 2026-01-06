import { Controller, Get, Post, Put, Delete, Body, Param, Render, Res, NotFoundException } from '@nestjs/common';
import { Response } from 'express';
import { ObjectsService } from './objects.service';
import { Builder6Object } from './schemas/object.schema';

@Controller('objects')
export class ObjectsController {
  constructor(private readonly objectsService: ObjectsService) {}

  @Get()
  @Render('objects/index')
  async index() {
    const objects = await this.objectsService.findAll('mock-user-id');
    return {
      user: { name: 'Developer' },
      project: { name: 'Object Designer' },
      objects
    };
  }

  @Get('new')
  @Render('objects/editor')
  newObject() {
    return {
      user: { name: 'Developer' },
      project: { name: 'Object Designer' },
      isNew: true
    };
  }

  @Get(':id')
  @Render('objects/editor')
  async editObject(@Param('id') id: string) {
    // Avoid conflict with 'generate' or other static paths if they were under :id, but 'generate' is POST /objects/generate or similar. 
    // Wait, 'generate' is POST, but if I had GET 'generate' it would clash. 
    // It's fine since 'new' is specific.
    if (id === 'new') return this.newObject();
    
    const obj = await this.objectsService.findOne(id);
    return {
      user: { name: 'Developer' },
      project: { name: 'Object Designer' },
      object: obj,
      isNew: false
    };
  }

  @Post()
  async create(@Body() body: Partial<Builder6Object>) {
    return this.objectsService.create('mock-user-id', body);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: Partial<Builder6Object>) {
    return this.objectsService.update(id, 'mock-user-id', body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.objectsService.delete(id, 'mock-user-id');
  }

  @Post('generate')
  async generate(@Body('prompt') prompt: string) {
    return this.objectsService.generateSchema(prompt);
  }
}

