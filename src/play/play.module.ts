import { Module } from '@nestjs/common';
import { PlayController } from './play.controller';
import { PlayService } from './play.service';
import { ProjectController } from './project.controller';
import { SiteController } from './site.controller';
import { AppController } from './editor.controller';
import { ProjectService } from './project.service';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [DatabaseModule, AuthModule],
  controllers: [PlayController, ProjectController, SiteController, AppController],
  providers: [PlayService, ProjectService],
})
export class PlayModule {}
