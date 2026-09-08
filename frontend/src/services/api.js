const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const request = async (path, options = {}) => {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, options);
  } catch {
    throw new Error(
      'Cannot connect to the MelaHub server. Make sure the backend is running.'
    );
  }

  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json')
    ? await response.json()
    : {};

  if (!response.ok) {
    throw new Error(data.message || 'The request failed.');
  }

  return data;
};

export const api = {
  login: (credentials) => request('/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  }),
  register: (userData) => request('/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  }),
  getOpportunities: async () => {
    const response = await fetch(`${API_BASE_URL}/opportunities`);
    return response.json();
  },
  getOpportunityById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/opportunities/${id}`);
    return response.json();
  },
};
