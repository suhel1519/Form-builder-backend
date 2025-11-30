import express, { Request, Response } from "express";
import cors from "cors";
import { formSchema } from "./schema";
import { validateSubmission } from "./validation";
import { storage } from "./storage";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// GET /api/form-schema
app.get("/api/form-schema", (req: Request, res: Response) => {
  res.json(formSchema);
});

// POST /api/submissions
app.post("/api/submissions", (req: Request, res: Response) => {
  const data = req.body;

  // Validate submission
  const errors = validateSubmission(formSchema.fields, data);

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      errors,
    });
  }

  // Store submission
  const submission = storage.addSubmission(data);

  // sending res
  res.status(201).json({
    success: true,
    id: submission.id,
    createdAt: submission.createdAt,
  });
});

// GET /api/submissions
app.get("/api/submissions", (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const sortBy = (req.query.sortBy as string) || "createdAt";
  const sortOrder = (req.query.sortOrder as string) === "asc" ? "asc" : "desc";
  const search = (req.query.search as string) || "";

  // Validate parameters
  if (page < 1 || limit < 1 || limit > 100) {
    return res.status(400).json({
      success: false,
      error: "Invalid pagination parameters",
    });
  }

  const result = storage.getSubmissions(page, limit, sortBy, sortOrder, search);

  res.json({
    success: true,
    ...result,
  });
});

// PUT /api/submissions/:id
app.put("/api/submissions/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;

  // Validate submission
  const errors = validateSubmission(formSchema.fields, data);

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      errors,
    });
  }

  // Update submission
  const updated = storage.updateSubmission(id, data);

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
app.delete("/api/submissions/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  const deleted = storage.deleteSubmission(id);

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
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: "Internal server error",
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
