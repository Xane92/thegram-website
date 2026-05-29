import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://adgtzwtooucuzoftkbwd.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFkZ3R6d3Rvb3VjdXpvZnRrYndkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAwMDY4MjYsImV4cCI6MjA5NTU4MjgyNn0.wk919QghQWa4-SfmtMvYjzwoTd-hdD8CrNnZHlq1vQg"
);

export type Story = {
  id: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  author: string;
  cover_image_url: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type SiteEvent = {
  id: string;
  name: string;
  date: string;
  location: string;
  description: string;
  cover_image_url: string | null;
  ticket_link: string;
  published: boolean;
  created_at: string;
  updated_at: string;
};
