import { Submission } from './types';
import * as fs from 'fs';
import * as path from 'path';

const STORAGE_FILE = path.join(__dirname, '../data/submissions.json');

class Storage {
  private submissions: Submission[] = [];

  constructor() {
    this.loadFromFile();
  }

  private loadFromFile() {
    try {
      if (fs.existsSync(STORAGE_FILE)) {
        const data = fs.readFileSync(STORAGE_FILE, 'utf-8');
        this.submissions = JSON.parse(data);
      }
    } catch (error) {
      console.error('Error loading submissions:', error);
      this.submissions = [];
    }
  }

  private saveToFile() {
    try {
      const dir = path.dirname(STORAGE_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(STORAGE_FILE, JSON.stringify(this.submissions, null, 2));
    } catch (error) {
      console.error('Error saving submissions:', error);
    }
  }

  addSubmission(data: Record<string, any>): Submission {
    const submission: Submission = {
      id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      data
    };

    this.submissions.push(submission);
    this.saveToFile();
    return submission;
  }

  getSubmissions(
    page: number = 1,
    limit: number = 10,
    sortBy: string = 'createdAt',
    sortOrder: 'asc' | 'desc' = 'desc',
    search: string = ''
  ) {
    // Filter submissions based on search
    let filtered = [...this.submissions];
    
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(submission => {
        // Search in submission data
        const dataString = JSON.stringify(submission.data).toLowerCase();
        return dataString.includes(searchLower) || 
               submission.id.toLowerCase().includes(searchLower);
      });
    }

    // Sort submissions
    const sorted = filtered.sort((a, b) => {
      const aValue = a.createdAt;
      const bValue = b.createdAt;
      
      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

    // Paginate
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = sorted.slice(startIndex, endIndex);

    return {
      data: paginatedData,
      pagination: {
        page,
        limit,
        totalPages: Math.ceil(sorted.length / limit),
        totalCount: sorted.length
      }
    };
  }

  updateSubmission(id: string, data: Record<string, any>): Submission | null {
    const index = this.submissions.findIndex(sub => sub.id === id);
    
    if (index === -1) {
      return null;
    }

    this.submissions[index] = {
      ...this.submissions[index],
      data
    };

    this.saveToFile();
    return this.submissions[index];
  }

  deleteSubmission(id: string): boolean {
    const index = this.submissions.findIndex(sub => sub.id === id);
    
    if (index === -1) {
      return false;
    }

    this.submissions.splice(index, 1);
    this.saveToFile();
    return true;
  }
}

export const storage = new Storage();
