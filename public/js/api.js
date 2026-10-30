/**
 * LifeFlow API Client & Utility Library
 */

const API = {
  getToken() {
    return localStorage.getItem('lifeflow_token');
  },

  setToken(token) {
    localStorage.setItem('lifeflow_token', token);
  },

  removeToken() {
    localStorage.removeItem('lifeflow_token');
    localStorage.removeItem('lifeflow_user');
  },

  getUser() {
    try {
      const u = localStorage.getItem('lifeflow_user');
      return u ? JSON.parse(u) : null;
    } catch (e) {
      return null;
    }
  },

  setUser(user) {
    localStorage.setItem('lifeflow_user', JSON.stringify(user));
  },

  async request(endpoint, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(endpoint, {
        ...options,
        headers
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (err) {
      console.error(`API Error on [${options.method || 'GET'} ${endpoint}]:`, err);
      throw err;
    }
  },

  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  },

  post(endpoint, body) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body)
    });
  },

  put(endpoint, body) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body)
    });
  },

  patch(endpoint, body) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body)
    });
  },

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
};

/**
 * Universal Toast Notification System
 */
function showToast(message, type = 'success') {
  let toast = document.getElementById('toastNotification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toastNotification';
    toast.className = 'fixed bottom-8 right-8 bg-[#303031] text-[#f2f0f1] px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 transform translate-y-20 opacity-0 transition-all duration-300 z-50';
    toast.innerHTML = `
      <span class="material-symbols-outlined text-[#f9e37a]" id="toastIcon">check_circle</span>
      <span class="text-sm font-medium" id="toastMessage">Action completed successfully.</span>
    `;
    document.body.appendChild(toast);
  }

  const iconEl = toast.querySelector('#toastIcon');
  const msgEl = toast.querySelector('#toastMessage');

  if (msgEl) msgEl.innerText = message;
  if (iconEl) {
    if (type === 'error') {
      iconEl.innerText = 'error';
      iconEl.className = 'material-symbols-outlined text-[#ffdad6]';
    } else if (type === 'warning') {
      iconEl.innerText = 'warning';
      iconEl.className = 'material-symbols-outlined text-[#f9e37a]';
    } else {
      iconEl.innerText = 'check_circle';
      iconEl.className = 'material-symbols-outlined text-[#b1c5ff]';
    }
  }

  toast.classList.remove('translate-y-20', 'opacity-0');

  if (window._toastTimeout) clearTimeout(window._toastTimeout);
  window._toastTimeout = setTimeout(() => {
    toast.classList.add('translate-y-20', 'opacity-0');
  }, 4000);
}

window.API = API;
window.showToast = showToast;
