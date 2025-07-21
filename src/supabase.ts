
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cyjlffpvminkvtmxrbpg.supabase.co'; 
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5amxmZnB2bWlua3Z0bXhyYnBnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMwMDYyMzEsImV4cCI6MjA2ODU4MjIzMX0.cZlmP4MZx8GpVd21XrK8MPe1gC9Hh9gJ3ZvzOooqf-4'; 

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
