
import React from 'react';
import { Share2, Copy, Facebook, Twitter } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const SharePost: React.FC = () => {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied",
      description: "Link has been copied to your clipboard",
    });
  };

  const handleShareToTwitter = () => {
    const text = encodeURIComponent(`Check out this article`);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
  };

  const handleShareToFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
  };

  return (
    <div className="ml-auto">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
            <Share2 size={18} />
            <span className="text-sm font-medium">Share</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 p-2">
          <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer">
            <Copy size={16} className="mr-2" />
            <span>Copy link</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleShareToTwitter} className="cursor-pointer">
            <Twitter size={16} className="mr-2" />
            <span>Share on X</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleShareToFacebook} className="cursor-pointer">
            <Facebook size={16} className="mr-2" />
            <span>Share on Facebook</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default SharePost;
