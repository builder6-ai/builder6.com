import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class AiService {
  private openai: OpenAI;
  private defaultModel = 'google/gemini-3-pro-preview';
  private allowedKeywords: string[] = [
    'gpt-5', 
    'gemini-3',
  ];
  private models: any[] = [];

  constructor(private configService: ConfigService) {
    const defaultModel = this.configService.get<string>('OPENAI_MODEL_DEFAULT');
    if (defaultModel) {
      this.defaultModel = defaultModel;
    }

    const items = this.configService.get<string>('OPENAI_MODEL_ALLOWED');
    if (items) {
      this.allowedKeywords = items.split(',').map(k => k.trim());
    }

    if (!this.configService.get<string>('OPENAI_API_KEY')) {
      console.error('OPENAI_API_KEY is not set in the environment variables');
      return;
    }
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
      baseURL: this.configService.get<string>('OPENAI_BASE_URL'),
    });
  }

  async generateCode(prompt: string, currentCode?: string, model?: string) {
    const systemPrompt = `You are an expert web developer and UI designer. 
    Your task is to generate or modify HTML/Tailwind CSS code based on the user's request.
    
    If 'currentCode' is provided, you should modify it according to the user's instructions.
    If 'currentCode' is not provided, you should generate a new page from scratch.
    
    Return ONLY the HTML code. Do not include markdown backticks or explanations.
    Ensure the code is a complete HTML fragment or full page as appropriate, but primarily focus on the body content or the specific component requested.
    If the user asks for a full page, include <html>, <head>, <body> tags.
    Use Tailwind CSS for styling.
    `;

    const userMessage = currentCode 
      ? `Current Code:\n${currentCode}\n\nUser Request: ${prompt}`
      : `User Request: ${prompt}`;

    const completion = await this.openai.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      model: model || this.defaultModel,
    });

    let content = completion.choices[0].message.content || '';
    
    // Clean up markdown code blocks if present
    if (content.startsWith('```html')) {
      content = content.replace(/^```html\n/, '').replace(/\n```$/, '');
    } else if (content.startsWith('```')) {
      content = content.replace(/^```\n/, '').replace(/\n```$/, '');
    }

    return { code: content };
  }

  async getModels() {
    if (this.models && this.models.length > 0) return this.models;
    if (!this.configService.get<string>('OPENAI_API_KEY')) {
      return [];
    }
    try {
      const list = await this.openai.models.list();
      // Filter for coding capable models from major providers supported by Vercel AI Gateway
      // Also allow any model that might be passed via env or specific ones we know
      const models = list.data.filter(m => this.allowedKeywords.some(am => m.id.toLowerCase().includes(am)));
      
      models.sort((a, b) => {
        if (a.id === this.defaultModel) return -1;
        if (b.id === this.defaultModel) return 1;
        return 0;
      });
      
      this.models = models;
      return this.models;
    } catch (e) {
      console.error('Failed to fetch models from OpenAI', e);
      // Fallback list for Vercel AI Gateway
      return []
    }
  }
}
