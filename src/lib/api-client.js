/**
 * api-client.js — dnfm.kr (newb) → api.dnfm.kr
 *
 * 공통 fetch wrapper.
 *   - base = NEXT_PUBLIC_API_BASE 또는 https://api.dnfm.kr (prod 기본)
 *   - credentials: "include" — 쿠키 도메인은 .dnfm.kr 이라 sibling subdomain 공유
 *   - JSON body / multipart 자동 처리
 *   - 응답 envelope `{ data }` 자동 unwrap, `{ error: {code,message,details} }` → ApiError throw
 *   - timeout 15s (AbortController)
 *
 * 두 frontend (newb / hurock) 모두 같은 backend (`api.dnfm.kr`) 호출 — wrapper shape 도 같게 유지.
 * 차이는 SITE 상수와 content.js (정적 콘텐츠 SSOT) 뿐.
 */

const DEFAULT_BASE = "https://api.dnfm.kr";
const SITE = "newb";
const DEFAULT_TIMEOUT_MS = 15_000;

function resolveBase() {
  if (typeof process !== "undefined" && process.env && process.env.NEXT_PUBLIC_API_BASE) {
    return process.env.NEXT_PUBLIC_API_BASE.replace(/\/+$/, "");
  }
  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    if (host === "localhost" || host === "127.0.0.1") return "/api";
  }
  return DEFAULT_BASE;
}

export const API_BASE = resolveBase();

export class ApiError extends Error {
  constructor({ status, code, message, details, raw }) {
    super(message || `API error ${status}`);
    this.name = "ApiError";
    this.status = status;
    this.code = code || null;
    this.details = details || null;
    this.raw = raw;
  }
}

function joinUrl(base, path) {
  if (/^https?:\/\//i.test(path)) return path;
  const p = path.startsWith("/") ? path : `/${path}`;
  return base.replace(/\/$/, "") + p;
}

function buildQuery(query) {
  if (!query) return "";
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) {
    if (v === undefined || v === null || v === "") continue;
    qs.set(k, String(v));
  }
  const s = qs.toString();
  return s ? `?${s}` : "";
}

let refreshPromise = null;

function canRetryAfterRefresh(path, { skipAuthRefresh, raw }) {
  if (skipAuthRefresh || raw) return false;
  const p = String(path || "").split("?")[0];
  if (p.startsWith("/auth/login")) return false;
  if (p.startsWith("/auth/signup")) return false;
  if (p.startsWith("/auth/refresh")) return false;
  if (p.startsWith("/auth/logout")) return false;
  if (p.startsWith("/auth/oauth")) return false;
  return true;
}

