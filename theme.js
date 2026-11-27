/* ==========================================================================
   LUMIGO — Dark / Light Mode & Equipped Theme Manager
   ========================================================================== */
(function () {
  window.LUMIGO = window.LUMIGO || {};

  function getTheme() {
    return localStorage.getItem(window.LUMIGO.storage.KEYS.THEME) || 'dark';
  }

  function applyTheme(mode) {
    const isLight = mode === 'light';
    document.body.classList.toggle('light-mode', isLight);

    // Apply equipped shop background theme if any
    const user = window.LUMIGO.storage.getActiveUser();
    document.body.classList.remove('theme-bg-cyber', 'theme-bg-aurora', 'theme-bg-solar');
    if (user && user.bgTheme) {
      document.body.classList.add(user.bgTheme);
    }

    const btn = document.getElementById('theme-toggle-btn');
    if (btn) {
      btn.textContent = isLight ? '🌙' : '☀️';
      btn.title = isLight ? 'Dark Mode' : 'Light Mode';
    }
  }

  function toggleTheme() {
    const next = getTheme() === 'light' ? 'dark' : 'light';
    localStorage.setItem(window.LUMIGO.storage.KEYS.THEME, next);
    applyTheme(next);
  }

  function initTheme() {
    applyTheme(getTheme());
    window.addEventListener('lumigo:user-updated', () => applyTheme(getTheme()));
  }

  window.LUMIGO.theme = {
    getTheme,
    applyTheme,
    toggleTheme,
    initTheme
  };
})();
