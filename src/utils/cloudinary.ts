
import { supabase } from '@/integrations/supabase/client';

// Initialize Cloudinary with edge function
export const uploadToCloudinary = async (
  file: File,
  folder: string = 'opinion_matters'
): Promise<string | null> => {
  try {
    // Create a form data object
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    // Call Supabase Edge Function to upload the file
    const { data, error } = await supabase.functions.invoke('upload-to-cloudinary', {
      body: formData,
    });

    if (error) {
      console.error('Error uploading file:', error);
      return null;
    }

    return data.secure_url;
  } catch (error) {
    console.error('Upload error:', error);
    return null;
  }
};
