'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

import {
  calculateArticleProgress,
  calculateScrollDepth,
  type ReachedSection,
  selectFarthestVisibleSection,
  type VisibleSection,
} from '@/lib/components/analyticsEngagement';
import {
  getOrInitializeAnalyticsSession,
  sendAnalyticsPayload,
} from '@/lib/components/analyticsTransport';
import { parseHeading } from '@/lib/utils/markdown';

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const [sessionId, setSessionId] = useState('');
  const activeStartedAtRef = useRef<number | null>(null);
  const activeTimeMsRef = useRef(0);
  const maxArticleProgressRef = useRef(0);
  const maxScrollDepthRef = useRef(0);
  const pageStartedAtRef = useRef(0);
  const pageViewIdRef = useRef('');
  const prevPathnameRef = useRef('');
  const reachedSectionRef = useRef<ReachedSection | undefined>(undefined);

  function captureActiveTime(now = Date.now()) {
    if (activeStartedAtRef.current === null) return;

    activeTimeMsRef.current += Math.max(0, now - activeStartedAtRef.current);
    activeStartedAtRef.current = document.visibilityState === 'visible' ? now : null;
  }

  function readVisibleSections(article: Element, scrollTop: number): VisibleSection[] {
    return Array.from(article.querySelectorAll<HTMLElement>('h2')).flatMap((heading) => {
      if (!heading.id) {
        return [];
      }

      const { main } = parseHeading(heading.textContent || '');
      return [
        {
          id: heading.id,
          label: main || heading.textContent || heading.id,
          top: heading.getBoundingClientRect().top + scrollTop,
        },
      ];
    });
  }

  function updateEngagementMetrics() {
    if (typeof window === 'undefined') return;

    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    const viewportBottom = scrollTop + clientHeight;
    const scrollDepth = calculateScrollDepth({ clientHeight, scrollHeight, scrollTop });

    if (scrollDepth > maxScrollDepthRef.current) {
      maxScrollDepthRef.current = scrollDepth;
    }

    const article = document.querySelector('.project-article');
    if (!article) {
      return;
    }

    const articleTop = article.getBoundingClientRect().top + scrollTop;
    const articleProgress = calculateArticleProgress({
      articleHeight: (article as HTMLElement).scrollHeight,
      articleTop,
      viewportBottom,
    });

    if (articleProgress > maxArticleProgressRef.current) {
      maxArticleProgressRef.current = articleProgress;
    }

    reachedSectionRef.current = selectFarthestVisibleSection({
      current: reachedSectionRef.current,
      sections: readVisibleSections(article, scrollTop),
      viewportBottom,
    });
  }

  function initializePage(path: string) {
    pageViewIdRef.current = crypto.randomUUID();
    pageStartedAtRef.current = Date.now();
    activeTimeMsRef.current = 0;
    activeStartedAtRef.current = document.visibilityState === 'visible' ? Date.now() : null;
    maxArticleProgressRef.current = 0;
    maxScrollDepthRef.current = 0;
    reachedSectionRef.current = undefined;
    prevPathnameRef.current = path;

    requestAnimationFrame(updateEngagementMetrics);
  }

  function flushPageData(path: string, currentSessionId = sessionId) {
    if (!pageStartedAtRef.current || !path) return;

    updateEngagementMetrics();
    captureActiveTime();

    const reachedSection = reachedSectionRef.current;
    const dwellTime = Math.round((Date.now() - pageStartedAtRef.current) / 1000);
    sendAnalyticsPayload(
      {
        activeTime: Math.round(activeTimeMsRef.current / 1000),
        articleProgress: maxArticleProgressRef.current,
        dwellTime,
        eventType: 'page',
        maxVisibleSectionId: reachedSection?.id,
        maxVisibleSectionLabel: reachedSection?.label,
        pageViewId: pageViewIdRef.current,
        path,
        scrollDepth: maxScrollDepthRef.current,
      },
      currentSessionId,
    );
  }

  function handleScroll() {
    updateEngagementMetrics();
  }

  function handleVisible() {
    if (activeStartedAtRef.current === null) {
      activeStartedAtRef.current = Date.now();
    }
  }

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const session = getOrInitializeAnalyticsSession();
    Promise.resolve().then(() => {
      setSessionId(session.id);
    });
    initializePage(window.location.pathname);

    if (session.isNew) {
      sendAnalyticsPayload(
        {
          isInitial: true,
          referrer: document.referrer || 'direct',
        },
        session.id,
      );
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        flushPageData(prevPathnameRef.current, session.id);
      } else {
        handleVisible();
      }
    };
    const handlePageHide = () => {
      flushPageData(prevPathnameRef.current, session.id);
    };
    const heartbeatId = window.setInterval(() => {
      if (document.visibilityState === 'visible') {
        flushPageData(prevPathnameRef.current, session.id);
      }
    }, 15000);

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('pagehide', handlePageHide);

    return () => {
      window.clearInterval(heartbeatId);
      flushPageData(prevPathnameRef.current, session.id);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handlePageHide);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-only: inner functions reference stable refs
  }, []);

  useEffect(() => {
    if (!sessionId) return;

    if (prevPathnameRef.current && prevPathnameRef.current !== pathname) {
      flushPageData(prevPathnameRef.current);
      initializePage(pathname);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- flushPageData uses stable refs only
  }, [pathname, sessionId]);

  return null;
}
