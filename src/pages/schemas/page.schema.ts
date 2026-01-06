export class Page {
  _id?: string;
  projectId?: string;
  name?: string; // Optional name for the page
  code: string;
  
  // Page Options
  metaTitle?: string;
  slug?: string; // URL slug, e.g. 'sign-up'
  addToNavigation?: boolean;
  sortOrder?: number;

  // Steedos Standard Fields
  owner?: string;
  created: Date;
  created_by?: string;
  modified: Date;
  modified_by?: string;
}

