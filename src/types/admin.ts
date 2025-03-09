export interface Category {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  status: string;
  image_url: string | null;
  category: string;
  created_at: string;
  updated_at?: string;
  author_id: string;
  meta_description?: string;
  meta_keywords?: string;
  slug?: string;
}
