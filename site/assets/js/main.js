(() => {
  'use strict';

  const root = document.documentElement;
  try {
    const stored = localStorage.getItem('itknowledge-theme');
    if (stored === 'dark' || stored === 'light') root.dataset.theme = stored;
  } catch (_) {
    // Storage can be unavailable in hardened browsers; dark remains the default.
  }

  function initialize() {
    const themeToggle = document.querySelector('[data-theme-toggle]');
    const menuToggle = document.querySelector('[data-menu-toggle]');
    const menu = document.querySelector('[data-menu]');
    const themeColor = document.querySelector('meta[name="theme-color"]');

    const updateThemeControl = () => {
      if (!themeToggle) return;
      const dark = root.dataset.theme === 'dark';
      themeToggle.setAttribute('aria-label', dark ? themeToggle.dataset.lightLabel : themeToggle.dataset.darkLabel);
      if (themeColor) themeColor.content = dark ? '#08090d' : '#fafafa';
    };

    themeToggle?.addEventListener('click', () => {
      root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem('itknowledge-theme', root.dataset.theme);
      } catch (_) {
        // Theme still changes for the current page when storage is unavailable.
      }
      updateThemeControl();
    });

    const closeMenu = () => {
      if (!menu || !menuToggle) return;
      menu.dataset.open = 'false';
      menuToggle.setAttribute('aria-expanded', 'false');
    };

    menuToggle?.addEventListener('click', () => {
      const opening = menu?.dataset.open !== 'true';
      if (menu) menu.dataset.open = String(opening);
      menuToggle.setAttribute('aria-expanded', String(opening));
    });

    menu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });

    updateThemeControl();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true });
  else initialize();
})();
