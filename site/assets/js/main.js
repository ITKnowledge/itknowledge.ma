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
    const contactForm = document.querySelector('[data-contact-form]');
    const contactStatus = contactForm?.querySelector('[data-contact-status]');
    const contactSubmit = contactForm?.querySelector('[data-contact-submit]');

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

    const setContactStatus = (message, state = '') => {
      if (!contactStatus) return;
      contactStatus.textContent = message;
      if (state) contactStatus.dataset.state = state;
      else delete contactStatus.dataset.state;
    };

    const contactResult = new URL(window.location.href).searchParams.get('contact');
    if (contactResult === 'sent') setContactStatus(contactForm?.dataset.success || '', 'success');
    if (contactResult === 'error') setContactStatus(contactForm?.dataset.error || '', 'error');

    contactForm?.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!contactForm.reportValidity()) return;

      contactForm.setAttribute('aria-busy', 'true');
      if (contactSubmit) contactSubmit.disabled = true;
      setContactStatus(contactForm.dataset.sending || '');

      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: new FormData(contactForm),
          headers: { Accept: 'application/json' },
        });
        if (!response.ok) throw new Error(`Contact form returned ${response.status}`);
        contactForm.reset();
        setContactStatus(contactForm.dataset.success || '', 'success');
      } catch (_) {
        setContactStatus(contactForm.dataset.error || '', 'error');
      } finally {
        contactForm.removeAttribute('aria-busy');
        if (contactSubmit) contactSubmit.disabled = false;
      }
    });

    updateThemeControl();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true });
  else initialize();
})();
