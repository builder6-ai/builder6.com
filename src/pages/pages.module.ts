import { Module, forwardRef } from '@nestjs/common';
import { PageController } from './page.controller';
import { PageService } from './page.service';
import { SiteController } from './site.controller';
import { DatabaseModule } from '../database/database.module';
import { AuthModule } from '../auth/auth.module';
import { ProjectsModule } from '../projects/projects.module';

@Module({
  imports: [
    DatabaseModule, 
    AuthModule, 
    forwardRef(() => ProjectsModule)
  ],
  controllers: [PageController, SiteController],
  providers: [PageService],
  exports: [PageService],
})
export class PagesModule {}
