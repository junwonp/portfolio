// Runs before first paint so the saved theme preference applies without a flash.
// Paper documents (/print, /portfolio) are light-only: their fixed paper/ink
// values cannot follow the dark palette and would render at unreadable contrast.
(() => {
  if (/^\/(?:print|portfolio)(?:\/|$)/.test(location.pathname)) return;

  var theme = null;
  try {
    theme = localStorage.getItem('theme');
  } catch {
    // Storage can be unavailable; the system preference remains the fallback.
  }

  if (
    theme === 'dark' ||
    (theme !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    document.documentElement.classList.add('dark');
  }
})();
