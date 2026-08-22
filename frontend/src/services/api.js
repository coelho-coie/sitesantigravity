/**
 * API Service for Hulk Marvel Portal
 * Communicates with Django REST Framework backend
 */

const API_BASE = '/api';

/**
 * Helper to retrieve CSRF token from cookies if present
 */
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

async function request(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const csrftoken = getCookie('csrftoken');
  if (csrftoken) {
    headers['X-CSRFToken'] = csrftoken;
  }

  const config = {
    ...options,
    headers,
    credentials: 'include', // Includes Django session cookies
  };

  const response = await fetch(`${API_BASE}${endpoint}`, config);

  let data;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const error = new Error((data && data.detail) || (data && data.message) || response.statusText || 'Erro na requisição');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  // Auth
  async login(username, password) {
    return request('/auth/login/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  async logout() {
    return request('/auth/logout/', {
      method: 'POST',
    });
  },

  async getMe() {
    return request('/auth/me/');
  },

  // Curiosities
  async getCuriosities(category = null, search = null) {
    const params = new URLSearchParams();
    if (category && category !== 'ALL') params.append('category', category);
    if (search) params.append('search', search);
    const queryString = params.toString() ? `?${params.toString()}` : '';
    return request(`/curiosities/${queryString}`);
  },

  async getCuriosity(id) {
    return request(`/curiosities/${id}/`);
  },

  async createCuriosity(curiosityData) {
    return request('/curiosities/', {
      method: 'POST',
      body: JSON.stringify(curiosityData),
    });
  },

  async updateCuriosity(id, curiosityData) {
    return request(`/curiosities/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(curiosityData),
    });
  },

  async deleteCuriosity(id) {
    return request(`/curiosities/${id}/`, {
      method: 'DELETE',
    });
  },

  // Media Status
  async getMediaStatus() {
    return request('/media-status/');
  },

  // Seed Reset
  async seedDatabase() {
    return request('/curiosities/seed/', {
      method: 'POST',
    });
  }
};
