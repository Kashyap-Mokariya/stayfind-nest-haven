
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bwusbjpwqrfbvvdzsegv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ3dXNianB3cXJmYnZ2ZHpzZWd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwODYyNzgsImV4cCI6MjA2NTY2MjI3OH0.GkurKH_AgvS_ILPWI1v_tKe-Q335Cq2-FyeJtoHmcZk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});
