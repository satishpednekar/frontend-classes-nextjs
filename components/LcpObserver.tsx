"use client";

import { useEffect } from "react";

export default function LcpObserver() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("PerformanceObserver" in window)) return;

    let lcpValue = 0;
    let reported = false;

    const performanceObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1] as any;
      if (!lastEntry) return;
      lcpValue =
        lastEntry.renderTime || lastEntry.loadTime || lastEntry.startTime || 0;
    });

    try {
      // buffered ensures we get entries that occurred before the observer was added
      performanceObserver.observe({ type: "largest-contentful-paint", buffered: true } as PerformanceObserverInit);
    } catch (error) {
      return;
    }

    const report = () => {
      if (reported) return;
      reported = true;
      if (lcpValue > 0) {
        const value = Math.round(lcpValue);
        // eslint-disable-next-line no-console
        console.log("LCP", value);
        const gtag = (window as any).gtag;
        if (typeof gtag === "function") {
          gtag("event", "web_vitals", {
            name: "LCP",
            value,
            event_category: "Web Vitals",
            non_interaction: true
          });
        }
      }
      performanceObserver.disconnect();
      window.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pagehide", onVisibilityChange);
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        report();
      }
    };

    window.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("pagehide", onVisibilityChange);

    return () => {
      performanceObserver.disconnect();
      window.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pagehide", onVisibilityChange);
    };
  }, []);

  return null;
}

