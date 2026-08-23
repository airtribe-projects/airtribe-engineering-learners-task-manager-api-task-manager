const { z } = require('zod');

// Flexibly parse and coerce strings to Date objects if valid, or leave as null/undefined
const dateSchema = z.preprocess((arg) => {
  if (typeof arg === 'string' && arg.trim() !== '') {
    const parsed = Date.parse(arg);
    if (!isNaN(parsed)) {
      return new Date(arg);
    }
  }
  return arg === '' ? null : arg;
}, z.date({ invalid_type_error: 'Invalid date format' }).optional().nullable());

// Flexibly handle ID matching (supports standard MongoDB ObjectIds)
const objectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId format');

const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    name: z.string().min(1, 'Name is required')
  })
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required')
  })
});

const updateProfileSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address').optional(),
    name: z.string().min(1, 'Name cannot be empty').optional(),
    password: z.string().min(6, 'Password must be at least 6 characters long').optional()
  })
});

const createTeamSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Team name is required'),
    description: z.string().optional()
  })
});

const addTeamMemberSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    role: z.enum(['ADMIN', 'MEMBER']).optional()
  })
});

const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Task title is required'),
    description: z.string().optional(),
    status: z.enum(['OPEN', 'IN_PROGRESS', 'COMPLETED']).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
    dueDate: dateSchema,
    assigneeId: objectIdSchema.optional().nullable(),
    teamId: objectIdSchema.optional().nullable()
  })
});

const updateTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Task title cannot be empty').optional(),
    description: z.string().optional().nullable(),
    status: z.enum(['OPEN', 'IN_PROGRESS', 'COMPLETED']).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
    dueDate: dateSchema,
    assigneeId: z.preprocess((val) => val === '' ? null : val, objectIdSchema.optional().nullable()),
    teamId: z.preprocess((val) => val === '' ? null : val, objectIdSchema.optional().nullable())
  })
});

const addCommentSchema = z.object({
  body: z.object({
    content: z.string().min(1, 'Comment content is required')
  })
});

const generateAiDescriptionSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Task title is required'),
    briefInput: z.string().optional()
  })
});

module.exports = {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  createTeamSchema,
  addTeamMemberSchema,
  createTaskSchema,
  updateTaskSchema,
  addCommentSchema,
  generateAiDescriptionSchema
};
