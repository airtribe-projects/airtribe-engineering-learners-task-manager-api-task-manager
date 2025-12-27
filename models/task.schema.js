const { z } = require("zod");

const TaskSchema = z.object({
  creationDate: z.iso.datetime().optional(),
  title: z.string().min(1),
  description: z.string().min(1),
  completed: z.boolean().default(false),
  priority: z.enum(["low", "medium", "high"]).default("low"),
});

module.exports = TaskSchema;
