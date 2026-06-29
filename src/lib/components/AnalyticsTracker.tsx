"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

import { extractApplicationSlugFromPath } from "@/lib/utils/applicationSlug";

const SESSION_KEY = "junuuon_analytics_session_id";

interface SessionInfo {
  id: string;
  isNew: boolean;
}

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const [sessionId, setSessionId] = useState("");
  const maxScrollDepthRef = useRef(0);
  const startTimeRef = useRef(0);
  const prevPathnameRef = useRef("");

  function getOrInitializeSession(): SessionInfo {
    if (typeof window === "undefined") return { id: "", isNew: false };

    let id = sessionStorage.getItem(SESSION_KEY);
    let isNew = false;

    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem(SESSION_KEY, id);
      isNew = true;
    }
    return { id, isNew };
  }

  function sendTrackingData(data: Record<string, unknown>, currentSessionId = sessionId) {
    if (typeof window === "undefined" || !currentSessionId) return;

    if (localStorage.getItem("junuuon_analytics_ignore") === "true") {
      return;
    }

    const currentPath = typeof window !== "undefined" ? window.location.pathname : "";
    const applicationSlug = extractApplicationSlugFromPath(currentPath);
    const payload = JSON.stringify({
      ...(applicationSlug ? { applicationSlug } : {}),
      sessionId: currentSessionId,
      userAgent: navigator.userAgent,
      ...data,
    });

    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      navigator.sendBeacon("/api/analytics/track", payload);
    } else {
      void fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      });
    }
  }

  function handleScroll() {
    if (typeof window === "undefined") return;

    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;

    if (scrollHeight - clientHeight <= 0) return;

    const percentage = Math.round((scrollTop / (scrollHeight - clientHeight)) * 100);
    if (percentage > maxScrollDepthRef.current) {
      maxScrollDepthRef.current = Math.min(percentage, 100);
    }
  }

  function flushPageData(path: string, currentSessionId = sessionId) {
    if (!startTimeRef.current || !path) return;

    const dwellTime = Math.round((Date.now() - startTimeRef.current) / 1000);
    sendTrackingData(
      {
        path,
        dwellTime,
        scrollDepth: maxScrollDepthRef.current,
      },
      currentSessionId,
    );
  }

  useEffect(() => {
    if (typeof window === "undefined") return;

    const session = getOrInitializeSession();
    Promise.resolve().then(() => {
      setSessionId(session.id);
    });
    startTimeRef.current = Date.now();
    prevPathnameRef.current = window.location.pathname;

    if (session.isNew) {
      sendTrackingData(
        {
          isInitial: true,
          referrer: document.referrer || "direct",
        },
        session.id,
      );
    }

    window.addEventListener("scroll", handleScroll, { passive: true });

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        flushPageData(prevPathnameRef.current, session.id);
      } else {
        startTimeRef.current = Date.now();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount-only: inner functions reference stable refs
  }, []);

  useEffect(() => {
    if (!sessionId) return;

    if (prevPathnameRef.current && prevPathnameRef.current !== pathname) {
      flushPageData(prevPathnameRef.current);

      prevPathnameRef.current = pathname;
      maxScrollDepthRef.current = 0;
      startTimeRef.current = Date.now();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- flushPageData uses stable refs only
  }, [pathname, sessionId]);

  return null;
}
