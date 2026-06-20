const API_BASE_URL = 'http://localhost:5000/api/v1';

// Helper to resolve tenant slug from email domain
export const getTenantSlugFromEmail = (email) => {
  const cleanEmail = email.toLowerCase().trim();
  if (cleanEmail === 'superadmin@hoteloraa.com') return 'system';
  if (cleanEmail.endsWith('@royalpalace.com') || cleanEmail.endsWith('@royalpalace')) return 'royal-palace';
  if (cleanEmail.endsWith('@cafearoma.com') || cleanEmail.endsWith('@caferoma.com')) return 'cafe-aroma';
  if (cleanEmail.endsWith('@starlodge.com')) return 'star-lodge';
  if (cleanEmail.endsWith('@grandoak.com')) return 'grand-oak';
  
  // Fallback default
  return 'system';
};

const getHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data.data; // The server wraps response data in a 'data' field
};

export const api = {
  get: async (path) => {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  post: async (path, body) => {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  },

  put: async (path, body) => {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  },

  patch: async (path, body) => {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(body),
    });
    return handleResponse(response);
  },

  delete: async (path) => {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(response);
  },

  login: async (email, password) => {
    const tenantSlug = getTenantSlugFromEmail(email);
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tenantSlug, email, password }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Invalid credentials');
    }
    
    // Store user session info
    localStorage.setItem('token', data.data.token);
    localStorage.setItem('user', JSON.stringify(data.data.user));
    return data.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export default api;
