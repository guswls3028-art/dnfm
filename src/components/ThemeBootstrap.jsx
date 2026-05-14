"use client";

import { useEffect } from "react";

const VALID = new Set(["moonlight", "elvenguard", "campfire"]);
const KEY = "dnfm.hero.theme";

/**
 * 모든 페이지 mount 시 localStorage 의 마지막 hero 테마를
 * <html data-hero-theme> 으로 적용. home 외 페이지에서도 톤 일관.
 */
export default function ThemeBootstrap() {
  useEffect(() => {
    try {
      const v = window.localStorage.getItem(KEY);
      if (v && VALID.has(v)) {
        document.documentElement.setAttribute("data-hero-theme", v);
      }
    } catch {}
  }, []);
  return null;
}
