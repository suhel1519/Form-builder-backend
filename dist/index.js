"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const schema_1 = require("./schema");
const validation_1 = require("./validation");
const storage_1 = require("./storage");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// GET /api/form-schema
app.get("/api/form-schema", (req, res) => {
    res.json(schema_1.formSchema);
});
// POST /api/submissions
app.post("/api/submissions", (req, res) => {
    const data = req.body;
    // Validate submission
    const errors = (0, validation_1.validateSubmission)(schema_1.formSchema.fields, data);
    if (Object.keys(errors).length > 0) {
        return res.status(400).json({
            success: false,
            errors,
        });
    }
    // Store submission
    const submission = storage_1.storage.addSubmission(data);
    // sending res
    res.status(201).json({
        success: true,
        id: submission.id,
        createdAt: submission.createdAt,
    });
});
// GET /api/submissions
app.get("/api/submissions", (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? "asc" : "desc";
    const search = req.query.search || "";
    // Validate parameters
    if (page < 1 || limit < 1 || limit > 100) {
        return res.status(400).json({
            success: false,
            error: "Invalid pagination parameters",
        });
    }
    const result = storage_1.storage.getSubmissions(page, limit, sortBy, sortOrder, search);
    res.json({
        success: true,
        ...result,
    });
});
// PUT /api/submissions/:id
app.put("/api/submissions/:id", (req, res) => {
    const { id } = req.params;
    const data = req.body;
    // Validate submission
    const errors = (0, validation_1.validateSubmission)(schema_1.formSchema.fields, data);
    if (Object.keys(errors).length > 0) {
        return res.status(400).json({
            success: false,
            errors,
        });
    }
    // Update submission
    const updated = storage_1.storage.updateSubmission(id, data);
    if (!updated) {
        return res.status(404).json({
            success: false,
            error: "Submission not found",
        });
    }
    res.json({
        success: true,
        submission: updated,
    });
});
// DELETE /api/submissions/:id
app.delete("/api/submissions/:id", (req, res) => {
    const { id } = req.params;
    const deleted = storage_1.storage.deleteSubmission(id);
    if (!deleted) {
        return res.status(404).json({
            success: false,
            error: "Submission not found",
        });
    }
    res.json({
        success: true,
        message: "Submission deleted successfully",
    });
});
// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: "Internal server error",
    });
});
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
