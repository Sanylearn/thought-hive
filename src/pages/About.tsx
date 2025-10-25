import React from 'react';
import { motion } from 'framer-motion';
import Layout from '../components/Layout';
import { Mail, MessageCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import MetaTags from '../components/SEO/MetaTags';

const About: React.FC = () => {
  return (
    <Layout>
      <MetaTags
        title="About - Opinion Matters"
        description="Learn about Opinion Matters - a platform for sharing perspectives on technology, culture, and innovation. Join the conversation that shapes tomorrow."
      />
      
      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Hero Section */}
        <motion.section 
          className="text-center mb-16 py-12 rounded-2xl border border-border bg-gradient-to-br from-background via-background to-muted/30 shadow-lg backdrop-blur-sm"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            About Opinion Matters
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto px-6">
            Where perspectives meet innovation and ideas shape the future
          </p>
        </motion.section>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="space-y-8 mb-16"
        >
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <section className="rounded-xl border border-border p-8 bg-card">
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <MessageCircle className="text-primary" size={28} />
                Our Mission
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                This blog was started to share my opinion on the recent technologies 
                and information happening around the world. In an era of rapid innovation 
                and constant change, having a platform to discuss, analyze, and share 
                perspectives has never been more important.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                Every opinion matters. Every perspective adds value. Through thoughtful 
                discussions on technology, culture, and innovation, we aim to create a 
                space where ideas flourish and meaningful conversations take place.
              </p>
            </section>

            <section className="rounded-xl border border-border p-8 bg-card">
              <h2 className="text-2xl font-semibold mb-4">What We Cover</h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Emerging technologies and their impact on society</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Cultural trends and their intersection with technology</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Innovation insights and future predictions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-primary mr-2">•</span>
                  <span>Thoughtful analysis of current events and developments</span>
                </li>
              </ul>
            </section>
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="rounded-xl border border-border p-8 bg-gradient-to-br from-primary/5 to-primary/10 text-center"
        >
          <Mail className="mx-auto mb-4 text-primary" size={48} />
          <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Have questions, suggestions, or just want to share your thoughts? 
            I'd love to hear from you. Feel free to reach out for any queries or issues.
          </p>
          <Button size="lg" className="gap-2">
            <Mail size={18} />
            Contact Me
          </Button>
        </motion.section>
      </motion.div>
    </Layout>
  );
};

export default About;
