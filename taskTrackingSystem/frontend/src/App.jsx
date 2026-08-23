import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { api } from './api';
import './App.css';

// SVG Icons for clean, package-free layout
const IconPlus = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>;
const IconSearch = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.602 10.602z" /></svg>;
const IconCalendar = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>;
const IconUser = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>;
const IconUsers = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>;
const IconComment = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025 10.354 10.354 0 01-1.665-2.3C3.347 15.644 3 13.88 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" /></svg>;
const IconAttach = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" /></svg>;
const IconAI = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 21L8.188 15.904a7.502 7.502 0 01-5.908-5.907L1 9.187l5.092-.813a7.502 7.502 0 015.908-5.907L13 1.5l.813 5.092a7.502 7.502 0 015.907 5.908l5.093.812l-5.093.813a7.502 7.502 0 01-5.907 5.907z" /></svg>;
const IconEdit = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>;
const IconTrash = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>;

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  
  // Auth form
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authError, setAuthError] = useState('');

  // App Tabs
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'teams' | 'profile'

  // Tasks States
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterTeam, setFilterTeam] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // Teams States
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);

  // Modals
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);

  // Creation forms
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('MEDIUM');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskTeam, setNewTaskTeam] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('');

  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDesc, setNewTeamDesc] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');

  // Profile Update Form
  const [profName, setProfName] = useState('');
  const [profEmail, setProfEmail] = useState('');
  const [profPassword, setProfPassword] = useState('');
  const [profStatus, setProfStatus] = useState('');

  // Comments & Uploads Form
  const [newComment, setNewComment] = useState('');
  const fileInputRef = useRef(null);

  // AI Assistance Form
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);
  const [taskSummary, setTaskSummary] = useState('');

  // Real-time Notifications (Toasts)
  const [toasts, setToasts] = useState([]);
  const socketRef = useRef(null);

  // Auto-connect socket and load data
  useEffect(() => {
    if (token) {
      loadProfile();
      loadTasks();
      loadTeams();
      connectSocket();
    } else {
      disconnectSocket();
    }
  }, [token]);

  // Load profile details
  const loadProfile = async () => {
    try {
      const data = await api.getProfile();
      setUser(data.user);
      setProfName(data.user.name);
      setProfEmail(data.user.email);
    } catch (err) {
      handleLogout();
    }
  };

  // Connect Socket.io Client
  const connectSocket = () => {
    if (socketRef.current) return;
    
    // Connect to WebSocket server passing JWT query
    const socket = io('http://localhost:3000', {
      query: { token }
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Socket.io connected successfully.');
    });

    // Event hooks
    socket.on('taskAssigned', (data) => {
      addToast(data.message);
      refreshCurrentState();
    });

    socket.on('taskCreated', (data) => {
      addToast(data.message);
      refreshCurrentState();
    });

    socket.on('taskUpdated', (data) => {
      addToast(data.message);
      refreshCurrentState();
    });

    socket.on('taskCompleted', (data) => {
      addToast(data.message);
      refreshCurrentState();
    });

    socket.on('commentAdded', (data) => {
      addToast(data.message);
      refreshCurrentState();
    });

    socket.on('taskDeleted', (data) => {
      addToast(`Task "${data.title}" was deleted.`);
      if (selectedTask?.id === data.taskId) {
        setSelectedTask(null);
      }
      loadTasks();
    });
  };

  const disconnectSocket = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  };

  const addToast = (message) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  };

  const refreshCurrentState = () => {
    loadTasks();
    if (selectedTask) {
      loadTaskDetails(selectedTask.id);
    }
  };

  // Load Tasks with filters
  const loadTasks = async () => {
    try {
      const data = await api.listTasks({
        status: filterStatus,
        priority: filterPriority,
        teamId: filterTeam,
        search: searchQuery,
        sortBy,
        sortOrder
      });
      setTasks(data.tasks);
    } catch (err) {
      console.error('Failed to load tasks', err);
    }
  };

  // Load Teams
  const loadTeams = async () => {
    try {
      const data = await api.listTeams();
      setTeams(data.teams);
    } catch (err) {
      console.error('Failed to load teams', err);
    }
  };

  // Reload tasks when filter changes
  useEffect(() => {
    if (token) {
      loadTasks();
    }
  }, [filterStatus, filterPriority, filterTeam, searchQuery, sortBy, sortOrder]);

  // Auth Actions
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      if (authMode === 'login') {
        const data = await api.login(authEmail, authPassword);
        localStorage.setItem('token', data.token);
        setToken(data.token);
      } else {
        const data = await api.register(authEmail, authPassword, authName);
        localStorage.setItem('token', data.token);
        setToken(data.token);
      }
      setAuthEmail('');
      setAuthPassword('');
      setAuthName('');
    } catch (err) {
      setAuthError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
    setTasks([]);
    setTeams([]);
    setSelectedTask(null);
    setSelectedTeam(null);
    disconnectSocket();
  };

  // Profile Update Action
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfStatus('');
    try {
      const updateData = { name: profName, email: profEmail };
      if (profPassword) updateData.password = profPassword;
      await api.updateProfile(updateData);
      setProfStatus('Profile updated successfully!');
      setProfPassword('');
      loadProfile();
    } catch (err) {
      setProfStatus(`Error: ${err.message}`);
    }
  };

  // Create Task Action
  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const taskData = {
        title: newTaskTitle,
        description: newTaskDesc,
        priority: newTaskPriority,
        teamId: newTaskTeam || null,
        assigneeId: newTaskAssignee || null,
        dueDate: newTaskDueDate || null
      };
      await api.createTask(taskData);
      setNewTaskTitle('');
      setNewTaskDesc('');
      setNewTaskDueDate('');
      setNewTaskTeam('');
      setNewTaskAssignee('');
      setShowTaskModal(false);
      loadTasks();
      addToast(`Task "${taskData.title}" created successfully`);
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  // Create Team Action
  const handleCreateTeam = async (e) => {
    e.preventDefault();
    try {
      await api.createTeam(newTeamName, newTeamDesc);
      setNewTeamName('');
      setNewTeamDesc('');
      setShowTeamModal(false);
      loadTeams();
      addToast(`Team "${newTeamName}" created`);
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  // Add Member Action
  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await api.addTeamMember(selectedTeam.id, newMemberEmail);
      setNewMemberEmail('');
      setShowMemberModal(false);
      // Reload team details
      const updatedDetails = await api.getTeamDetails(selectedTeam.id);
      setSelectedTeam(updatedDetails.team);
      addToast('Team member added successfully');
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  // Remove Member Action
  const handleRemoveMember = async (memberUserId) => {
    if (!confirm('Are you sure you want to remove this member?')) return;
    try {
      await api.removeTeamMember(selectedTeam.id, memberUserId);
      const updatedDetails = await api.getTeamDetails(selectedTeam.id);
      setSelectedTeam(updatedDetails.team);
      addToast('Member removed from team');
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  // Load single task detail
  const loadTaskDetails = async (taskId) => {
    try {
      const data = await api.getTaskDetails(taskId);
      setSelectedTask(data.task);
      setTaskSummary(''); // reset summary card
    } catch (err) {
      alert('Failed to load task details');
    }
  };

  // Task inline interactions
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.updateTask(taskId, { status: newStatus });
      refreshCurrentState();
    } catch (err) {
      alert(`Failed to update task status: ${err.message}`);
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      await api.completeTask(taskId);
      refreshCurrentState();
    } catch (err) {
      alert(`Failed to complete task: ${err.message}`);
    }
  };

  const handleTaskDelete = async (taskId) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.deleteTask(taskId);
      setSelectedTask(null);
      loadTasks();
    } catch (err) {
      alert(`Failed to delete task: ${err.message}`);
    }
  };

  // Comments Submit
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      await api.addComment(selectedTask.id, newComment);
      setNewComment('');
      loadTaskDetails(selectedTask.id);
    } catch (err) {
      alert(`Failed to comment: ${err.message}`);
    }
  };

  // Attachment Upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      await api.uploadAttachment(selectedTask.id, file);
      loadTaskDetails(selectedTask.id);
      addToast('File uploaded successfully');
    } catch (err) {
      alert(`Upload failed: ${err.message}`);
    }
  };

  // AI Description Draft
  const handleGenerateDescription = async () => {
    if (!newTaskTitle) {
      alert('Please enter a task title first.');
      return;
    }
    setAiGenerating(true);
    try {
      const data = await api.generateAiDescription(newTaskTitle, aiPrompt);
      setNewTaskDesc(data.description);
      setAiPrompt('');
      addToast('AI Description drafted successfully');
    } catch (err) {
      alert(`AI error: ${err.message}`);
    } finally {
      setAiGenerating(false);
    }
  };

  // AI Summary Generation
  const handleGetSummary = async () => {
    setAiGenerating(true);
    try {
      const data = await api.getAiTaskSummary(selectedTask.id);
      setTaskSummary(data.summary);
      addToast('AI Summary loaded');
    } catch (err) {
      alert(`AI error: ${err.message}`);
    } finally {
      setAiGenerating(false);
    }
  };

  // Fetch Team detail for view
  const handleTeamClick = async (teamId) => {
    try {
      const data = await api.getTeamDetails(teamId);
      setSelectedTeam(data.team);
    } catch (err) {
      alert(`Failed to load team details: ${err.message}`);
    }
  };

  // Auth Screen Render
  if (!token) {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-header">
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div className="logo-icon">T</div>
            </div>
            <h1>TaskSphere Backend</h1>
            <p>Collaborative project coordination platform</p>
          </div>
          <form onSubmit={handleAuthSubmit}>
            {authError && <div style={{ color: 'var(--danger)', marginBottom: '15px', fontSize: '13px', textAlign: 'center' }}>{authError}</div>}
            
            {authMode === 'register' && (
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  required
                  placeholder="John Doe"
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                />
              </div>
            )}

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                className="form-input"
                required
                placeholder="you@example.com"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                className="form-input"
                required
                placeholder="Min 6 characters"
                value={authPassword}
                onChange={(e) => setAuthPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }}>
              {authMode === 'login' ? 'Secure Log In' : 'Create Account'}
            </button>
          </form>

          <div className="auth-footer">
            {authMode === 'login' ? (
              <>Don't have an account? <span className="auth-link" onClick={() => setAuthMode('register')}>Register</span></>
            ) : (
              <>Already have an account? <span className="auth-link" onClick={() => setAuthMode('login')}>Log In</span></>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Dashboard Layout Render
  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="logo-section">
          <div className="logo-icon">T</div>
          <span className="logo-text">TaskSphere</span>
        </div>

        <nav className="nav-section">
          <div className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => { setActiveTab('dashboard'); setSelectedTeam(null); }}>
            <IconCalendar /> Tasks Dashboard
          </div>
          <div className={`nav-item ${activeTab === 'teams' ? 'active' : ''}`} onClick={() => setActiveTab('teams')}>
            <IconUsers /> Collaborative Teams
          </div>
          <div className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => { setActiveTab('profile'); setSelectedTeam(null); }}>
            <IconUser /> Profile Settings
          </div>
        </nav>

        {user && (
          <div className="profile-summary">
            <div className="profile-info">
              <div className="avatar">
                {user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
              </div>
              <div className="profile-details">
                <h4>{user.name}</h4>
                <p>{user.email}</p>
              </div>
            </div>
            <button className="btn-logout" onClick={handleLogout}>Log Out</button>
          </div>
        )}
      </aside>

      {/* Main Container */}
      <main className="main-content">
        {/* TOASTS PANEL */}
        <div className="toast-container">
          {toasts.map((toast) => (
            <div key={toast.id} className="toast">
              <span>🔔 {toast.message}</span>
              <button className="toast-close" onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}>×</button>
            </div>
          ))}
        </div>

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <h2 style={{ marginBottom: '24px' }}>Profile Settings</h2>
            <div className="column" style={{ maxWidth: '500px' }}>
              <form onSubmit={handleUpdateProfile}>
                {profStatus && <div style={{ color: profStatus.startsWith('Error') ? 'var(--danger)' : 'var(--success)', marginBottom: '15px', fontSize: '14px' }}>{profStatus}</div>}
                
                <div className="form-group">
                  <label>Name</label>
                  <input type="text" className="form-input" required value={profName} onChange={(e) => setProfName(e.target.value)} />
                </div>

                <div className="form-group">
                  <label>Email</label>
                  <input type="email" className="form-input" required value={profEmail} onChange={(e) => setProfEmail(e.target.value)} />
                </div>

                <div className="form-group">
                  <label>New Password (Optional)</label>
                  <input type="password" className="form-input" placeholder="Leave blank to keep current" value={profPassword} onChange={(e) => setProfPassword(e.target.value)} />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  Update Profile Details
                </button>
              </form>
            </div>
          </div>
        )}

        {/* TEAMS TAB */}
        {activeTab === 'teams' && !selectedTeam && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <div className="header">
              <h2>Collaborative Teams</h2>
              <button className="btn btn-primary" onClick={() => setShowTeamModal(true)}>
                <IconPlus /> Create New Team
              </button>
            </div>

            <div className="teams-grid">
              {teams.map((team) => (
                <div key={team.id} className="team-card" onClick={() => handleTeamClick(team.id)}>
                  <h3 style={{ marginBottom: '8px' }}>👥 {team.name}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '16px' }}>{team.description || 'No description provided.'}</p>
                  <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                    <span>Owner: {team.owner?.name}</span>
                    <span>Members: {team._count?.members || 0}</span>
                  </div>
                </div>
              ))}
              {teams.length === 0 && <p style={{ gridColumn: '1/-1', color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>No teams found. Create one or ask to be invited!</p>}
            </div>
          </div>
        )}

        {/* TEAM DETAILS TAB */}
        {activeTab === 'teams' && selectedTeam && (
          <div style={{ animation: 'fadeIn 0.3s ease' }}>
            <div className="header">
              <div>
                <button className="btn btn-secondary" style={{ marginBottom: '12px', padding: '6px 12px', fontSize: '13px' }} onClick={() => setSelectedTeam(null)}>
                  ← Back to Teams
                </button>
                <h2>Team: {selectedTeam.name}</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>{selectedTeam.description}</p>
              </div>

              {selectedTeam.owner.id === user?.id && (
                <button className="btn btn-primary" onClick={() => setShowMemberModal(true)}>
                  <IconPlus /> Invite Member
                </button>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
              {/* Member list column */}
              <div className="column" style={{ minHeight: 'auto' }}>
                <h3>Members ({selectedTeam.members.length})</h3>
                <div className="team-members-list">
                  {selectedTeam.members.map((m) => (
                    <div key={m.id} style={{ display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', padding: '10px', backgroundColor: 'var(--bg-surface-elevated)', borderRadius: '8px' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '14px' }}>{m.user.name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{m.user.email} ({m.role})</div>
                      </div>
                      {selectedTeam.owner.id === user?.id && m.user.id !== user?.id && (
                        <button className="btn btn-secondary" style={{ padding: '4px 8px', fontSize: '11px', color: 'var(--danger)', borderColor: 'rgba(239,68,68,0.2)' }} onClick={() => handleRemoveMember(m.user.id)}>
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Team Tasks list column */}
              <div className="column" style={{ minHeight: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3>Tasks ({selectedTeam.tasks.length})</h3>
                  <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '13px' }} onClick={() => { setNewTaskTeam(selectedTeam.id); setShowTaskModal(true); }}>
                    <IconPlus /> Add Team Task
                  </button>
                </div>
                <div className="task-list" style={{ marginTop: '16px' }}>
                  {selectedTeam.tasks.map((task) => (
                    <div key={task.id} className="task-card" style={{ cursor: 'pointer' }} onClick={() => loadTaskDetails(task.id)}>
                      <div className="task-card-header">
                        <span className={`priority-badge priority-${task.priority}`}>{task.priority}</span>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{task.status}</span>
                      </div>
                      <h4 style={{ margin: '6px 0' }}>{task.title}</h4>
                      <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{task.description || 'No description.'}</p>
                    </div>
                  ))}
                  {selectedTeam.tasks.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px' }}>No tasks assigned to this team yet.</p>}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TASKS DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div style={{ animation: 'fadeIn 0.3s ease', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
            {/* Header section */}
            <div className="header">
              <div>
                <h2>Workspace Tasks</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '4px' }}>Coordinate, schedule and automate your progress</p>
              </div>

              <div className="header-actions">
                <button className="btn btn-primary" onClick={() => setShowTaskModal(true)}>
                  <IconPlus /> Create Task
                </button>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="filter-bar">
              <div className="search-bar">
                <IconSearch />
                <input type="text" placeholder="Search tasks..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              </div>

              <div className="filter-group">
                <label>Priority</label>
                <select className="filter-select" value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
                  <option value="">All Priorities</option>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
              </div>

              <div className="filter-group">
                <label>Team</label>
                <select className="filter-select" value={filterTeam} onChange={(e) => setFilterTeam(e.target.value)}>
                  <option value="">Personal & All Teams</option>
                  {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </div>

              <div className="filter-group" style={{ marginLeft: 'auto' }}>
                <label>Sort By</label>
                <select className="filter-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="createdAt">Date Created</option>
                  <option value="dueDate">Due Date</option>
                  <option value="title">Alphabetical</option>
                  <option value="priority">Priority</option>
                </select>
                <select className="filter-select" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                  <option value="desc">Desc</option>
                  <option value="asc">Asc</option>
                </select>
              </div>
            </div>

            {/* 3 Column Task Board */}
            <div className="board-columns">
              {/* Column: OPEN */}
              <div className="column">
                <div className="column-header">
                  <div className="column-title"><span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: 'var(--text-muted)' }}></span> OPEN</div>
                  <span className="task-count">{tasks.filter(t => t.status === 'OPEN').length}</span>
                </div>
                <div className="task-list">
                  {tasks.filter(t => t.status === 'OPEN').map(task => (
                    <div key={task.id} className="task-card" onClick={() => loadTaskDetails(task.id)}>
                      <div className="task-card-header">
                        <span className={`priority-badge priority-${task.priority}`}>{task.priority}</span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }} onClick={(e) => { e.stopPropagation(); handleStatusChange(task.id, 'IN_PROGRESS'); }} title="Start Task">▶</button>
                        </div>
                      </div>
                      <h3>{task.title}</h3>
                      <p className="desc">{task.description || 'No description provided.'}</p>
                      <div className="task-card-footer">
                        <div className={`due-date ${task.dueDate && new Date(task.dueDate) < new Date() ? 'overdue' : ''}`}>
                          <IconCalendar /> {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
                        </div>
                        <div style={{ display: 'flex', gap: '10px', color: 'var(--text-muted)' }}>
                          {task._count?.comments > 0 && <span>💬 {task._count.comments}</span>}
                          {task._count?.attachments > 0 && <span>📎 {task._count.attachments}</span>}
                          {task.assignee && <div className="avatar" style={{ width: 22, height: 22, fontSize: 9 }}>{task.assignee.name.substring(0, 2).toUpperCase()}</div>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column: IN PROGRESS */}
              <div className="column">
                <div className="column-header">
                  <div className="column-title"><span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: 'var(--warning)' }}></span> IN PROGRESS</div>
                  <span className="task-count">{tasks.filter(t => t.status === 'IN_PROGRESS').length}</span>
                </div>
                <div className="task-list">
                  {tasks.filter(t => t.status === 'IN_PROGRESS').map(task => (
                    <div key={task.id} className="task-card" onClick={() => loadTaskDetails(task.id)}>
                      <div className="task-card-header">
                        <span className={`priority-badge priority-${task.priority}`}>{task.priority}</span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--success)' }} onClick={(e) => { e.stopPropagation(); handleCompleteTask(task.id); }} title="Complete Task">✔</button>
                        </div>
                      </div>
                      <h3>{task.title}</h3>
                      <p className="desc">{task.description || 'No description provided.'}</p>
                      <div className="task-card-footer">
                        <div className={`due-date ${task.dueDate && new Date(task.dueDate) < new Date() ? 'overdue' : ''}`}>
                          <IconCalendar /> {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
                        </div>
                        <div style={{ display: 'flex', gap: '10px', color: 'var(--text-muted)' }}>
                          {task._count?.comments > 0 && <span>💬 {task._count.comments}</span>}
                          {task._count?.attachments > 0 && <span>📎 {task._count.attachments}</span>}
                          {task.assignee && <div className="avatar" style={{ width: 22, height: 22, fontSize: 9 }}>{task.assignee.name.substring(0, 2).toUpperCase()}</div>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column: COMPLETED */}
              <div className="column">
                <div className="column-header">
                  <div className="column-title"><span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: 'var(--success)' }}></span> COMPLETED</div>
                  <span className="task-count">{tasks.filter(t => t.status === 'COMPLETED').length}</span>
                </div>
                <div className="task-list">
                  {tasks.filter(t => t.status === 'COMPLETED').map(task => (
                    <div key={task.id} className="task-card" onClick={() => loadTaskDetails(task.id)}>
                      <div className="task-card-header">
                        <span className={`priority-badge priority-${task.priority}`}>{task.priority}</span>
                        <button style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--danger)' }} onClick={(e) => { e.stopPropagation(); handleTaskDelete(task.id); }} title="Delete Task">×</button>
                      </div>
                      <h3 style={{ textDecoration: 'line-through', color: 'var(--text-muted)' }}>{task.title}</h3>
                      <p className="desc">{task.description || 'No description provided.'}</p>
                      <div className="task-card-footer">
                        <div className="due-date">
                          <IconCalendar /> {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
                        </div>
                        <div style={{ display: 'flex', gap: '10px', color: 'var(--text-muted)' }}>
                          {task._count?.comments > 0 && <span>💬 {task._count.comments}</span>}
                          {task._count?.attachments > 0 && <span>📎 {task._count.attachments}</span>}
                          {task.assignee && <div className="avatar" style={{ width: 22, height: 22, fontSize: 9 }}>{task.assignee.name.substring(0, 2).toUpperCase()}</div>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* DETAIL SIDE DRAWER FOR TASK */}
      {selectedTask && (
        <div className="modal-overlay" onClick={() => setSelectedTask(null)}>
          <div className="task-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <div>
                <span className={`priority-badge priority-${selectedTask.priority}`}>{selectedTask.priority}</span>
                <span style={{ marginLeft: '12px', fontSize: '13px', color: 'var(--text-muted)' }}>Status: {selectedTask.status}</span>
              </div>
              <button className="modal-close" onClick={() => setSelectedTask(null)}>×</button>
            </div>

            <div className="drawer-body">
              <div>
                <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '8px' }}>{selectedTask.title}</h1>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
                  Created by {selectedTask.creator?.name} on {new Date(selectedTask.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Basic configuration panels */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '16px 0' }}>
                <div>
                  <label style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 600, color: 'var(--text-muted)' }}>Assignee</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                    <div className="avatar" style={{ width: 28, height: 28, fontSize: 11 }}>
                      {selectedTask.assignee ? selectedTask.assignee.name.substring(0, 2).toUpperCase() : '?'}
                    </div>
                    <span style={{ fontSize: '14px' }}>{selectedTask.assignee?.name || 'Unassigned'}</span>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '11px', textTransform: 'uppercase', fontWeight: 600, color: 'var(--text-muted)' }}>Due Date</label>
                  <div style={{ fontSize: '14px', marginTop: '8px', fontWeight: 500 }}>
                    📅 {selectedTask.dueDate ? new Date(selectedTask.dueDate).toLocaleDateString() : 'No due date set'}
                  </div>
                </div>
              </div>

              {/* Task Description */}
              <div>
                <h3 style={{ fontSize: '16px', marginBottom: '10px' }}>Task Description</h3>
                <div style={{ backgroundColor: 'var(--bg-surface-elevated)', padding: '16px', borderRadius: '8px', fontSize: '14px', whiteSpace: 'pre-wrap', border: '1px solid var(--border)' }}>
                  {selectedTask.description || 'No description provided for this task.'}
                </div>
              </div>

              {/* AI Assistant Integration */}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
                <h3 style={{ fontSize: '16px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  ⚡ AI Project Manager helper
                </h3>
                <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                  <button className="btn btn-ai" onClick={handleGetSummary} disabled={aiGenerating}>
                    <IconAI /> Summarize Task & Comments
                  </button>
                </div>

                {aiGenerating && <p style={{ fontSize: '13px', color: 'var(--primary)' }}>Thinking... generating summary output.</p>}

                {taskSummary && (
                  <div className="ai-summary-card">
                    <h4>✨ Task Summary & Blockers</h4>
                    <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{taskSummary}</p>
                  </div>
                )}
              </div>

              {/* Attachments Section */}
              <div className="attachments-section" style={{ borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '16px' }}>Attachments ({selectedTask.attachments?.length || 0})</h3>
                  <button className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '12px' }} onClick={() => fileInputRef.current?.click()}>
                    <IconAttach /> Upload File
                  </button>
                  <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileUpload} />
                </div>

                <div className="attachment-list">
                  {selectedTask.attachments?.map((file) => (
                    <div key={file.id} className="attachment-item">
                      <div className="attachment-details">
                        <span>📄</span>
                        <a href={api.getDownloadUrl(file.id)} target="_blank" rel="noreferrer" className="attachment-link">
                          {file.originalName}
                        </a>
                        <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>({(file.size / 1024).toFixed(1)} KB)</span>
                      </div>
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>by {file.uploadedBy?.name}</span>
                    </div>
                  ))}
                  {(!selectedTask.attachments || selectedTask.attachments.length === 0) && (
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No attachments uploaded yet.</p>
                  )}
                </div>
              </div>

              {/* Comments Trail */}
              <div className="comments-section" style={{ borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
                <h3 style={{ fontSize: '16px' }}>Comments ({selectedTask.comments?.length || 0})</h3>
                <div className="comment-list">
                  {selectedTask.comments?.map((comment) => (
                    <div key={comment.id} className="comment-card">
                      <div className="comment-header">
                        <span className="comment-author">{comment.user?.name}</span>
                        <span className="comment-date">{new Date(comment.createdAt).toLocaleString()}</span>
                      </div>
                      <p style={{ fontSize: '13px', marginTop: '4px' }}>{comment.content}</p>
                    </div>
                  ))}
                  {(!selectedTask.comments || selectedTask.comments.length === 0) && (
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>No comments yet. Write a response below!</p>
                  )}
                </div>

                <form onSubmit={handleCommentSubmit} className="comment-input-area">
                  <input type="text" className="form-input" placeholder="Type a comment..." value={newComment} onChange={(e) => setNewComment(e.target.value)} />
                  <button type="submit" className="btn btn-primary" style={{ padding: '8px 16px' }}>Post</button>
                </form>
              </div>

              {/* Danger Action */}
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn btn-secondary" style={{ color: 'var(--danger)', borderColor: 'rgba(239,68,68,0.2)' }} onClick={() => handleTaskDelete(selectedTask.id)}>
                  <IconTrash /> Delete Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: CREATE TASK */}
      {showTaskModal && (
        <div className="modal-overlay" onClick={() => setShowTaskModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Task</h2>
              <button className="modal-close" onClick={() => setShowTaskModal(false)}>×</button>
            </div>
            <form onSubmit={handleCreateTask}>
              <div className="form-group">
                <label>Task Title</label>
                <input type="text" className="form-input" required placeholder="Build client dashboard" value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} />
              </div>

              {/* AI Prompt Input for Generation */}
              <div style={{ backgroundColor: 'rgba(168, 85, 247, 0.05)', padding: '12px', border: '1px dashed rgba(168, 85, 247, 0.3)', borderRadius: '8px', marginBottom: '16px' }}>
                <label style={{ fontSize: '12px', color: '#c084fc', fontWeight: 600, display: 'block', marginBottom: '6px' }}>AI Autodraft Description Notes (Optional)</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input type="text" className="form-input" style={{ flexGrow: 1, padding: '6px 12px', fontSize: '13px' }} placeholder="Requirements: UI panels, dark theme, socket logic..." value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} />
                  <button type="button" className="btn btn-ai" style={{ padding: '6px 12px', fontSize: '13px' }} onClick={handleGenerateDescription} disabled={aiGenerating}>
                    {aiGenerating ? 'Drafting...' : 'Draft with AI'}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea className="form-input" style={{ minHeight: '100px', resize: 'vertical' }} placeholder="Details of what needs to be delivered" value={newTaskDesc} onChange={(e) => setNewTaskDesc(e.target.value)}></textarea>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Priority</label>
                  <select className="filter-select" style={{ width: '100%', height: '45px' }} value={newTaskPriority} onChange={(e) => setNewTaskPriority(e.target.value)}>
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Due Date</label>
                  <input type="date" className="form-input" style={{ height: '45px' }} value={newTaskDueDate} onChange={(e) => setNewTaskDueDate(e.target.value)} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label>Assigned Team (Optional)</label>
                  <select className="filter-select" style={{ width: '100%', height: '45px' }} value={newTaskTeam} onChange={(e) => { setNewTaskTeam(e.target.value); setNewTaskAssignee(''); }}>
                    <option value="">None (Personal Task)</option>
                    {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label>Assignee ID (Optional UUID)</label>
                  <input type="text" className="form-input" style={{ height: '45px' }} placeholder="Paste user ID key" value={newTaskAssignee} onChange={(e) => setNewTaskAssignee(e.target.value)} />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '16px' }}>
                Create Task Card
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: CREATE TEAM */}
      {showTeamModal && (
        <div className="modal-overlay" onClick={() => setShowTeamModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create New Team Workspace</h2>
              <button className="modal-close" onClick={() => setShowTeamModal(false)}>×</button>
            </div>
            <form onSubmit={handleCreateTeam}>
              <div className="form-group">
                <label>Team Name</label>
                <input type="text" className="form-input" required placeholder="Design Systems Group" value={newTeamName} onChange={(e) => setNewTeamName(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Description</label>
                <input type="text" className="form-input" placeholder="Core design tokens and UX standards coordination" value={newTeamDesc} onChange={(e) => setNewTeamDesc(e.target.value)} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '16px' }}>
                Launch Team Workspace
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: INVITE MEMBER */}
      {showMemberModal && (
        <div className="modal-overlay" onClick={() => setShowMemberModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Invite Member to Team</h2>
              <button className="modal-close" onClick={() => setShowMemberModal(false)}>×</button>
            </div>
            <form onSubmit={handleAddMember}>
              <div className="form-group">
                <label>User Email Address</label>
                <input type="email" className="form-input" required placeholder="collaborator@example.com" value={newMemberEmail} onChange={(e) => setNewMemberEmail(e.target.value)} />
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '16px' }}>
                Add Collaborator
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
