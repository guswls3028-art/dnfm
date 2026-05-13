"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import DnfProfileForm from "@/components/DnfProfileForm";
import { apiFetch, ApiError } from "@/lib/api-client";
import { useCurrentUser } from "@/lib/use-current-user";
import { site } from "@/lib/content";

const USERNAME_PATTERN = /^[a-zA-Z0-9_]{3,32}$/;

function classifyAvailability(state) {
  if (state.status === "checking")
    return { cls: "field__status--checking", icon: "⏳", text: "확인 중…" };
  if (state.status === "ok")
    return { cls: "field__status--ok", icon: "✓", text: "사용 가능합니다" };
  if (state.status === "taken")
    return { cls: "field__status--bad", icon: "✗", text: "이미 사용 중입니다" };
  if (state.status === "invalid")
    return { cls: "field__status--bad", icon: "✗", text: state.message || "형식이 올바르지 않습니다" };
  if (state.status === "error")
    return { cls: "field__status--bad", icon: "!", text: state.message || "확인 실패" };
  return null;
}

function useDebouncedAvailability(value, paramName, validator) {
  const [state, setState] = useState({ status: "idle" });
  const timerRef = useRef(null);
  const reqIdRef = useRef(0);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (!value) {
      setState({ status: "idle" });
      return;
    }

    const validationError = validator ? validator(value) : null;
    if (validationError) {
      setState({ status: "invalid", message: validationError });
      return;
    }

    setState({ status: "checking" });
    const myReqId = ++reqIdRef.current;

    timerRef.current = setTimeout(async () => {
      try {
        const data = await apiFetch(
          `/auth/check-availability?${paramName}=${encodeURIComponent(value)}`,
        );
        if (reqIdRef.current !== myReqId) return; // stale
        if (data && data.available === true) {
          setState({ status: "ok" });
        } else {
          setState({ status: "taken" });
        }
      } catch (err) {
        if (reqIdRef.current !== myReqId) return;
        setState({
          status: "error",
          message: err && err.message ? err.message : "확인 실패",
        });
      }
    }, 500);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [value, paramName, validator]);

  return state;
}

function validateUsername(v) {
  if (!USERNAME_PATTERN.test(v)) return "영문/숫자/언더스코어 3~32자";
  return null;
}

function validateDisplayName(v) {
  const trimmed = v.trim();
  if (trimmed.length < 1) return "닉네임을 입력해주세요";
  if (trimmed.length > 32) return "32자 이하로 입력해주세요";
  return null;
}

