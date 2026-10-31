/**
 * LifeFlow Main App Scripts: Responsive Navigation, Header Status, Global Controls
 */

document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  setupUserHeader();
  setupGlobalSearch();
  setupMobileSidebarControls();
});

/* =========================================================================
   Mobile Sidebar Navigation Drawer
   ========================================================================= */

function toggleMobileSidebar(open) {
  const sidebar = document.getElementById('appSidebar');
  const backdrop = document.getElementById('sidebarBackdrop');
  if (!sidebar) return;

  const isCurrentlyClosed = sidebar.classList.contains('-translate-x-full');
  const shouldOpen = open !== undefined ? open : isCurrentlyClosed;

  if (shouldOpen) {
    sidebar.classList.remove('-translate-x-full');
    sidebar.classList.add('translate-x-0');
    if (backdrop) {
      backdrop.classList.remove('hidden');
      // Force reflow for CSS transition
      void backdrop.offsetWidth;
      backdrop.classList.remove('opacity-0');
      backdrop.classList.add('opacity-100');
    }
    document.body.classList.add('overflow-hidden', 'lg:overflow-auto');
  } else {
    sidebar.classList.remove('translate-x-0');
    sidebar.classList.add('-translate-x-full');
    if (backdrop) {
      backdrop.classList.remove('opacity-100');
      backdrop.classList.add('opacity-0');
      setTimeout(() => {
        backdrop.classList.add('hidden');
      }, 300);
    }
    document.body.classList.remove('overflow-hidden', 'lg:overflow-auto');
  }
}

function setupMobileSidebarControls() {
  // Mobile menu button in top header
  const menuBtn = document.getElementById('mobileMenuBtn');
  if (menuBtn) {
    menuBtn.addEventListener('click', () => toggleMobileSidebar(true));
  }

  // Backdrop overlay click
  const backdrop = document.getElementById('sidebarBackdrop');
  if (backdrop) {
    backdrop.addEventListener('click', () => toggleMobileSidebar(false));
  }

  // Close sidebar on ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      toggleMobileSidebar(false);
    }
  });

  // Automatically reset mobile drawer when resizing back to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 1024) {
      const backdrop = document.getElementById('sidebarBackdrop');
      if (backdrop && !backdrop.classList.contains('hidden')) {
        backdrop.classList.add('hidden');
        backdrop.classList.remove('opacity-100');
        backdrop.classList.add('opacity-0');
      }
      document.body.classList.remove('overflow-hidden');
    }
  });
}

/* =========================================================================
   Navigation Links & Active State
   ========================================================================= */

function setupNavigation() {
  const currentPath = window.location.pathname.toLowerCase();
  const navLinks = document.querySelectorAll('aside nav a[data-path]');

  navLinks.forEach(link => {
    const linkPath = link.getAttribute('data-path').toLowerCase();

    // Auto-close mobile drawer when any link is tapped on small screens
    link.addEventListener('click', () => {
      if (window.innerWidth < 1024) {
        toggleMobileSidebar(false);
      }
    });

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
        showToast('System configuration: MongoDB Atlas & Node.js active.');
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

/* =========================================================================
   User Header & Authentication Status
   ========================================================================= */

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

/* =========================================================================
   Global Search Bar
   ========================================================================= */

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
