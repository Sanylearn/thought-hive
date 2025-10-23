-- Make author_id nullable in posts table to allow sample data
ALTER TABLE public.posts ALTER COLUMN author_id DROP NOT NULL;

-- Insert sample categories
INSERT INTO public.categories (id, name, description) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Technology', 'Articles about technology and innovation'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Politics', 'Political analysis and commentary'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Society', 'Social issues and cultural topics'),
  ('550e8400-e29b-41d4-a716-446655440004', 'Environment', 'Environmental concerns and climate change'),
  ('550e8400-e29b-41d4-a716-446655440005', 'Economy', 'Economic trends and financial matters');

-- Insert sample posts
INSERT INTO public.posts (id, title, content, status, image_url, category, meta_description, slug) VALUES
  ('650e8400-e29b-41d4-a716-446655440001', 
   'The Future of Artificial Intelligence', 
   '# The Future of Artificial Intelligence

Artificial Intelligence is transforming our world at an unprecedented pace. From healthcare to transportation, AI is reshaping industries and creating new possibilities.

## Key Developments

- **Machine Learning**: Algorithms that learn from data
- **Natural Language Processing**: Understanding human language
- **Computer Vision**: Interpreting visual information

The implications are profound and far-reaching.',
   'published',
   'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
   'Technology',
   'Exploring the latest developments and future implications of artificial intelligence technology',
   'future-of-artificial-intelligence'),
   
  ('650e8400-e29b-41d4-a716-446655440002',
   'Climate Change: A Call to Action',
   '# Climate Change: A Call to Action

The climate crisis demands immediate and sustained action from all sectors of society.

## What We Can Do

1. Reduce carbon emissions
2. Support renewable energy
3. Advocate for policy changes
4. Make sustainable choices

Every action counts in the fight against climate change.',
   'published',
   'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800',
   'Environment',
   'Understanding climate change and what actions we can take to combat it',
   'climate-change-call-to-action'),
   
  ('650e8400-e29b-41d4-a716-446655440003',
   'The State of Democracy in 2025',
   '# The State of Democracy in 2025

Democracy faces both challenges and opportunities in our modern era.

## Current Challenges

- Misinformation and fake news
- Political polarization
- Voter accessibility
- Digital privacy concerns

Understanding these challenges is the first step toward strengthening democratic institutions.',
   'published',
   'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800',
   'Politics',
   'Analyzing the current state of democracy and its challenges in the modern world',
   'state-of-democracy-2025');

-- Insert sample books
INSERT INTO public.books (id, title, author, description, cover_url, download_url) VALUES
  ('750e8400-e29b-41d4-a716-446655440001',
   'The Digital Revolution',
   'Dr. Sarah Chen',
   'A comprehensive guide to understanding how digital technology is reshaping our society, economy, and daily lives.',
   'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
   'https://example.com/books/digital-revolution.pdf'),
   
  ('750e8400-e29b-41d4-a716-446655440002',
   'Sustainable Living Guide',
   'Michael Green',
   'Practical strategies for reducing your environmental footprint and living a more sustainable lifestyle.',
   'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400',
   'https://example.com/books/sustainable-living.pdf'),
   
  ('750e8400-e29b-41d4-a716-446655440003',
   'Understanding Modern Politics',
   'Prof. James Anderson',
   'An accessible introduction to contemporary political systems, ideologies, and the forces shaping global politics.',
   'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400',
   'https://example.com/books/modern-politics.pdf');

-- Insert sample book reviews
INSERT INTO public.book_reviews (book_id, name, rating, content) VALUES
  ('750e8400-e29b-41d4-a716-446655440001',
   'John Doe',
   5,
   'An excellent read! This book provides deep insights into how technology is transforming our world. Highly recommended for anyone interested in understanding the digital age.'),
   
  ('750e8400-e29b-41d4-a716-446655440001',
   'Jane Smith',
   4,
   'Very informative and well-written. The author does a great job of explaining complex concepts in an accessible way.'),
   
  ('750e8400-e29b-41d4-a716-446655440002',
   'Alex Green',
   5,
   'This guide has completely changed how I approach daily life. Full of practical tips that anyone can implement immediately.'),
   
  ('750e8400-e29b-41d4-a716-446655440003',
   'Maria Rodriguez',
   4,
   'A solid introduction to political science. Great for students and anyone wanting to understand current events better.');