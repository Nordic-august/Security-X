export interface Category {
  id: string;
  name: string;
  description: string;
  badge_label: string;
  sort_order: number;
}

export type SeverityLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export interface Vulnerability {
  id: string;
  title: string;
  category_id: string;
  severity: SeverityLevel;
  short_summary: string;
  detailed_description: string;
  practical_example: string;
  mitigation: string;
  cwe_id: string;
  owasp_reference: string;
  attack_vector: string;
  impact_scope: string;
  created_at: string;
  updated_at: string;
}

export type SuggestionStatus = 'pending' | 'approved' | 'rejected';

export interface Suggestion {
  id: string;
  term_title: string;
  category_id: string;
  severity: SeverityLevel;
  description: string;
  example: string;
  student_name: string;
  student_email: string;
  status: SuggestionStatus;
  admin_notes?: string;
  created_at: string;
}

export type ActiveTab = 'home' | 'suggestions' | 'admin';
