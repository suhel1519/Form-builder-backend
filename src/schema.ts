import { FormSchema } from './types';

export const formSchema: FormSchema = {
  title: 'Employee Onboarding Form',
  description: 'Please fill out this form to complete your onboarding process.',
  fields: [
    {
      id: 'fullName',
      type: 'text',
      label: 'Full Name',
      placeholder: 'Enter your full name',
      required: true,
      validation: {
        minLength: 2,
        maxLength: 100
      }
    },
    {
      id: 'email',
      type: 'text',
      label: 'Email Address',
      placeholder: 'your.email@company.com',
      required: true,
      validation: {
        regex: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$'
      }
    },
    {
      id: 'age',
      type: 'number',
      label: 'Age',
      placeholder: 'Enter your age',
      required: true,
      validation: {
        min: 18,
        max: 100
      }
    },
    {
      id: 'department',
      type: 'select',
      label: 'Department',
      placeholder: 'Select your department',
      required: true,
      options: ['Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations']
    },
    {
      id: 'skills',
      type: 'multi-select',
      label: 'Skills',
      placeholder: 'Select your skills',
      required: true,
      options: ['JavaScript', 'Python', 'Java', 'C++', 'React', 'Node.js', 'SQL', 'MongoDB'],
      validation: {
        minSelected: 1,
        maxSelected: 5
      }
    },
    {
      id: 'startDate',
      type: 'date',
      label: 'Start Date',
      placeholder: 'Select your start date',
      required: true,
      validation: {
        minDate: '2024-01-01'
      }
    },
    {
      id: 'bio',
      type: 'textarea',
      label: 'Bio',
      placeholder: 'Tell us about yourself',
      required: false,
      validation: {
        maxLength: 500
      }
    },
    {
      id: 'agreeToTerms',
      type: 'switch',
      label: 'I agree to the terms and conditions',
      required: true
    }
  ]
};