async function refreshAuthSession() {
  if (!refreshPromise) {
    refreshPromise = fetch(joinUrl(API_BASE, "/auth/refresh"), {
      method: "POST",
      credentials: "include",
      headers: { Accept: "application/json" },
    })
      .then(async (res) => {
        if (!res.ok) return false;
        const ct = res.headers.get("content-type") || "";
        if (!ct.includes("application/json")) return false;
        const payload = await res.json().catch(() => null);
        const data = payload && Object.prototype.hasOwnProperty.call(payload, "data")
          ? payload.data
          : payload;
        return Boolean(data?.user);
      })
      .catch(() => false)
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

/**
 * 저수준 호출. envelope `{data}` 자동 unwrap.
 */
export async function apiFetch(path, init = {}) {
  const {
    json,
    form,
    query,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    raw = false,
    skipAuthRefresh = false,
    headers: extraHeaders,
    ...rest
  } = init;

  const url = joinUrl(API_BASE, path) + buildQuery(query);
  const headers = { Accept: "application/json", ...(extraHeaders || {}) };
  let body = rest.body;

  if (json !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(json);
  } else if (form !== undefined) {
    body = form;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  let res;
  try {
    res = await fetch(url, {
      method: rest.method || (body ? "POST" : "GET"),
      credentials: "include",
      headers,
      body,
      signal: controller.signal,
      ...(rest.cache ? { cache: rest.cache } : {}),
    });
  } catch (err) {
    clearTimeout(timer);
    if (err && err.name === "AbortError") {
      throw new ApiError({
        status: 0,
        code: "timeout",
        message: `요청 시간 초과 (${timeoutMs}ms)`,
      });
    }
    throw new ApiError({
      status: 0,
      code: "network",
      message: err?.message || "네트워크 오류",
    });
  } finally {
    clearTimeout(timer);
  }

  if (raw) return res;

  let payload = null;
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    try {
      payload = await res.json();
    } catch {
      payload = null;
    }
  } else {
    try {
      await res.text();
    } catch {}
  }

  if (!res.ok) {
    if (res.status === 401 && canRetryAfterRefresh(path, { skipAuthRefresh, raw })) {
      const refreshed = await refreshAuthSession();
      if (refreshed) {
        return apiFetch(path, { ...init, skipAuthRefresh: true });
      }
    }

    const errBody = payload && payload.error ? payload.error : null;
    throw new ApiError({
      status: res.status,
      code: errBody?.code || `http_${res.status}`,
      message: errBody?.message || `요청 실패 (${res.status})`,
      details: errBody?.details || null,
      raw: payload,
    });
  }

  if (payload && Object.prototype.hasOwnProperty.call(payload, "data")) {
    return payload.data;
  }
  return payload;
}

export function buildApiUrl(path) {
  return joinUrl(API_BASE, path);
}

/* ---------- Auth ---------- */

export const auth = {
  me: () => apiFetch("/auth/me"),
  logout: () => apiFetch("/auth/logout", { method: "POST" }),
  loginLocal: ({ username, password, rememberMe = true }) =>
    apiFetch("/auth/login/local", { method: "POST", json: { username, password, rememberMe } }),
  signupLocal: ({ username, password, displayName, dnfProfile, acceptedTerms, rememberMe = true }) =>
    apiFetch("/auth/signup/local", {
      method: "POST",
      json: { username, password, displayName, dnfProfile, acceptedTerms, rememberMe },
    }),
  checkAvailability: ({ username, displayName }) =>
    apiFetch("/auth/check-availability", { query: { username, displayName } }),
  refresh: () => apiFetch("/auth/refresh", { method: "POST" }),
  ocrDnfProfile: ({ type, file, fileUrl }) => {
    if (file) {
      const fd = new FormData();
      fd.append("file", file);
      return apiFetch(`/auth/dnf-profile/ocr/${type}`, { method: "POST", form: fd });
    }
    return apiFetch(`/auth/dnf-profile/ocr/${type}`, {
      method: "POST",
      json: { fileUrl },
    });
  },
  /** 통합 OCR — 여러 파일을 한 번에 올리면 backend 가 자동 분류·머지. */
  ocrAuto: (files) => {
    const fd = new FormData();
    files.forEach((f, i) => fd.append(`image${i + 1}`, f));
    return apiFetch("/auth/dnf-profile/ocr/auto", {
      method: "POST",
      form: fd,
      timeoutMs: 180000,
    });
  },
  confirmDnfProfile: (data) =>
    apiFetch("/auth/dnf-profile/confirm", { method: "POST", json: data }),
  updateMe: (data) => apiFetch("/auth/me", { method: "PATCH", json: data }),
  changePassword: ({ currentPassword, newPassword }) =>
    apiFetch("/auth/change-password", {
      method: "POST",
      json: { currentPassword, newPassword },
    }),
  deleteAccount: ({ password }) =>
    apiFetch("/auth/me", { method: "DELETE", json: { password } }),
  sessions: () => apiFetch("/auth/sessions"),
  revokeSession: (id) => apiFetch(`/auth/sessions/${id}`, { method: "DELETE" }),
  revokeOtherSessions: () =>
    apiFetch("/auth/sessions/revoke-others", { method: "POST" }),
  unlinkOAuth: (provider) => apiFetch(`/auth/oauth/${provider}/link`, { method: "DELETE" }),
  // super 권한 — 자체 가입자 비번 reset. 응답: { tempPassword, userId, displayName }
  adminResetPassword: ({ username }) =>
    apiFetch("/auth/admin/reset-password", {
      method: "POST",
      json: { username },
    }),
};

/* ---------- Posts (board) ---------- */

const sitePath = (path) => `/sites/${SITE}${path}`;

export const posts = {
  categories: () => apiFetch(sitePath("/categories")),
  list: ({ categoryId, categorySlug, flair, postType, bestOnly, q, page, pageSize, sort } = {}) =>
    apiFetch(sitePath("/posts"), {
      query: { categoryId, categorySlug, flair, postType, bestOnly, q, page, pageSize, sort },
    }),
  detail: (id) => apiFetch(sitePath(`/posts/${id}`)),
  create: ({
    categoryId,
    categorySlug,
    title,
    body,
    bodyFormat,
    flair,
    postType,
    attachmentR2Keys,
    guestNickname,
    guestPassword,
  }) =>
    apiFetch(sitePath("/posts"), {
      method: "POST",
      json: {
        categoryId,
        categorySlug,
        title,
        body,
        bodyFormat,
        flair,
        postType,
        attachmentR2Keys,
        guestNickname,
        guestPassword,
      },
    }),
  update: (id, input) =>
    apiFetch(sitePath(`/posts/${id}`), { method: "PATCH", json: input }),
  remove: (id, { guestPassword } = {}) =>
    apiFetch(sitePath(`/posts/${id}`), {
      method: "DELETE",
      json: { guestPassword },
    }),
  // voteType: "recommend" | "downvote" (backend postVoteTypes enum)
  vote: (id, voteType) =>
    apiFetch(sitePath(`/posts/${id}/vote`), { method: "POST", json: { voteType } }),
};

/* ---------- Comments ---------- */

export const comments = {
  list: (postId, { page, pageSize } = {}) =>
    apiFetch(sitePath(`/posts/${postId}/comments`), { query: { page, pageSize } }),
  mine: ({ page, pageSize } = {}) =>
    apiFetch(sitePath("/me/comments"), { query: { page, pageSize } }),
  create: (postId, { body, parentId, guestNickname, guestPassword }) =>
    apiFetch(sitePath(`/posts/${postId}/comments`), {
      method: "POST",
      json: { body, parentId, guestNickname, guestPassword },
    }),
  update: (id, { body, guestPassword } = {}) =>
    apiFetch(sitePath(`/comments/${id}`), {
      method: "PATCH",
      json: { body, guestPassword },
    }),
  remove: (id, { guestPassword } = {}) =>
    apiFetch(sitePath(`/comments/${id}`), {
      method: "DELETE",
      json: { guestPassword },
    }),
};

/* ---------- Reports (신고) ---------- */

export const reports = {
  create: ({ targetType, targetId, reason, detail }) =>
    apiFetch(sitePath("/reports"), {
      method: "POST",
      json: { targetType, targetId, reason, detail },
    }),
  list: ({ status, targetType, page, pageSize } = {}) =>
    apiFetch(sitePath("/reports"), {
      query: { status, targetType, page, pageSize },
    }),
  update: (id, { status, resolution, resolutionNote, moderatorMemo }) =>
    apiFetch(sitePath(`/reports/${id}`), {
      method: "PATCH",
      json: { status, resolution, resolutionNote, moderatorMemo },
    }),
};

/* ---------- Uploads (R2 presigned PUT) ----------
   backend dto: { purpose: "avatar"|"dnf_capture"|"contest_entry"|"post_attachment",
                  contentType, sizeBytes }
   응답: { uploadId, putUrl, r2Key }
*/

export const uploads = {
  presignedPut: ({ purpose, contentType, sizeBytes }) =>
    apiFetch("/uploads/presigned-put", {
      method: "POST",
      json: { purpose, contentType, sizeBytes },
    }),
  confirm: (id, { sizeBytes } = {}) =>
    apiFetch(`/uploads/${id}/confirm`, { method: "POST", json: { sizeBytes } }),
  /** multipart 직접 업로드 — backend proxy (R2 CORS 회피용). */
  uploadFile: ({ file, purpose }) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("purpose", purpose);
    return apiFetch("/uploads/file", { method: "POST", form: fd });
  },
};

/* ---------- Hero banners (admin CRUD) ---------- */

export const heroBanners = {
  list: ({ includeInactive } = {}) =>
    apiFetch(sitePath("/hero-banners"), {
      query: { includeInactive: includeInactive ? "1" : undefined },
    }),
  create: ({ imageUrl, linkUrl, label, sortOrder, active }) =>
    apiFetch(sitePath("/hero-banners"), {
      method: "POST",
      json: { imageUrl, linkUrl, label, sortOrder, active },
    }),
  update: (id, input) =>
    apiFetch(sitePath(`/hero-banners/${id}`), { method: "PATCH", json: input }),
  remove: (id) =>
    apiFetch(sitePath(`/hero-banners/${id}`), { method: "DELETE" }),
};

/* ---------- OAuth helpers ---------- */

function oauthStart(provider, returnTo = "/", { rememberMe = true, mode = "login" } = {}) {
  const qs = new URLSearchParams({
    site: SITE,
    returnTo,
    rememberMe: rememberMe ? "1" : "0",
  });
  if (mode) qs.set("mode", mode);
  return `${API_BASE}/auth/oauth/${provider}/start?${qs.toString()}`;
}

export const oauth = {
  googleStart: (returnTo = "/", options) => oauthStart("google", returnTo, options),
  kakaoStart: (returnTo = "/", options) => oauthStart("kakao", returnTo, options),
  googleLink: (returnTo = "/profile") => oauthStart("google", returnTo, { mode: "link" }),
  kakaoLink: (returnTo = "/profile") => oauthStart("kakao", returnTo, { mode: "link" }),
};
