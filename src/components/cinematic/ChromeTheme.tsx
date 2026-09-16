"use client";

import { useEffect } from "react";

/**
 * Flags the document as running dark site chrome while the cinematic route
 * is mounted, so the shared header and footer invert to match instead of
 * sitting on the dark page as a bright white bar. Cleared on unmount, so
 * every other route keeps the light chrome untouched.
 */
export default function ChromeTheme() {
  useEffect(() => {
    document.documentElement.dataset.chrome = "dark";
    return () => {
      delete document.documentElement.dataset.chrome;
    };
  }, []);

  return null;
}
