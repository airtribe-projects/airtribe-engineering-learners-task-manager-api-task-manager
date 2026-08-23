const API_URL = 'http://localhost:3000/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  // Authentication & Profile
  async login(email, password) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    return data.data;
  },

  async register(email, password, name) {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    return data.data;
  },

  async getProfile() {
    const res = await fetch(`${API_URL}/users/profile`, { headers: getHeaders() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to retrieve profile');
    return data.data;
  },

  async updateProfile(profileData) {
    const res = await fetch(`${API_URL}/users/profile`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(profileData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update profile');
    return data.data;
  },

  // Teams
  async createTeam(name, description) {
    const res = await fetch(`${API_URL}/teams`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ name, description })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create team');
    return data.data;
  },

  async listTeams() {
    const res = await fetch(`${API_URL}/teams`, { headers: getHeaders() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to list teams');
    return data.data;
  },

  async getTeamDetails(teamId) {
    const res = await fetch(`${API_URL}/teams/${teamId}`, { headers: getHeaders() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to load team details');
    return data.data;
  },

  async addTeamMember(teamId, email) {
    const res = await fetch(`${API_URL}/teams/${teamId}/members`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to add member to team');
    return data.data;
  },

  async removeTeamMember(teamId, userId) {
    const res = await fetch(`${API_URL}/teams/${teamId}/members/${userId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to remove member');
    return data;
  },

  // Tasks
  async createTask(taskData) {
    const res = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(taskData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create task');
    return data.data;
  },

  async listTasks(filters = {}) {
    const query = new URLSearchParams();
    Object.entries(filters).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    const res = await fetch(`${API_URL}/tasks?${query.toString()}`, { headers: getHeaders() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to fetch tasks');
    return data.data;
  },

  async getTaskDetails(taskId) {
    const res = await fetch(`${API_URL}/tasks/${taskId}`, { headers: getHeaders() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to load task details');
    return data.data;
  },

  async updateTask(taskId, updateData) {
    const res = await fetch(`${API_URL}/tasks/${taskId}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updateData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update task');
    return data.data;
  },

  async deleteTask(taskId) {
    const res = await fetch(`${API_URL}/tasks/${taskId}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to delete task');
    return data;
  },

  async completeTask(taskId) {
    const res = await fetch(`${API_URL}/tasks/${taskId}/complete`, {
      method: 'PATCH',
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to complete task');
    return data.data;
  },

  async assignTask(taskId, assigneeId) {
    const res = await fetch(`${API_URL}/tasks/${taskId}/assign`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ assigneeId })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to assign task');
    return data.data;
  },

  // Comments
  async addComment(taskId, content) {
    const res = await fetch(`${API_URL}/tasks/${taskId}/comments`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ content })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to add comment');
    return data.data;
  },

  // Attachments
  async uploadAttachment(taskId, file) {
    const token = localStorage.getItem('token');
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_URL}/tasks/${taskId}/attachments`, {
      method: 'POST',
      headers,
      body: formData
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Upload attachment failed');
    return data.data;
  },

  getDownloadUrl(attachmentId) {
    const token = localStorage.getItem('token');
    return `${API_URL}/attachments/${attachmentId}/download?token=${token}`; // Provide token as query param for secure file downloads via standard links
  },

  // Generative AI Services
  async generateAiDescription(title, briefInput) {
    const res = await fetch(`${API_URL}/ai/generate-description`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ title, briefInput })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'AI description generation failed');
    return data.data;
  },

  async getAiTaskSummary(taskId) {
    const res = await fetch(`${API_URL}/ai/tasks/${taskId}/summarize`, {
      method: 'POST',
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'AI task summary failed');
    return data.data;
  }
};
