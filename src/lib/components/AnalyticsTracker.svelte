<script lang="ts">
  import { browser } from '$app/environment';
  import { page } from '$app/state';

  const SESSION_KEY = 'junuuon_analytics_session_id';

  let currentPath = $state('');
  let maxScrollDepth = $state(0);
  let sessionId = $state('');
  let startTime = $state(0);

  function getOrInitializeSession(): { id: string; isNew: boolean } {
    if (!browser) return { id: '', isNew: false };

    let id = sessionStorage.getItem(SESSION_KEY);
    let isNew = false;

    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem(SESSION_KEY, id);
      isNew = true;
    }
    return { id, isNew };
  }

  function sendTrackingData(data: Record<string, unknown>) {
    if (!browser || !sessionId) return;

    // 관리자(유저 본인) 기기/브라우저는 로그 수집을 완전히 차단
    if (localStorage.getItem('junuuon_analytics_ignore') === 'true') {
      return;
    }

    const payload = JSON.stringify({
      sessionId,
      userAgent: navigator.userAgent,
      ...data,
    });

    if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
      navigator.sendBeacon('/api/analytics/track', payload);
    } else {
      void fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: payload,
        keepalive: true,
      });
    }
  }

  function handleScroll() {
    if (!browser) return;

    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;

    if (scrollHeight - clientHeight <= 0) return;

    const percentage = Math.round((scrollTop / (scrollHeight - clientHeight)) * 100);
    if (percentage > maxScrollDepth) {
      maxScrollDepth = Math.min(percentage, 100);
    }
  }

  function flushPageData(path: string) {
    if (!startTime || !path) return;

    const dwellTime = Math.round((Date.now() - startTime) / 1000);
    sendTrackingData({
      path,
      dwellTime,
      scrollDepth: maxScrollDepth,
    });
  }

  $effect(() => {
    if (!browser) return;

    const session = getOrInitializeSession();
    sessionId = session.id;
    currentPath = page.url.pathname;
    startTime = Date.now();

    if (session.isNew) {
      sendTrackingData({
        isInitial: true,
        referrer: document.referrer || 'direct',
      });
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        flushPageData(currentPath);
      } else {
        startTime = Date.now();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  });

  $effect(() => {
    const path = page.url.pathname;

    if (currentPath && currentPath !== path) {
      flushPageData(currentPath);

      currentPath = path;
      maxScrollDepth = 0;
      startTime = Date.now();
    }
  });
</script>
