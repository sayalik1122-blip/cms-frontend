const BASE_URL = 'http://localhost:8080/api';
const SESSION_KEY = 'cms_auth_user';

const getHeaders = () => {
  const headers = { 'Content-Type': 'application/json' };
  try {
    const stored = localStorage.getItem(SESSION_KEY);
    if (stored) {
      const { token } = JSON.parse(stored);
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
  } catch (e) {
    console.error('Error reading token from localStorage', e);
  }
  return headers;
};

const handleResponse = async (response) => {
  if (response.status === 401 || response.status === 403) {
    // Optional: handle logout on token expiry
  }
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'API request failed');
  }
  return response.json();
};

export const api = {
  // Generic CRUD
  getAll: (resource) => fetch(`${BASE_URL}/${resource}`, {
    headers: getHeaders()
  }).then(handleResponse),

  getById: (resource, id) => fetch(`${BASE_URL}/${resource}/${id}`, {
    headers: getHeaders()
  }).then(handleResponse),

  create: (resource, data) => fetch(`${BASE_URL}/${resource}`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  }).then(handleResponse),

  update: (resource, id, data) => fetch(`${BASE_URL}/${resource}/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(data),
  }).then(handleResponse),

  patch: (resource, id, data) => fetch(`${BASE_URL}/${resource}/${id}`, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify(data),
  }).then(handleResponse),

  remove: (resource, id) => fetch(`${BASE_URL}/${resource}/${id}`, {
    method: 'DELETE',
    headers: getHeaders(),
  }).then(handleResponse),
};

export const generateId = (prefix, list) => {
  const maxNum = list.reduce((max, item) => {
    const num = parseInt(String(item.id).replace(/\D/g, '')) || 0;
    return num > max ? num : max;
  }, 0);
  return `${prefix}${String(maxNum + 1).padStart(3, '0')}`;
};
