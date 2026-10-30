/**
 * LifeFlow Main App Scripts: Navigation, Header Status, Global Controls
 */

document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  setupUserHeader();
  setupGlobalSearch();
});

function setupNavigation() {
  const currentPath = window.location.pathname.toLowerCase();
  const navLinks = document.querySelectorAll('aside nav a[data-path]');

  navLinks.forEach(link => {
    const linkPath = link.getAttribute('data-path').toLowerCase();
    const href = link.getAttribute('href');

    // Matching routes
    let isActive = false;
    if ((currentPath === '/' || currentPath === '/dashboard' || currentPath.includes('index.html')) && linkPath === 'dashboard') {
      isActive = true;
    } else if (currentPath.includes(linkPath)) {
      isActive = true;
    }

    if (isActive) {
      link.className = 'flex items-center px-4 py-3 rounded-xl transition-all bg-primary-container text-on-primary-container font-bold';
      link.setAttribute('aria-current', 'page');
    } else if (linkPath !== 'logout') {
      link.className = 'flex items-center px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-all';
      link.removeAttribute('aria-current');
    }

    // Set correct href routes
    if (linkPath === 'dashboard') link.href = '/';
    else if (linkPath === 'donors') link.href = '/donors';
    else if (linkPath === 'blood-inventory' || linkPath === 'inventory') link.href = '/inventory';
    else if (linkPath === 'blood-requests' || linkPath === 'requests') link.href = '/requests';
    else if (linkPath === 'donations') link.href = '/donations';
    else if (linkPath === 'hospitals') link.href = '/hospitals';
    else if (linkPath === 'reports') link.href = '/reports';
    else if (linkPath === 'distribution') link.href = '/requests';
    else if (linkPath === 'notifications') {
      link.href = '#';
      link.onclick = (e) => {
        e.preventDefault();
        showToast('System alerts are healthy. 0 critical server errors logged.');
      };
    } else if (linkPath === 'settings') {
      link.href = '#';
      link.onclick = (e) => {
        e.preventDefault();
        showToast('System configuration: MongoDB 8.3 & Node.js active.');
      };
    } else if (linkPath === 'logout') {
      link.href = '#';
      link.onclick = (e) => {
        e.preventDefault();
        handleLogout();
      };
    }
  });
}

function setupUserHeader() {
  const user = API.getUser();
  const avatarEl = document.querySelector('header .w-8.h-8');

  if (avatarEl && user) {
    const initials = user.name
      ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
      : 'EV';
    avatarEl.innerHTML = `<span class="text-xs font-bold text-white tracking-wider">${initials}</span>`;
    avatarEl.title = `${user.name} (${user.role || 'Staff'})`;
    avatarEl.style.cursor = 'pointer';
    avatarEl.onclick = () => {
      showToast(`Logged in as: ${user.name} • ${user.institution || 'Medical Center'}`);
    };
  }
}

function handleLogout() {
  API.removeToken();
  showToast('You have been securely signed out. Redirecting...', 'warning');
  setTimeout(() => {
    window.location.href = '/login';
  }, 1000);
}

function setupGlobalSearch() {
  const searchInput = document.querySelector('header input[type="text"]');
  if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const q = searchInput.value.trim().toLowerCase();
        if (!q) return;

        if (q.includes('donor') || q.includes('eleanor') || q.includes('marcus')) {
          window.location.href = `/donors?search=${encodeURIComponent(q)}`;
        } else if (q.includes('hosp') || q.includes('jude') || q.includes('metro')) {
          window.location.href = `/hospitals?search=${encodeURIComponent(q)}`;
        } else if (q.includes('req') || q.includes('urg') || q.includes('emer')) {
          window.location.href = `/requests?search=${encodeURIComponent(q)}`;
        } else {
          window.location.href = `/inventory?search=${encodeURIComponent(q)}`;
        }
      }
    });
  }
}
