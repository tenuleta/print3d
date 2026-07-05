const API_URL = 'http://localhost:4000/api';

function getAuthHeaders(includeContentType = true) {
  const token = localStorage.getItem('accessToken');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  if (includeContentType) {
    headers['Content-Type'] = 'application/json';
  }
  return headers;
}

async function request(path, options = {}) {
  const url = `${API_URL}${path}`;
  const isFormData = options.body instanceof FormData;
  const headers = { ...getAuthHeaders(!isFormData), ...(options.headers || {}) };

  let res;
  try {
    res = await fetch(url, {
      ...options,
      headers,
    });
  } catch (err) {
    throw new Error(`Cannot connect to server. Make sure the backend is running on port 4000. (${err.message})`);
  }

  const isAuthEndpoint = path.includes('/auth/login') || path.includes('/auth/register');

  if (res.status === 401 && !isAuthEndpoint) {
    const refreshed = await tryRefresh();
    if (refreshed) {
      try {
        const retryRes = await fetch(url, {
          ...options,
          headers,
        });
        return handleResponse(retryRes);
      } catch (err) {
        throw new Error(`Request failed: ${err.message}`);
      }
    }
    localStorage.clear();
    window.location.href = '/login';
    throw new Error('Session expired');
  }
  return handleResponse(res);
}

async function handleResponse(res) {
  let data;
  try {
    data = await res.json();
  } catch {
    if (!res.ok) throw new Error(`Server error: ${res.status} ${res.statusText}`);
    throw new Error('Invalid response from server');
  }

  if (!res.ok) {
    if (data.errors && Array.isArray(data.errors)) {
      throw new Error(data.errors.map(e => e.message).join(', '));
    }
    throw new Error(data.error || `Request failed with status ${res.status}`);
  }
  return data;
}

async function tryRefresh() {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) return false;
  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return true;
  } catch {
    return false;
  }
}

export const api = {
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  logout: () => {
    const rt = localStorage.getItem('refreshToken');
    localStorage.clear();
    if (rt) request('/auth/logout', { method: 'POST', body: JSON.stringify({ refreshToken: rt }) }).catch(() => {});
  },
  getMaterials: () => request('/materials'),
  createOrder: (formData) => request('/orders', { method: 'POST', headers: {}, body: formData }),
  getMyOrders: () => request('/orders/mine'),
  getAllOrders: () => request('/orders'),
  updateOrderStatus: (id, status) => request(`/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  cancelOrder: (id) => request(`/orders/${id}/cancel`, { method: 'PATCH' }),
  getUsers: () => request('/users'),
};
