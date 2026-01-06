import { Module, forwardRef } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectApiController } from './project-api.controller';
import { ProjectService } from './project.service';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from '../auth/auth.module';
import { PagesModule } from '../pages/pages.module';
import { ObjectsModule } from '../objects/objects.module';

@Module({
  imports: [
    DatabaseModule, 
    AuthModule, 
    ObjectsModule,
    forwardRef(() => PagesModule) 
  ],
  controllers: [ProjectController, ProjectApiController],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectsModule {}
