// api-client.js — dnfm 백엔드 (api.dnfm.kr) fetch wrapper
// - base URL: NEXT_PUBLIC_API_BASE 환경변수 → fallback https://api.dnfm.kr
// - credentials: "include" (쿠키 도메인 .dnfm.kr 공유)
// - 응답 envelope 자동 unwrap: {data}/{error} → data 반환, error 시 ApiError throw
// - timeout 15초 (AbortController)
//
// 사용 예:
//   const me = await apiFetch("/auth/me");
//   const res = await apiFetch("/auth/login/local", { method: "POST", json: { username, password } });

export const API_BASE =
  (typeof process !== "undefined" && process.env && process.env.NEXT_PUBLIC_API_BASE) ||
  "https://api.dnfm.kr";

const DEFAULT_TIMEOUT_MS = 15000;

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
  if (!path.startsWith("/")) path = "/" + path;
  return base.replace(/\/$/, "") + path;
}

/**
 * apiFetch
 * @param {string} path  — "/auth/me" 같은 상대 경로 또는 절대 URL
 * @param {object} init  — 표준 fetch init + 확장
 *   - json: object → JSON.stringify + Content-Type: application/json
 *   - form: FormData → multipart (Content-Type 직접 X — browser 가 boundary 처리)
 *   - timeoutMs: 기본 15000
 *   - raw: true → envelope unwrap 안 함 (res 객체 반환)
 * @returns {Promise<any>} envelope 의 data 필드. raw=true 면 Response.
 */
export async function apiFetch(path, init = {}) {
  const {
    json,
    form,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    raw = false,
    headers: extraHeaders,
    ...rest
  } = init;

  const headers = { Accept: "application/json", ...(extraHeaders || {}) };
  let body = rest.body;

  if (json !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(json);
  } else if (form !== undefined) {
    body = form; // browser 가 multipart boundary 자동 세팅
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  let res;
  try {
    res = await fetch(joinUrl(API_BASE, path), {
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
      throw new ApiError({ status: 0, code: "timeout", message: `요청 시간 초과 (${timeoutMs}ms)` });
    }
    throw new ApiError({ status: 0, code: "network", message: err?.message || "네트워크 오류" });
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
    // 비 JSON 응답 — 텍스트 한 번 비워줘서 connection leak 방지
    try {
      await res.text();
    } catch {}
  }

  if (!res.ok) {
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
