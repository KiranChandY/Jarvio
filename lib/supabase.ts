import 'react-native-url-polyfill/auto';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mthfyruozrgrncmfyegq.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10aGZ5cnVvenJncm5jbWZ5ZWdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYyMDA2MDEsImV4cCI6MjA5MTc3NjYwMX0.833-6EFXEWPgd0GP1kayT_42CGt-S3GUgT2K82Hzz3Y';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
