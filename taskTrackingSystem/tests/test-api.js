const http = require('http');
const app = require('../src/app');
const mongoose = require('mongoose');
const User = require('../src/models/User');
const Team = require('../src/models/Team');
const TeamMember = require('../src/models/TeamMember');
const Task = require('../src/models/Task');
const Comment = require('../src/models/Comment');
const Attachment = require('../src/models/Attachment');

const PORT = 3999;
let server;

const assert = (condition, message) => {
  if (!condition) {
    throw new Error(`Assertion Failed: ${message}`);
  }
  console.log(`  ✅ ${message}`);
};

const runTests = async () => {
  console.log('--- Executing End-to-End Integration Tests ---');

  // Clean the local MongoDB test DB before running assertions
  console.log('Cleaning MongoDB database collections...');
  await Comment.deleteMany({});
  await Attachment.deleteMany({});
  await Task.deleteMany({});
  await TeamMember.deleteMany({});
  await Team.deleteMany({});
  await User.deleteMany({});

  const baseUrl = `http://localhost:${PORT}/api`;

  let tokenA = '';
  let tokenB = '';
  let userIdA = '';
  let userIdB = '';
  let teamId = '';
  let taskId = '';

  // 1. User Registration
  console.log('\nTesting Auth & User Profiles:');
  const regResA = await fetch(`${baseUrl}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'userA@test.com', password: 'password123', name: 'User A' })
  });
  const regDataA = await regResA.json();
  assert(regResA.status === 201, 'User A registered successfully');
  assert(regDataA.data.token, 'Token generated for User A');
  tokenA = regDataA.data.token;
  userIdA = regDataA.data.user.id;

  const regResB = await fetch(`${baseUrl}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'userB@test.com', password: 'password123', name: 'User B' })
  });
  const regDataB = await regResB.json();
  assert(regResB.status === 201, 'User B registered successfully');
  tokenB = regDataB.data.token;
  userIdB = regDataB.data.user.id;

  // 2. User Login
  const loginRes = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'userA@test.com', password: 'password123' })
  });
  const loginData = await loginRes.json();
  assert(loginRes.status === 200, 'User A logged in successfully');
  assert(loginData.data.token, 'Login token generated successfully');

  // 3. Profile management
  const profileRes = await fetch(`${baseUrl}/users/profile`, {
    headers: { 'Authorization': `Bearer ${tokenA}` }
  });
  const profileData = await profileRes.json();
  assert(profileRes.status === 200, 'Get user profile succeeded');
  assert(profileData.data.user.name === 'User A', 'Profile name matches');

  const updateRes = await fetch(`${baseUrl}/users/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tokenA}`
    },
    body: JSON.stringify({ name: 'User A Updated' })
  });
  const updateData = await updateRes.json();
  assert(updateRes.status === 200, 'Update profile succeeded');
  assert(updateData.data.user.name === 'User A Updated', 'Updated profile name matches');

  // 4. Team Creation & Collaboration
  console.log('\nTesting Teams & Collaborator Invitations:');
  const teamRes = await fetch(`${baseUrl}/teams`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tokenA}`
    },
    body: JSON.stringify({ name: 'Product Engineering', description: 'Main core engineering team' })
  });
  const teamData = await teamRes.json();
  assert(teamRes.status === 201, 'Team created successfully');
  teamId = teamData.data.team.id;

  const inviteRes = await fetch(`${baseUrl}/teams/${teamId}/members`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tokenA}`
    },
    body: JSON.stringify({ email: 'userB@test.com' })
  });
  const inviteData = await inviteRes.json();
  assert(inviteRes.status === 201, 'User B invited to team successfully');
  assert(inviteData.data.member.userId === userIdB, 'Invited user ID matches User B');

  // 5. Tasks Creation, Querying, Searching, and Assignment
  console.log('\nTesting Task CRUD, Filtering, Searching, & Assignment:');
  const taskRes = await fetch(`${baseUrl}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tokenA}`
    },
    body: JSON.stringify({
      title: 'Build API endpoints',
      description: 'Implement router and controller scripts',
      priority: 'HIGH',
      teamId: teamId,
      assigneeId: userIdB
    })
  });
  const taskData = await taskRes.json();
  assert(taskRes.status === 201, 'Task created successfully');
  taskId = taskData.data.task.id;
  assert(taskData.data.task.assigneeId === userIdB, 'Task assigned to User B');

  // Test lists & filters
  const listRes = await fetch(`${baseUrl}/tasks?status=OPEN`, {
    headers: { 'Authorization': `Bearer ${tokenB}` }
  });
  const listData = await listRes.json();
  assert(listRes.status === 200, 'List open tasks succeeded');
  assert(listData.results === 1, 'Task list filters tasks by status correctly');

  // Search tasks
  const searchRes = await fetch(`${baseUrl}/tasks?search=endpoints`, {
    headers: { 'Authorization': `Bearer ${tokenA}` }
  });
  const searchData = await searchRes.json();
  assert(searchRes.status === 200, 'Search tasks succeeded');
  assert(searchData.results === 1, 'Search query successfully filtered by keyword');

  // 6. Comments
  console.log('\nTesting Task Comments:');
  const commentRes = await fetch(`${baseUrl}/tasks/${taskId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tokenB}`
    },
    body: JSON.stringify({ content: 'Done implementing the registration validations.' })
  });
  const commentData = await commentRes.json();
  assert(commentRes.status === 201, 'Add comment succeeded');
  assert(commentData.data.comment.content === 'Done implementing the registration validations.', 'Comment content matches');

  // 7. Attachments Upload & Download
  console.log('\nTesting Task Attachments (Multipart Upload & Stream Download):');
  const formData = new FormData();
  const fileBlob = new Blob(['sample database dump content'], { type: 'text/plain' });
  formData.append('file', fileBlob, 'db-dump.txt');

  const uploadRes = await fetch(`${baseUrl}/tasks/${taskId}/attachments`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${tokenB}`
    },
    body: formData
  });
  const uploadData = await uploadRes.json();
  assert(uploadRes.status === 201, 'File upload succeeded');
  const attachmentId = uploadData.data.attachment.id;

  const downloadRes = await fetch(`${baseUrl}/attachments/${attachmentId}/download`, {
    headers: { 'Authorization': `Bearer ${tokenA}` }
  });
  assert(downloadRes.status === 200, 'File download request succeeded');
  const fileContent = await downloadRes.text();
  assert(fileContent === 'sample database dump content', 'Downloaded file content matches uploaded contents');

  // 8. Task Status Complete
  console.log('\nTesting Task Completion:');
  const completeRes = await fetch(`${baseUrl}/tasks/${taskId}/complete`, {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${tokenB}` }
  });
  const completeData = await completeRes.json();
  assert(completeRes.status === 200, 'Complete task patch succeeded');
  assert(completeData.data.task.status === 'COMPLETED', 'Task status changed to COMPLETED');

  // 9. AI Integration
  console.log('\nTesting AI Text Generation & Summarization:');
  const aiDescRes = await fetch(`${baseUrl}/ai/generate-description`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tokenA}`
    },
    body: JSON.stringify({ title: 'Winston Logging Setup', briefInput: 'Use logger transports and daily files' })
  });
  assert(aiDescRes.status === 200, 'AI description generator returned status 200');
  const aiDescData = await aiDescRes.json();
  assert(aiDescData.data.description.length > 0, 'Generated description is non-empty');

  const aiSumRes = await fetch(`${baseUrl}/ai/tasks/${taskId}/summarize`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${tokenA}` }
  });
  assert(aiSumRes.status === 200, 'AI task summarizer returned status 200');
  const aiSumData = await aiSumRes.json();
  assert(aiSumData.data.summary.length > 0, 'Generated task summary is non-empty');

  console.log('\n======================================================');
  console.log('🎉 Integration tests: ALL ENDPOINTS FUNCTIONING PERFECTLY');
  console.log('======================================================\n');
};

const main = async () => {
  const url = process.env.DATABASE_URL || 'mongodb://localhost:27017/taskTrackerDb';
  console.log(`Test suite connecting to MongoDB at: ${url}`);
  await mongoose.connect(url);

  server = http.createServer(app);
  server.listen(PORT, async () => {
    try {
      await runTests();
      process.exit(0);
    } catch (error) {
      console.error('❌ Integration Tests Failed:', error);
      process.exit(1);
    } finally {
      await mongoose.disconnect();
      server.close();
    }
  });
};

main();
