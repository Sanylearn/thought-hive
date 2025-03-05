
export interface Post {
  id: string;
  title: string;
  content?: string;
  status: string;
  created_at: string;
  category: string;
  image_url?: string;
  is_markdown?: boolean;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  description?: string;
  cover_url?: string;
  download_url?: string;
  created_at: string;
  is_markdown?: boolean;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}
