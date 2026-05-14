// 한국 친화 상대 시간 포맷 — board row / community board 등에서 사용.
// "방금 전" / "5분 전" / "3시간 전" / "어제" / "5월 14일" / "2026년 5월 14일".
// 비표준 입력(이미 "5분 전" 같은 사람 친화 문자열)은 그대로 통과.

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

function tryParseDate(input) {
  if (input instanceof Date) return Number.isNaN(input.getTime()) ? null : input;
  if (typeof input !== "string" || !input.trim()) return null;
  // ISO 8601 (e.g. 2026-05-14T00:06:15.587Z) 또는 epoch 숫자 문자열만 파싱.
  // 사람 친화 문자열("5분 전")은 NaN → 통과시킴.
  if (/^\d+$/.test(input)) {
    const num = Number(input);
    const d = new Date(num);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  if (/^\d{4}-\d{2}-\d{2}/.test(input) || /^\d{4}\/\d{2}\/\d{2}/.test(input)) {
    const d = new Date(input);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  return null;
}

export function formatRelativeKo(input, now = Date.now()) {
  if (!input) return "";
  const d = tryParseDate(input);
  if (!d) return String(input);

  const diff = now - d.getTime();
  if (diff < 0) {
    // 미래 시각 — 절대 표기.
    return formatAbsoluteShort(d);
  }
  if (diff < MINUTE) return "방금 전";
  if (diff < HOUR) return `${Math.floor(diff / MINUTE)}분 전`;
  if (diff < DAY) return `${Math.floor(diff / HOUR)}시간 전`;
  if (diff < 2 * DAY) return "어제";
  if (diff < 7 * DAY) return `${Math.floor(diff / DAY)}일 전`;
  return formatAbsoluteShort(d, now);
}

function formatAbsoluteShort(d, now = Date.now()) {
  const nowDate = new Date(now);
  const sameYear = d.getFullYear() === nowDate.getFullYear();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  if (sameYear) return `${m}월 ${day}일`;
  return `${d.getFullYear()}년 ${m}월 ${day}일`;
}

export function formatAbsoluteKo(input) {
  if (!input) return "";
  const d = tryParseDate(input);
  if (!d) return String(input);
  return formatAbsoluteShort(d);
}
