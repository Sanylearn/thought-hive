
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://lafurncfvyrszfsfhkkf.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhZnVybmNmdnlyc3pmc2Zoa2tmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA5OTkwMjAsImV4cCI6MjA1NjU3NTAyMH0.VynVB7rt-QYbbLTH2k-0G64PWyPfgpFmf43gjCUA1ug";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
