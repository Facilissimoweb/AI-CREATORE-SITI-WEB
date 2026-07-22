export type BusinessCategory = 
  | 'ristorante' 
  | 'consulente' 
  | 'artigiano' 
  | 'servizi_casa' 
  | 'fitness' 
  | 'salute' 
  | 'altro';

export type GoalOption = 
  | 'chiamata' 
  | 'prezzi' 
  | 'prenotazione' 
  | 'whatsapp';

export type StyleTheme = 
  | 'semplice' 
  | 'elegante' 
  | 'colorato' 
  | 'minimal' 
  | 'rustico';

export interface PageSection {
  id: string;
  title: string;
  description: string;
  type: 'hero' | 'services' | 'about' | 'contact' | 'reviews' | 'gallery' | 'cta';
  contentItems?: Array<{
    title: string;
    subtitle?: string;
    price?: string;
    icon?: string;
    image?: string;
  }>;
}

export interface SitePage {
  id: string;
  title: string;
  slug: string;
  icon: string;
  subtitle: string;
  heroImage?: string;
  sections: PageSection[];
}

export interface SeoMetadata {
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
  author?: string;
  robots?: string;
  faviconUrl?: string;
}

export interface WebsiteBlueprint {
  businessName: string;
  category: BusinessCategory;
  categoryLabel: string;
  city: string;
  tagline: string;
  description: string;
  heroImageUrl: string;
  primaryGoal: GoalOption;
  selectedTheme: StyleTheme;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
  };
  fontFamily: string;
  phone: string;
  whatsapp: string;
  address: string;
  openingHours: string;
  pages: SitePage[];
  seo?: SeoMetadata;
}

export interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  suggestions?: string[];
}
