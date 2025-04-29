export interface Template {
  id: number;
  filename: string;
  content_type: string;
  file_path: string;
  is_template: boolean;
  created_at: string;
  updated_at?: string;
  user_id: number;
  variables?: string[] | Record<string, string>;
} 