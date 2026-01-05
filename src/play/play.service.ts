import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Db } from 'mongodb';
import { Page } from './schemas/page.schema';
import { Project } from './schemas/project.schema';
import { PageVersion } from './schemas/page-version.schema';
import { CreatePageDto } from './dto/create-page.dto';

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

  async save(createPageDto: CreatePageDto, userId?: string): Promise<Page> {
    const { code, id, projectId, name, metaTitle, path, addToNavigation } = createPageDto;
    const now = new Date();

    // 1. Try to update existing page if ID is provided
    if (id) {
      const existingPage = await this.db.collection<Page>('play_pages').findOne({ _id: id });
      
      // If page exists AND belongs to the current user
      if (existingPage && existingPage.owner === userId && userId) {
        const newVersion: PageVersion = {
          _id: this.generateId(),
          pageId: id,
          code: existingPage.code, // Save previous code as version
          versionId: this.generateId(4),
          
          // Steedos Standard Fields
          owner: existingPage.owner,
          created: existingPage.modified || existingPage.created,
          created_by: existingPage.modified_by || existingPage.created_by,
        };

        // Save version
        await this.db.collection<PageVersion>('play_page_versions').insertOne(newVersion);

        // Update current page
        const updateFields: any = {
          code: code,
          modified: now,
          modified_by: userId
        };
        if (name) updateFields.name = name;
        if (metaTitle !== undefined) updateFields.metaTitle = metaTitle;
        if (path !== undefined) updateFields.path = path;
        if (addToNavigation !== undefined) updateFields.addToNavigation = addToNavigation;

        await this.db.collection<Page>('play_pages').updateOne(
          { _id: id },
          { $set: updateFields }
        );
        
        return { ...existingPage, ...updateFields };
      }
    }

    // 2. Create new page (Fork or New)
    const newPage: Page = {
      _id: this.generateId(),
      code,
      owner: userId,
      created: now,
      created_by: userId,
      modified: now,
      modified_by: userId,
      projectId: projectId,
      name: name || 'Untitled Page',
      metaTitle,
      path,
      addToNavigation
    };
    await this.db.collection<Page>('play_pages').insertOne(newPage);
    return newPage;
  }

  async findAllByProject(projectId: string): Promise<Page[]> {
    return this.db.collection<Page>('play_pages')
      .find({ projectId })
      .sort({ modified: -1 })
      .toArray();
  }

  async getVersions(pageId: string): Promise<PageVersion[]> {
    return this.db.collection<PageVersion>('play_page_versions')
      .find({ pageId })
      .sort({ created: -1 })
      .toArray();
  }

  async findAll(userId?: string): Promise<Page[]> {
    const query = userId ? { owner: userId } : {};
    return this.db.collection<Page>('play_pages').find(query).sort({ modified: -1 }).toArray();
  }

  async findOne(id: string): Promise<Page> {
    const page = await this.db
      .collection<Page>('play_pages')
      .findOne({ _id: id });
    if (!page) {
      throw new NotFoundException(`Page #${id} not found`);
    }
    return page;
  }

  async delete(id: string, userId: string): Promise<void> {
    const page = await this.findOne(id);
    if (page.owner !== userId) {
      throw new NotFoundException(`Page #${id} not found or you don't have permission`);
    }
    await this.db.collection<Page>('play_pages').deleteOne({ _id: id });
  }

  buildHtml(page: Page, project?: Project, navPages: Page[] = [], editUrl?: string): string {
    const title = page.metaTitle || page.name || 'Untitled Page';
    
    let navHtml = '';
    let editBtnHtml = '';

    if (editUrl) {
        editBtnHtml = `
        <a href="${editUrl}" class="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-full shadow-lg font-medium transition-all flex items-center gap-2 hover:scale-105 active:scale-95">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
            Edit Page
        </a>`;
    }

    if (project?.displayNavigation && navPages.length > 0) {
        const projectSlug = project.slug || project._id;
        const links = navPages.map(p => {
            const href = p.path ? `/app/${projectSlug}/${p.path}` : `/app/${projectSlug}/${p._id}`;
            const activeClass = p._id === page._id ? 'text-white font-medium' : 'text-gray-400 hover:text-white';
            return `<a href="${href}" class="${activeClass} transition-colors">${p.name}</a>`;
        }).join('');

        navHtml = `
        <nav class="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10 px-6 py-4">
            <div class="max-w-7xl mx-auto flex items-center justify-between">
                <a href="/app/${projectSlug}" class="text-white font-bold text-lg tracking-tight">${project.name}</a>
                <div class="flex items-center gap-6 text-sm">
                    ${links}
                </div>
            </div>
        </nav>
        <div class="h-16"></div> <!-- Spacer -->
        `;
    }

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-black min-h-screen text-white">
    ${navHtml}
    ${page.code}
    ${editBtnHtml}
</body>
</html>`;
  }

  async findByPath(projectId: string, path: string): Promise<Page | null> {
    return this.db.collection<Page>('play_pages').findOne({ projectId, path });
  }
}
