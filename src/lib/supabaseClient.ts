import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://mdixwlzweijevgjmcsmt.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kaXh3bHp3ZWlqZXZnam1jc210Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTIwMzQyNDcsImV4cCI6MjAwNzYxMDI0N30.a8SWatAgGUn8MDCSVcjEdNhlEJum177aIVQnxVZaY8w"
);
