(function () {
  const STORAGE_KEY = 'mandir-theme';

  function getSavedTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === 'dark' ? 'dark' : 'light';
  }

  function inferSurfaceType(el) {
    const style = (el.getAttribute('style') || '').toLowerCase().replace(/\s+/g, ' ');
    if (!style) return;

    if (style.includes('background:white') || style.includes('background: white') ||
        style.includes('background:#fff') || style.includes('background: #fff') ||
        style.includes('background:#ffffff') || style.includes('background: #ffffff') ||
        style.includes('background:#f8fbf8') || style.includes('background: #f8fbf8') ||
        style.includes('background:#f8f9fa') || style.includes('background: #f8f9fa')) {
      el.dataset.themeAutoSurface = 'surface';
    }

    if ((style.includes('color:#111') || style.includes('color:#000') || style.includes('color:black')) && !el.dataset.themeAutoText) {
      el.dataset.themeAutoText = 'primary';
    }
    if ((style.includes('color:#667085') || style.includes('color:#475467')) && !el.dataset.themeAutoText) {
      el.dataset.themeAutoText = 'muted';
    }
  }

  function normalizeThemedElements() {
    document.querySelectorAll('[style]').forEach(inferSurfaceType);

    document.querySelectorAll('input, textarea, select').forEach((el) => {
      el.dataset.themeControl = 'true';
    });

    document.querySelectorAll('pre, code').forEach((el) => {
      if (!el.dataset.themeRole) el.dataset.themeRole = 'code';
    });

    document.querySelectorAll('.card, .dashboard-card, .container-central, .popup-content, .popup-conteudo, .modal-content, .lista-item, .item-card, .stat-card').forEach((el) => {
      if (!el.dataset.themeRole) el.dataset.themeRole = 'surface';
    });

    document.querySelectorAll('h1, h2, h3, h4, h5, h6, label, p, span, strong, small, li, td, th').forEach((el) => {
      if (!el.dataset.themeAutoText && !el.closest('.titulo-pagina, .dashboard-header')) {
        el.dataset.themeAutoText = el.classList.contains('muted') ? 'muted' : 'primary';
      }
    });
  }

  function applyTheme(theme) {
    const root = document.documentElement;
    const body = document.body;
    root.classList.toggle('theme-dark', theme === 'dark');
    root.classList.toggle('theme-light', theme !== 'dark');
    if (body) {
      body.classList.toggle('theme-dark', theme === 'dark');
      body.classList.toggle('theme-light', theme !== 'dark');
    }

    normalizeThemedElements();

    document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
      btn.setAttribute('aria-pressed', String(theme === 'dark'));
      btn.innerHTML = theme === 'dark' ? '🌙 Modo Noturno' : '☀️ Modo Claro';
    });
  }

  function setTheme(theme) {
    localStorage.setItem(STORAGE_KEY, theme);
    applyTheme(theme);
  }

  function toggleTheme() {
    const next = getSavedTheme() === 'dark' ? 'light' : 'dark';
    setTheme(next);
  }

  window.MandirTheme = { getSavedTheme, applyTheme, setTheme, toggleTheme, normalizeThemedElements };

  const observer = new MutationObserver(() => {
    if (document.body) normalizeThemedElements();
  });

  document.addEventListener('DOMContentLoaded', () => {
    applyTheme(getSavedTheme());
    observer.observe(document.body, { childList: true, subtree: true });
    document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
      btn.addEventListener('click', toggleTheme);
    });
  });
})();
