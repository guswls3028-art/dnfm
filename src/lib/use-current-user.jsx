"use client";

// useCurrentUser — 현재 로그인 사용자 client hook + provider
// - mount 시 GET /auth/me 1회 호출
// - login / logout / refresh / setUser 노출
// - SiteHeader, signup, login, profile 등에서 공통 사용
//
// 의존성 최소화 — context API 만. lazy fetch.

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { apiFetch, ApiError } from "./api-client";

const CurrentUserContext = createContext(null);

const STATE = {
  LOADING: "loading",
  ANON: "anon",
  USER: "user",
  ERROR: "error",
};

export function CurrentUserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [state, setState] = useState(STATE.LOADING);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setState((prev) => (prev === STATE.USER ? STATE.USER : STATE.LOADING));
    try {
      const data = await apiFetch("/auth/me");
      if (data && data.user) {
        setUser(data.user);
        setState(STATE.USER);
        setError(null);
        return data.user;
      }
      setUser(null);
      setState(STATE.ANON);
      return null;
    } catch (err) {
      // 401 / 403 → 비로그인. 그 외는 error 상태로.
      if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
        setUser(null);
        setState(STATE.ANON);
        setError(null);
        return null;
      }
      setUser(null);
      setState(STATE.ERROR);
      setError(err);
      return null;
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = useCallback(
    async ({ username, password }) => {
      const data = await apiFetch("/auth/login/local", {
        method: "POST",
        json: { username, password },
      });
      if (data && data.user) {
        setUser(data.user);
        setState(STATE.USER);
        setError(null);
      }
      return data;
    },
    [],
  );

  const logout = useCallback(async () => {
    try {
      await apiFetch("/auth/logout", { method: "POST" });
    } catch (err) {
      // 실패해도 client state 는 비움 — 서버 쪽 stale 쿠키 케이스 대비
    }
    setUser(null);
    setState(STATE.ANON);
    setError(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      state,
      error,
      isLoading: state === STATE.LOADING,
      isAuthed: state === STATE.USER && Boolean(user),
      refresh,
      login,
      logout,
      setUser,
    }),
    [user, state, error, refresh, login, logout],
  );

  return <CurrentUserContext.Provider value={value}>{children}</CurrentUserContext.Provider>;
}

export function useCurrentUser() {
  const ctx = useContext(CurrentUserContext);
  if (!ctx) {
    // provider 외부에서 호출됐을 때의 안전한 default — render 깨짐 방지
    return {
      user: null,
      state: STATE.LOADING,
      error: null,
      isLoading: true,
      isAuthed: false,
      refresh: async () => null,
      login: async () => null,
      logout: async () => {},
      setUser: () => {},
    };
  }
  return ctx;
}

export const CURRENT_USER_STATE = STATE;
