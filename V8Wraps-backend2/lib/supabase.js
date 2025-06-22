const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL || "https://opyukazefshtskwwwxvz.supabase.co";
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9weXVrYXplZnNodHNrd3d3eHZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4Mjk3NzgsImV4cCI6MjA2NTQwNTc3OH0.yK-3LKHP1Uv7vXwnN2qLuWPb6AskfwxovcTI8UoCkC8";

const supabase = createClient(supabaseUrl, supabaseAnonKey);
// console.log(supabase)

module.exports = { supabase };