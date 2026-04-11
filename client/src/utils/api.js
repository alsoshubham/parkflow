const API_URL = '/api';

export const api = {
  async get(endpoint) {
    return fetchAPI(endpoint, { method: 'GET' });
  },
  async post(endpoint, data) {
    return fetchAPI(endpoint, { method: 'POST', body: JSON.stringify(data) });
  },
  async put(endpoint, data) {
    return fetchAPI(endpoint, { method: 'PUT', body: JSON.stringify(data) });
  },
  async patch(endpoint, data) {
    return fetchAPI(endpoint, { method: 'PATCH', body: JSON.stringify(data) });
  },
  async delete(endpoint) {
    return fetchAPI(endpoint, { method: 'DELETE' });
  }
};

async function fetchAPI(endpoint, options = {}) {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  let data;
  try {
    data = await response.json();
  } catch (e) {
    if (!response.ok) throw new Error(response.statusText);
    return null;
  }

  if (!response.ok) {
    throw new Error(data?.error || 'API Error');
  }

  return data;
}
