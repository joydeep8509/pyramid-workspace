// frontend/lib/api.ts
const API_URL = 'http://localhost:3001/api';

export interface TaskData {
  id: number;
  title: string;
  status: string;
  priority: string;
  dueDate: string;
  tags: string[];
  members: string[];
}

export interface ProjectData {
  id: number;
  name: string;
  priority: string;
  dueDate: string;
  lead: string;
}

export interface UserProfile {
  name: string;
  email: string;
  title: string;
  username: string;
}

export const api = {
  getTasks: async (): Promise<TaskData[]> => {
    const res = await fetch(`${API_URL}/tasks`);
    if (!res.ok) {
      // This reveals the exact error from NestJS (e.g., 404 Not Found, 500 DB Error)
      const errorDetails = await res.text(); 
      console.error(`Backend Error (${res.status}):`, errorDetails);
      throw new Error(`Failed to fetch: ${res.status} - ${errorDetails}`);
    }
    return res.json();
  },
  // Add this inside export const api = { ... }
  getTaskById: async (id: number | string): Promise<TaskData> => {
    const res = await fetch(`${API_URL}/tasks/${id}`);
    if (!res.ok) throw new Error('Failed to fetch task');
    return res.json();
  },

  // Create a new task in MySQL
  createTask: async (task: Partial<TaskData>): Promise<TaskData> => {
    const res = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task),
    });
    if (!res.ok) throw new Error('Failed to create task');
    return res.json();
  },

  // Update a task (e.g., dragging to a new column)
  updateTask: async (id: number, updates: Partial<TaskData>): Promise<TaskData> => {
    const res = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return res.json();
  },

  getProjects: async (): Promise<ProjectData[]> => {
    const res = await fetch(`${API_URL}/projects`);
    if (!res.ok) throw new Error('Failed to fetch projects');
    return res.json();
  },

  createProject: async (project: Partial<ProjectData>): Promise<ProjectData> => {
    const res = await fetch(`${API_URL}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project),
    });
    if (!res.ok) throw new Error('Failed to create project');
    return res.json();
  },

  deleteTask: async (id: number): Promise<void> => {
    await fetch(`${API_URL}/tasks/${id}`, { method: 'DELETE' });
  },

  updateProject: async (id: number, updates: Partial<ProjectData>): Promise<ProjectData> => {
    const res = await fetch(`${API_URL}/projects/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    return res.json();
  },

  deleteProject: async (id: number): Promise<void> => {
    await fetch(`${API_URL}/projects/${id}`, { method: 'DELETE' });
  },

 getProfile: async (): Promise<UserProfile> => {
    const res = await fetch(`${API_URL}/users/profile`);
    if (!res.ok) {
      const errorText = await res.text();
      console.error("Backend Error:", errorText); // This will print "404 Not Found" or "MySQL Error"
      throw new Error('Failed to fetch profile');
    }
    return res.json();
  },

  updateProfile: async (profile: Partial<UserProfile>): Promise<UserProfile> => {
    const res = await fetch(`${API_URL}/users/profile`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
    if (!res.ok) throw new Error('Failed to update profile');
    return res.json();
  }
};