const z = require("zod");

const TaskDTO = z.object({
  title: z.string().trim(),
  description: z.string().trim(),
  completed: z.boolean().default(false),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  createdAt: z.date().default(() => new Date()),
});

const PriorityDTO = z.enum(["low", "medium", "high"]);

module.exports = {
  TaskDTO,
  PriorityDTO
};
