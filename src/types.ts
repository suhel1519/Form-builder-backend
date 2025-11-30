export interface ValidationRule {
  minLength?: number;
  maxLength?: number;
  regex?: string;
  min?: number;
  max?: number;
  minDate?: string;
  minSelected?: number;
  maxSelected?: number;
}

export interface FormField {
  id: string;
  type: 'text' | 'number' | 'select' | 'multi-select' | 'date' | 'textarea' | 'switch' | 'checkbox';
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[];
  validation?: ValidationRule;
}

export interface FormSchema {
  title: string;
  description: string;
  fields: FormField[];
}

export interface Submission {
  id: string;
  createdAt: string;
  data: Record<string, any>;
}

export interface PaginatedResponse {
  success: boolean;
  data: Submission[];
  pagination: {
    page: number;
    limit: number;
    totalPages: number;
    totalCount: number;
  };
}

export interface SubmissionResponse {
  success: boolean;
  id?: string;
  createdAt?: string;
  errors?: Record<string, string>;
}
