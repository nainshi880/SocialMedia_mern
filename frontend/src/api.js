const API_URL = 'http://localhost:5000/api';

export const request = async (path, { method = 'GET', body, token } = {}) => {
  const headers = {};
  const isFormData = body instanceof FormData;

  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined
  });

  const data = await res.json();
  
  if (!res.ok) {
    throw new Error(data.message || 'Request failed');
  }
  
  return data;
};