// Runs before first paint so the saved theme preference applies without a flash.
// Print routes are light-only documents; portfolio dark mode never applies there.
(() => {
  if (/^\/print(?:\/|$)/.test(location.pathname)) return;

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
