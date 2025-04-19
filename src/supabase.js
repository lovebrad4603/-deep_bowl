import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://clgveukrxvhqakhyjtmh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNsZ3ZldWtyeHZocWFraHlqdG1oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwNzMzODksImV4cCI6MjA2MDY0OTM4OX0.kcFSF7qOE2ADI2JA369kXrqU0EBuR7nn72xAd7gvOkk';
export const supabase = createClient(supabaseUrl, supabaseKey);