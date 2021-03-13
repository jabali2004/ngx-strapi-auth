export interface Role {
  id: string;
  name: string;
  description?: string;
  type?: string;
  permissions?: string[];
  users?: string[];
  updated_by?: any;
  created_by?: any;
}