export default function SignupPage() {
  const router = useRouter();
  const { setUser, refresh } = useCurrentUser();

  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [results, setResults] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState(null);

  // 비밀번호 일치 inline 표시.
  const passwordMatch = useMemo(() => {
    if (!password || !password2) return null;
    return password === password2 ? "ok" : "mismatch";
  }, [password, password2]);

  const usernameState = useDebouncedAvailability(username, "username", validateUsername);
  const displayNameState = useDebouncedAvailability(
    displayName,
    "displayName",
    validateDisplayName,
  );

  const canProceedStep1 = useMemo(() => {
    if (!username || !password || !password2 || !displayName) return false;
    if (password.length < 4) return false;
    if (password !== password2) return false;
    if (usernameState.status !== "ok") return false;
    if (displayNameState.status !== "ok") return false;
    return true;
  }, [
    username,
    password,
    password2,
    displayName,
    usernameState.status,
    displayNameState.status,
  ]);

  function handleNext(e) {
    e.preventDefault();
    setGlobalError(null);
    if (!canProceedStep1) {
      setGlobalError("입력값을 확인해주세요. (아이디/닉네임 중복 확인 및 비밀번호 4자 이상)");
      return;
    }
    setStep(2);
  }

  function buildDnfProfile() {
    // results: { char: {result, editedFields}, gear: {...}, guild: {...} }
    const charEntry = results.char;
    const gearEntry = results.gear;
    const guildEntry = results.guild;

    const pick = (entry, key) => {
      if (!entry) return undefined;
      const edited = entry.editedFields?.[key];
      if (edited !== undefined && edited !== "") return edited;
      const raw = entry.result?.[key];
      if (raw) return raw;
      return undefined;
    };

    const profile = {
      adventurerName: pick(charEntry, "adventurerName"),
      mainCharacterName:
        pick(guildEntry, "selectedCharacterName") ||
        pick(charEntry, "mainCharacterName"),
      ocr: {
        basicInfo: charEntry
          ? { result: charEntry.result, source: charEntry.source, edited: charEntry.editedFields || {} }
          : null,
        characterList: gearEntry
          ? { result: gearEntry.result, source: gearEntry.source, edited: gearEntry.editedFields || {} }
          : null,
        characterSelect: guildEntry
          ? { result: guildEntry.result, source: guildEntry.source, edited: guildEntry.editedFields || {} }
          : null,
      },
    };

    return profile;
  }

  async function handleFinalSubmit() {
    if (submitting) return;
    setGlobalError(null);

    const missing = ["char", "gear", "guild"].filter((id) => !results[id]);
    if (missing.length > 0) {
      setGlobalError("던파 캡처 3종을 모두 업로드해주세요. (자동 인식 결과는 수정 가능합니다)");
      return;
    }

    setSubmitting(true);
    try {
      const dnfProfile = buildDnfProfile();

      // 1) signup — dnfProfile 포함. 백엔드는 쿠키 set.
      const signupData = await apiFetch("/auth/signup/local", {
        method: "POST",
        json: {
          username: username.trim(),
          password,
          displayName: displayName.trim(),
          dnfProfile,
        },
      });

      // 2) confirm — verifiedBySelectScreen 갱신 (선택 화면 OCR 도 같이 보냄)
      try {
        await apiFetch("/auth/dnf-profile/confirm", {
          method: "POST",
          json: { dnfProfile },
        });
      } catch (confirmErr) {
        // confirm 실패해도 회원 자체는 생성됨 — 안내 후 진행
        console.warn("dnf-profile confirm failed:", confirmErr);
      }

      if (signupData?.user) {
        setUser(signupData.user);
      } else {
        await refresh();
      }

      router.push("/profile");
      router.refresh();
    } catch (err) {
      const msg =
        err instanceof ApiError
          ? err.message
          : err?.message || "가입 처리에 실패했습니다. 잠시 후 다시 시도해주세요.";
      setGlobalError(msg);
      setSubmitting(false);
    }
  }

  const usernameMsg = classifyAvailability(usernameState);
  const displayNameMsg = classifyAvailability(displayNameState);

  return (
    <>
      <section className="page-hero">
        <div className="content-wrap page-hero__inner">
          <div>
            <h1 className="page-hero__title">훈련소 입소 신청</h1>
            <p className="page-hero__sub">
              1단계 기본 정보 → 2단계 던파 캡처 3장 (자동 인식) → 가입 완료.
            </p>
          </div>
          <Link href="/login" className="btn btn--secondary btn--sm">
            이미 회원이면 로그인 →
          </Link>
        </div>
      </section>

      <section className="section">
        <div
          className="content-wrap"
          style={{ display: "grid", gap: "var(--sp-6)" }}
        >
          {step === 1 ? (
            <div className="auth-card" style={{ maxWidth: "none" }}>
              <h2 className="auth-card__title" style={{ fontSize: "var(--fs-2xl)" }}>
                1단계 · 기본 정보
              </h2>
              <p className="auth-card__sub">
                아이디 · 비밀번호 · 닉네임. 그게 전부입니다. 던파 정보(모험단/캐릭터)는 2단계 캡처에서 자동 인식.
              </p>
              <form
                className="signup-steps"
                aria-label="가입 기본정보"
                onSubmit={handleNext}
                noValidate
              >
                <div className="field">
                  <label className="field__label" htmlFor="su-username">
                    아이디 <span className="field__req">*</span>
                  </label>
                  <input
                    id="su-username"
                    name="username"
                    className="input"
                    placeholder="영문/숫자/언더스코어 3~32자"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                  <span className="field__hint">로그인 ID. 가입 후 변경 불가.</span>
                  {usernameMsg ? (
                    <span className={`field__status ${usernameMsg.cls}`}>
                      <span aria-hidden="true">{usernameMsg.icon}</span> {usernameMsg.text}
                    </span>
                  ) : null}
                </div>
                <div className="field">
                  <label className="field__label" htmlFor="su-pw">
                    비밀번호 <span className="field__req">*</span>
                  </label>
                  <input
                    id="su-pw"
                    name="password"
                    type="password"
                    className="input"
                    placeholder="4자 이상"
                    minLength={4}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span className="field__hint">최소 4자. 학생/뉴비 사용 고려해 너무 까다롭지 않게.</span>
                  {password && password.length < 4 ? (
                    <span className="field__status field__status--bad">
                      <span aria-hidden="true">✗</span> 4자 이상 입력해주세요
                    </span>
                  ) : password && password.length >= 4 ? (
                    <span className="field__status field__status--ok">
                      <span aria-hidden="true">✓</span> 길이 충족
                    </span>
                  ) : null}
                </div>
                <div className="field">
                  <label className="field__label" htmlFor="su-pw2">
                    비밀번호 확인 <span className="field__req">*</span>
                  </label>
                  <input
                    id="su-pw2"
                    name="password2"
                    type="password"
                    className="input"
                    placeholder="비밀번호 다시 입력"
                    autoComplete="new-password"
                    value={password2}
                    onChange={(e) => setPassword2(e.target.value)}
                  />
                  <span className="field__hint">오타 방지용. 위 비밀번호와 같게 입력.</span>
                  {passwordMatch === "ok" ? (
                    <span className="field__status field__status--ok">
                      <span aria-hidden="true">✓</span> 일치합니다
                    </span>
                  ) : passwordMatch === "mismatch" ? (
                    <span className="field__status field__status--bad">
                      <span aria-hidden="true">✗</span> 비밀번호가 다릅니다
                    </span>
                  ) : null}
                </div>
                <div className="field">
                  <label className="field__label" htmlFor="su-nick">
                    닉네임 <span className="field__req">*</span>
                  </label>
                  <input
                    id="su-nick"
                    name="displayName"
                    className="input"
                    placeholder="예: 시너지통 / (뉴비)지금간다"
                    maxLength={32}
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                  />
                  <span className="field__hint">사이트·톡방에서 보일 이름. 자유.</span>
                  {displayNameMsg ? (
                    <span className={`field__status ${displayNameMsg.cls}`}>
                      <span aria-hidden="true">{displayNameMsg.icon}</span> {displayNameMsg.text}
                    </span>
                  ) : null}
                </div>

                {globalError ? (
                  <p className="auth-msg auth-msg--error" role="alert">
                    {globalError}
                  </p>
                ) : null}

                <button
                  type="submit"
                  className="btn btn--primary btn--lg"
                  disabled={!canProceedStep1}
                >
                  다음 단계 →
                </button>
              </form>
            </div>
          ) : (
            <>
              <div className="auth-card" style={{ maxWidth: "none" }}>
                <h2 className="auth-card__title" style={{ fontSize: "var(--fs-2xl)" }}>
                  2단계 · 던파 인증
                </h2>
                <p className="auth-card__sub" style={{ marginBottom: "var(--sp-4)" }}>
                  ① <strong>기본정보 캡처</strong> → 모험단명 + 대표 캐릭터 자동 추출
                  <br />
                  ② <strong>보유캐릭터 캡처</strong> → 캐릭터 목록 자동 추출
                  <br />
                  ③ <strong>캐릭터 선택창 캡처</strong> → 본인 인증 (② 캐릭과 cross-check)
                </p>
                <p className="auth-msg auth-msg--info">
                  자동 인식 결과는 수정 가능합니다. 인식이 부정확하면 직접 고쳐주세요.
                </p>

                <DnfProfileForm
                  steps={site.signupSteps}
                  initialResults={results}
                  onResultsChange={setResults}
                />

                {globalError ? (
                  <p className="auth-msg auth-msg--error" role="alert" style={{ marginTop: "var(--sp-4)" }}>
                    {globalError}
                  </p>
                ) : null}

                <div style={{ display: "flex", gap: "var(--sp-2)", marginTop: "var(--sp-5)" }}>
                  <button
                    type="button"
                    className="btn btn--ghost"
                    onClick={() => setStep(1)}
                    disabled={submitting}
                  >
                    ← 1단계로
                  </button>
                  <button
                    type="button"
                    className="btn btn--primary btn--lg"
                    onClick={handleFinalSubmit}
                    disabled={submitting}
                  >
                    {submitting ? "가입 처리 중…" : "가입 완료"}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
