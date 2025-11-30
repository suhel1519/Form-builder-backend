"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const STORAGE_FILE = path.join(__dirname, '../data/submissions.json');
class Storage {
    constructor() {
        this.submissions = [];
        this.loadFromFile();
    }
    loadFromFile() {
        try {
            if (fs.existsSync(STORAGE_FILE)) {
                const data = fs.readFileSync(STORAGE_FILE, 'utf-8');
                this.submissions = JSON.parse(data);
            }
        }
        catch (error) {
            console.error('Error loading submissions:', error);
            this.submissions = [];
        }
    }
    saveToFile() {
        try {
            const dir = path.dirname(STORAGE_FILE);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            fs.writeFileSync(STORAGE_FILE, JSON.stringify(this.submissions, null, 2));
        }
        catch (error) {
            console.error('Error saving submissions:', error);
        }
    }
    addSubmission(data) {
        const submission = {
            id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            createdAt: new Date().toISOString(),
            data
        };
        this.submissions.push(submission);
        this.saveToFile();
        return submission;
    }
    getSubmissions(page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', search = '') {
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
            }
            else {
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
    updateSubmission(id, data) {
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
    deleteSubmission(id) {
        const index = this.submissions.findIndex(sub => sub.id === id);
        if (index === -1) {
            return false;
        }
        this.submissions.splice(index, 1);
        this.saveToFile();
        return true;
    }
}
exports.storage = new Storage();
