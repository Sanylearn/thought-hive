
import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { motion } from 'framer-motion';
import { Share2, Calendar, Clock } from 'lucide-react';
import BlogCard from '../components/BlogCard';

// Mock data for the demo
const post = {
  id: '1',
  title: 'The Future of Artificial Intelligence in Everyday Life',
  content: `
    <p>Artificial intelligence (AI) has rapidly evolved from a niche technology to an integral part of our daily lives. From the moment we wake up to check our personalized news feeds to the recommendations that shape our entertainment choices, AI algorithms are constantly at work, quietly influencing our decisions and experiences.</p>
    
    <h2>The Invisible Revolution</h2>
    
    <p>What makes the AI revolution so profound is its invisibility. Unlike the industrial or digital revolutions, which introduced visible machinery and devices, AI operates behind the scenes. It powers the virtual assistants we speak to, curates the content we consume, and even helps diagnose our health conditions.</p>
    
    <p>This invisible integration has allowed AI to become ubiquitous without the resistance that sometimes accompanies more obvious technological shifts. We've welcomed these tools into our homes and pockets, often without fully understanding their capabilities or implications.</p>
    
    <h2>Everyday Applications</h2>
    
    <p>The applications of AI in our daily routines are becoming increasingly sophisticated:</p>
    
    <ul>
      <li><strong>Smart Home Management:</strong> AI systems now regulate our home environments, learning our preferences for temperature, lighting, and even grocery needs.</li>
      <li><strong>Health Monitoring:</strong> Wearable devices with AI capabilities track our vital signs and activity patterns, offering insights and early warnings about potential health issues.</li>
      <li><strong>Financial Decision-Making:</strong> AI algorithms help manage our investments, detect fraudulent transactions, and personalize financial advice.</li>
      <li><strong>Educational Tools:</strong> Adaptive learning platforms use AI to customize educational content to individual learning styles and progress.</li>
    </ul>
    
    <h2>The Ethical Landscape</h2>
    
    <p>As AI becomes more deeply embedded in our lives, important ethical questions emerge. Who is responsible when AI makes mistakes? How do we ensure these systems don't perpetuate existing biases? What boundaries should we set on AI's role in sensitive decisions?</p>
    
    <blockquote>
      "With great power comes great responsibility, and nowhere is this more true than in the development and deployment of artificial intelligence."
    </blockquote>
    
    <p>These questions aren't merely theoretical—they have real implications for privacy, autonomy, and equality. As consumers and citizens, we must engage with these issues while the technology is still evolving.</p>
    
    <h2>Looking Forward</h2>
    
    <p>The future relationship between humans and AI will likely be characterized by greater collaboration. Rather than replacing human capabilities, the most promising applications of AI enhance them, freeing people to focus on creative, empathetic, and strategic tasks that machines cannot replicate.</p>
    
    <p>As AI continues to evolve, our challenge will be to harness its potential while ensuring it serves human values and needs. This requires not just technological sophistication but wisdom about the kind of society we want to create.</p>
    
    <p>The AI revolution is just beginning. How we shape it will determine not just the future of technology, but the future of human experience itself.</p>
  `,
  date: 'May 15, 2023',
  imageUrl: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=1600&h=800',
  category: 'Technology',
  readTime: '8 min read',
  author: {
    name: 'John Doe',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  }
};

const relatedPosts = [
  {
    id: '5',
    title: 'The Ethics of AI in Healthcare Decisions',
    excerpt: 'As AI becomes more involved in medical diagnoses, we explore the ethical implications and necessary safeguards.',
    date: 'May 5, 2023',
    imageUrl: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=800&h=600',
    category: 'Technology'
  },
  {
    id: '6',
    title: 'How Machine Learning is Transforming Creative Industries',
    excerpt: 'From art generation to music composition, AI is opening new possibilities for human creativity.',
    date: 'April 22, 2023',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&h=600',
    category: 'Technology'
  },
  {
    id: '7',
    title: 'The Growing Concern of AI Hallucinations in Critical Systems',
    excerpt: 'Understanding why AI systems sometimes produce confident but incorrect information, and what we can do about it.',
    date: 'April 10, 2023',
    imageUrl: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=800&h=600',
    category: 'Technology'
  }
];

const PostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  // In a real app, you would fetch the post based on the id
  // For now, we'll just use our mock data
  
  return (
    <Layout>
      <article className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <span className="inline-block bg-gray-100 px-3 py-1 text-sm font-medium rounded-full mb-4">
            {post.category}
          </span>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-4 leading-tight">
            {post.title}
          </h1>
          
          <div className="flex items-center gap-4 text-gray-600 mb-6">
            <div className="flex items-center gap-1">
              <Calendar size={16} />
              <span className="text-sm">{post.date}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={16} />
              <span className="text-sm">{post.readTime}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3 mb-8">
            <img 
              src={post.author.avatar} 
              alt={post.author.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-medium">Written by</p>
              <p className="text-gray-900 font-semibold">{post.author.name}</p>
            </div>
            <div className="ml-auto">
              <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                <Share2 size={18} />
                <span className="text-sm font-medium">Share</span>
              </button>
            </div>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-10"
        >
          <img 
            src={post.imageUrl} 
            alt={post.title}
            className="w-full h-auto rounded-xl object-cover aspect-[16/9] mb-8"
          />
          
          <div 
            className="blog-content prose prose-gray max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="border-t border-gray-200 pt-10 mb-16"
        >
          <h2 className="text-2xl font-serif font-bold mb-6">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map(post => (
              <BlogCard key={post.id} {...post} />
            ))}
          </div>
        </motion.div>
      </article>
    </Layout>
  );
};

export default PostPage;
