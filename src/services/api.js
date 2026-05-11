const BASE_URL = 'http://localhost:5000';

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'API request failed');
  }
  return response.json();
};

export const api = {
  // Generic CRUD
  getAll: (resource) => fetch(`${BASE_URL}/${resource}`).then(handleResponse),
  getById: (resource, id) => fetch(`${BASE_URL}/${resource}/${id}`).then(handleResponse),
  create: (resource, data) => fetch(`${BASE_URL}/${resource}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleResponse),
  update: (resource, id, data) => fetch(`${BASE_URL}/${resource}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleResponse),
  patch: (resource, id, data) => fetch(`${BASE_URL}/${resource}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleResponse),
  remove: (resource, id) => fetch(`${BASE_URL}/${resource}/${id}`, {
    method: 'DELETE',
  }).then(handleResponse),
};

export const generateId = (prefix, list) => {
  const maxNum = list.reduce((max, item) => {
    const num = parseInt(String(item.id).replace(/\D/g, '')) || 0;
    return num > max ? num : max;
  }, 0);
  return `${prefix}${String(maxNum + 1).padStart(3, '0')}`;
};
