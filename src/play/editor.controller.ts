import { Controller, Get, Param, Req, Res, NotFoundException } from '@nestjs/common';
import { Request, Response } from 'express';
import { PlayService } from './play.service';
import { ProjectService } from './project.service';
import { AuthService } from '../auth/auth.service';

@Controller('app')
export class AppController {
  constructor(
    private readonly playService: PlayService,
    private readonly projectService: ProjectService,
    private readonly authService: AuthService,
  ) {}

  private async resolveProject(slugOrId: string) {
    let project = await this.projectService.findBySlug(slugOrId);
    if (!project) {
      try {
        project = await this.projectService.findOne(slugOrId);
      } catch (e) {
        // Ignore
      }
    }
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return project;
  }

  @Get(':projectSlug')
  async viewProjectHome(
    @Req() req: Request,
    @Param('projectSlug') projectSlug: string,
    @Res() res: Response,
  ) {
    const session = await this.authService.auth.api.getSession({
      headers: new Headers(req.headers as any),
    });
    if (!session) {
      return res.redirect('/login');
    }

    const project = await this.resolveProject(projectSlug);
    const pages = await this.playService.findAllByProject(project._id!);
    
    if (pages.length > 0) {
        const homePageId = project.homePage || pages[0]._id;
        const homePage = pages.find(p => p._id === homePageId) || pages[0];
        const pageSlug = homePage.path || homePage._id;
        const projectSlugToUse = project.slug || project._id;
        return res.redirect(`/app/${projectSlugToUse}/${pageSlug}`);
    }
    
    return res.status(404).send('No pages found');
  }

  @Get(':projectSlug/:pageSlug')
  async viewPage(
    @Req() req: Request,
    @Param('projectSlug') projectSlug: string,
    @Param('pageSlug') pageSlug: string,
    @Res() res: Response,
  ) {
    const session = await this.authService.auth.api.getSession({
      headers: new Headers(req.headers as any),
    });
    if (!session) {
      return res.redirect('/login');
    }

    const project = await this.resolveProject(projectSlug);
    
    // Try to find page by path (slug) first
    let page = await this.playService.findByPath(project._id!, pageSlug);
    
    // If not found, try by ID
    if (!page) {
        try {
            const p = await this.playService.findOne(pageSlug);
            if (p && p.projectId === project._id) {
                page = p;
            }
        } catch (e) {
            // Ignore
        }
    }

    if (!page) {
       return res.status(404).send('Page not found');
    }

    const pages = await this.playService.findAllByProject(project._id!);
    const navPages = pages.filter(p => p.addToNavigation);

    // Generate Edit URL
    const editUrl = `/projects/${project._id}/${page._id}/edit`;

    const html = this.playService.buildHtml(page, project, navPages, editUrl);
    return res.send(html);
  }
}