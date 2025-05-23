
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Star } from 'lucide-react';

interface Review {
  id: string;
  name: string;
  rating: number;
  content: string;
  created_at: string;
}

interface BookReviewsProps {
  bookId: string;
  refreshTrigger: number;
}

const BookReviews: React.FC<BookReviewsProps> = ({ bookId, refreshTrigger }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, [bookId, refreshTrigger]);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('book_reviews')
        .select('id, name, rating, content, created_at')
        .eq('book_id', bookId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error: any) {
      console.error('Error fetching reviews:', error);
      toast({
        title: "Error",
        description: "Failed to load reviews.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={rating >= star ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}
            fill={rating >= star ? 'currentColor' : 'none'}
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900 dark:border-white mx-auto"></div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">
        Reviews ({reviews.length})
      </h3>
      
      {reviews.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400 italic">
          No reviews yet. Be the first to review this book!
        </p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <span className="font-medium">{review.name}</span>
                  {renderStars(review.rating)}
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(review.created_at)}
                </span>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                {review.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookReviews;
