import { FormField, ValidationRule } from './types';

export function validateField(
  field: FormField,
  value: any
): string | null {
  // Check required
  if (field.required) {
    if (value === undefined || value === null || value === '') {
      return `${field.label} is required`;
    }
    if (field.type === 'multi-select' && (!Array.isArray(value) || value.length === 0)) {
      return `${field.label} is required`;
    }
  }

  // If not required and empty, skip validation
  if (!field.required && (value === undefined || value === null || value === '')) {
    return null;
  }

  const validation = field.validation;
  if (!validation) return null;

  // Text validations
  if (field.type === 'text' || field.type === 'textarea') {
    const strValue = String(value);
    
    if (validation.minLength && strValue.length < validation.minLength) {
      return `${field.label} must be at least ${validation.minLength} characters`;
    }
    
    if (validation.maxLength && strValue.length > validation.maxLength) {
      return `${field.label} must not exceed ${validation.maxLength} characters`;
    }
    
    if (validation.regex) {
      const regex = new RegExp(validation.regex);
      if (!regex.test(strValue)) {
        return `${field.label} format is invalid`;
      }
    }
  }

  // Number validations
  if (field.type === 'number') {
    const numValue = Number(value);
    
    if (isNaN(numValue)) {
      return `${field.label} must be a valid number`;
    }
    
    if (validation.min !== undefined && numValue < validation.min) {
      return `${field.label} must be at least ${validation.min}`;
    }
    
    if (validation.max !== undefined && numValue > validation.max) {
      return `${field.label} must not exceed ${validation.max}`;
    }
  }

  // Date validations
  if (field.type === 'date') {
    const dateValue = new Date(value);
    
    if (isNaN(dateValue.getTime())) {
      return `${field.label} must be a valid date`;
    }
    
    if (validation.minDate) {
      const minDate = new Date(validation.minDate);
      if (dateValue < minDate) {
        return `${field.label} must be on or after ${validation.minDate}`;
      }
    }
  }

  // Multi-select validations
  if (field.type === 'multi-select') {
    if (!Array.isArray(value)) {
      return `${field.label} must be an array`;
    }
    
    if (validation.minSelected && value.length < validation.minSelected) {
      return `${field.label} must have at least ${validation.minSelected} selection(s)`;
    }
    
    if (validation.maxSelected && value.length > validation.maxSelected) {
      return `${field.label} must not exceed ${validation.maxSelected} selection(s)`;
    }
  }

  return null;
}

export function validateSubmission(
  fields: FormField[],
  data: Record<string, any>
): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const field of fields) {
    const value = data[field.id];
    const error = validateField(field, value);
    
    if (error) {
      errors[field.id] = error;
    }
  }

  return errors;
}
