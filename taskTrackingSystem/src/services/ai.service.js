const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = process.env.GEMINI_API_KEY;
let genAI = null;

if (apiKey && apiKey.trim() !== '') {
  try {
    genAI = new GoogleGenerativeAI(apiKey);
    console.log('Gemini AI client successfully initialized.');
  } catch (err) {
    console.error('Failed to initialize GoogleGenerativeAI client:', err.message);
  }
} else {
  console.log('GEMINI_API_KEY is not defined. Using offline mock templates for AI functionalities.');
}

/**
 * Generates a detailed task description based on a title and brief user input.
 * @param {string} title 
 * @param {string} briefInput 
 * @returns {Promise<string>}
 */
const generateDescription = async (title, briefInput) => {
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `You are a professional project manager. Write a detailed, structured, markdown task description for a task titled "${title}". Use the following brief notes/requirements: "${briefInput || 'No extra notes provided.'}". Include sections for: Objective, Scope of Work, and Deliverables. Keep it clean and ready for a task tracking application.`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (err) {
      console.warn('Gemini API error, falling back to mock description:', err.message);
    }
  }

  // Mock Fallback
  return `### Objective
Successfully execute and deliver the task: **${title}**.

### Scope of Work
- Define requirements and dependencies related to: *${briefInput || 'Initial setup'}*.
- Design the technical solution or workflow.
- Implement necessary components and unit tests.
- Review and refine implementation with the team.

### Key Deliverables
- [ ] Fully functional implementation.
- [ ] Documentation and walkthrough of the changes.
- [ ] Testing and verification report.

*Note: This description was auto-generated using offline mock templates because a valid GEMINI_API_KEY was not supplied in the environment.*`;
};

/**
 * Summarizes a task, its attributes, and its comment history.
 * @param {object} task 
 * @returns {Promise<string>}
 */
const summarizeTaskAndComments = async (task) => {
  const commentStr = task.comments && task.comments.length > 0
    ? task.comments.map(c => `- [${c.user?.name || 'Unknown User'}]: "${c.content}"`).join('\n')
    : 'No comments yet.';

  const taskContext = `
Task Title: ${task.title}
Task Description: ${task.description || 'No description provided.'}
Status: ${task.status}
Priority: ${task.priority}
Due Date: ${task.dueDate || 'No due date set'}
Assignee: ${task.assignee ? task.assignee.name : 'Unassigned'}
Comments:
${commentStr}
`;

  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `You are a project manager. Read the following task details and comments, and provide a brief, professional summary (around 100-150 words) outlining the current progress, key questions or blockers from comments, and the next steps needed to complete this task:\n${taskContext}`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (err) {
      console.warn('Gemini API error, falling back to mock summary:', err.message);
    }
  }

  // Mock Fallback
  const commentCount = task.comments ? task.comments.length : 0;
  return `### Task Summary: ${task.title}
- **Current Status**: The task is currently marked as **${task.status}** with **${task.priority}** priority.
- **Assignment**: It is assigned to **${task.assignee ? task.assignee.name : 'Unassigned'}**.
- **Activity**: There are currently **${commentCount}** comments discussing this task.
- **Next Steps**: Review open items and verify the task satisfies the specified deliverables before closing it.

*Note: This summary was auto-generated using offline mock templates because a valid GEMINI_API_KEY was not supplied in the environment.*`;
};

module.exports = {
  generateDescription,
  summarizeTaskAndComments
};
