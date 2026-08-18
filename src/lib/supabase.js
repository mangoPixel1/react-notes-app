import { createClient } from "@supabase/supabase-js";
import { authStorage } from "./authStorage";

const supabaseUrl = "https://eyjrjmzivkgrjcaxpurw.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5anJqbXppdmtncmpjYXhwdXJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5MTM5MTAsImV4cCI6MjA4NDQ4OTkxMH0.Blw60OxtK00XyurIHZZZ87jyhLSvzvfAKVQsG6VvUwk";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { storage: authStorage },
});
