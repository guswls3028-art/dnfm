"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BoardRow from "@/components/BoardRow";
import { useCurrentUser } from "@/lib/use-current-user";
import { apiFetch, ApiError } from "@/lib/api-client";
import VerifiedBadge from "@/components/VerifiedBadge";

function safeString(v) {
  if (v === null || v === undefined) return "";
  return String(v);
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthed, isLoading, logout } = useCurrentUser();
  const [myPosts, setMyPosts] = useState(null);
  const [postsError, setPostsError] = useState(null);

  // 비로그인이라도 강제 redirect 하지 않고 안내 페이지 노출.
  // 사용자가 "마이페이지가 뭔지" 미리 보고 가입을 결정할 수 있게.

  useEffect(() => {
    if (!isAuthed) return;
    let cancelled = false;
    (async () => {
      try {
        const data = await apiFetch(`/sites/newb/posts?author=me&page=1&pageSize=10&sort=recent`);
        if (cancelled) return;
        const list = Array.isArray(data?.items)
          ? data.items
          : Array.isArray(data?.posts)
            ? data.posts
            : Array.isArray(data)
              ? data
              : [];
        setMyPosts(
          list.map((p) => ({
            id: p.id || p.postId,
            label: p.categoryName || p.categoryLabel || p.label || "글",
            title: p.title || "(제목 없음)",
            time: p.timeAgo || p.time || p.createdAt || "",
            comments:
              typeof p.commentsCount === "number"
                ? p.commentsCount
                : (p.commentCount ?? 0),
          })),
        );
      } catch (err) {
        if (cancelled) return;
        const friendly =
          err instanceof ApiError && err.status >= 500
            ? "잠시 후 다시 시도해 주세요."
            : "지금은 내 글 목록을 가져올 수 없어요.";
        setPostsError(friendly);
        setMyPosts([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isAuthed]);

  async function handleLogout() {
    await logout();
    router.push("/");
    router.refresh();
  }

  if (isLoading) {
    return (
      <>
        <section className="page-hero">
          <div className="content-wrap page-hero__inner">
            <div>
              <h1 className="page-hero__title">마이페이지</h1>
              <p className="page-hero__sub">로그인 정보를 확인하고 있어요.</p>
            </div>
          </div>
        </section>
        <section className="section">
          <div className="content-wrap">
            <p className="auth-msg auth-msg--info" style={{ margin: 0 }}>
              잠시만 기다려주세요…
            </p>
          </div>
        </section>
      </>
    );
  }

  if (!isAuthed || !user) {
    return (
      <>
        <section className="page-hero">
          <div className="content-wrap page-hero__inner">
            <div>
              <h1 className="page-hero__title">마이페이지</h1>
              <p className="page-hero__sub">
                로그인하면 톡방 닉네임 / 던파 캐릭터 / 내가 쓴 글을 한 자리에서 봅니다.
              </p>
            </div>
            <div style={{ display: "flex", gap: "var(--sp-2)" }}>
              <Link href="/signup" className="btn btn--primary btn--sm">
                입소 신청 →
              </Link>
              <Link href="/login?next=/profile" className="btn btn--secondary btn--sm">
                로그인
              </Link>
            </div>
          </div>
        </section>
        <section className="section">
          <div className="content-wrap profile-grid">
            <article className="profile-card">
              <h2 className="profile-card__title">가입하면 뭐가 보이나요?</h2>
              <ul className="profile-perk-list">
                <li>
                  <strong>회원 정보</strong>
                  <span>닉네임 · 가입일 · 카톡방 닉 동기화 상태</span>
                </li>
                <li>
                  <strong>던파 프로필</strong>
                  <span>모험단 · 대표 캐릭터 · 캡처 인증 여부</span>
                </li>
                <li>
                  <strong>내가 쓴 글 / 댓글</strong>
                  <span>게시판 활동을 한 자리에서 추적</span>
                </li>
                <li>
                  <strong>활동 기록</strong>
                  <span>가입 후 내가 쓴 글을 바로 확인</span>
                </li>
              </ul>
              <p className="auth-msg auth-msg--info" style={{ marginTop: "var(--sp-3)" }}>
                가입 시 던파 모바일 캐릭터 캡처 인증을 받습니다. 톡방 닉네임 형식은
                <strong> 자유 + 본캐 + 모험단</strong>.
              </p>
            </article>

            <article className="profile-card">
              <h2 className="profile-card__title">먼저 둘러볼까요?</h2>
              <div style={{ display: "grid", gap: "var(--sp-3)" }}>
                <Link href="/about" className="btn btn--secondary btn--sm">
                  훈련소 안내 → 톡방 철학 / 규칙
                </Link>
                <Link href="/guide" className="btn btn--secondary btn--sm">
                  가이드 보드 → 처음 시작 루트
                </Link>
                <Link href="/board" className="btn btn--secondary btn--sm">
                  커뮤니티 → 질문 · 팁 · 잡담
                </Link>
                <Link href="/events" className="btn btn--secondary btn--sm">
                  진행 이벤트 → 공식+톡방
                </Link>
              </div>
            </article>
          </div>
        </section>
      </>
    );
  }

  const dnf = user.dnfProfile || {};
  const verifiedBySelect = Boolean(user.verifiedBySelectScreen || dnf.verifiedBySelectScreen);

  return (
    <>
      <section className="page-hero">
        <div className="content-wrap page-hero__inner">
          <div>
            <h1 className="page-hero__title">마이페이지</h1>
            <p className="page-hero__sub">
              회원 정보와 던파 캐릭터 정보를 확인하고 수정합니다.
            </p>
          </div>
          <div style={{ display: "flex", gap: "var(--sp-2)", flexWrap: "wrap" }}>
            <Link href="/board/new" className="btn btn--primary btn--sm">
              글쓰기
            </Link>
            <Link href="/profile/edit" className="btn btn--ghost btn--sm">
              프로필 편집
            </Link>
            <Link href="/profile/password" className="btn btn--ghost btn--sm">
              비밀번호 변경
            </Link>
            <Link href="/profile/sessions" className="btn btn--ghost btn--sm">
              로그인 디바이스
            </Link>
            <Link href="/profile/delete" className="btn btn--ghost btn--sm">
              회원 탈퇴
            </Link>
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={handleLogout}
            >
              로그아웃
            </button>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="content-wrap profile-grid">
          <div style={{ display: "grid", gap: "var(--sp-4)" }}>
            {/^(google|kakao)_[a-f0-9]{4,}/i.test(user.displayName || "") ? (
              <article
                className="profile-card"
                style={{
                  borderColor: "var(--color-gold, #d4af37)",
                  borderWidth: 2,
                  borderStyle: "solid",
                  background: "rgba(212, 175, 55, 0.08)",
                }}
              >
                <h2 className="profile-card__title">닉네임을 설정해 주세요</h2>
                <p style={{ lineHeight: 1.7, marginTop: 8 }}>
                  소셜 로그인 후 임시 닉네임이 부여됐습니다. 본인의 닉네임으로 변경해 주세요.
                </p>
                <div style={{ marginTop: "var(--sp-3)" }}>
                  <Link href="/profile/edit" className="btn btn--primary btn--sm">
                    프로필 편집으로 가기 →
                  </Link>
                </div>
              </article>
            ) : null}
            <article className="profile-card">
              <h2 className="profile-card__title">회원 정보</h2>
              <div className="profile-row">
                <span className="profile-row__label">닉네임</span>
                <span className="profile-row__value">
                  {safeString(user.displayName)}
                  <VerifiedBadge verified={verifiedBySelect} size="md" />
                </span>
              </div>
              <div className="profile-row">
                <span className="profile-row__label">아이디</span>
                <span className="profile-row__value">{safeString(user.username)}</span>
              </div>
              {user.createdAt ? (
                <div className="profile-row">
                  <span className="profile-row__label">가입일</span>
                  <span className="profile-row__value">
                    {safeString(user.createdAt).slice(0, 10)}
                  </span>
                </div>
              ) : null}
            </article>

            <article className="profile-card">
              <h2 className="profile-card__title">던파 프로필</h2>
              {dnf.adventurerName || dnf.mainCharacterName ? (
                <>
                  {dnf.adventurerName ? (
                    <div className="profile-row">
                      <span className="profile-row__label">모험단</span>
                      <span className="profile-row__value">{safeString(dnf.adventurerName)}</span>
                    </div>
                  ) : null}
                  {dnf.mainCharacterName ? (
                    <div className="profile-row">
                      <span className="profile-row__label">대표 캐릭터</span>
                      <span className="profile-row__value">{safeString(dnf.mainCharacterName)}</span>
                    </div>
                  ) : null}
                  <div className="profile-row">
                    <span className="profile-row__label">인증</span>
                    <span className="profile-row__value">
                      {verifiedBySelect ? "선택창 캡처 확인 완료" : "선택창 캡처 미확인"}
                    </span>
                  </div>
                </>
              ) : (
                <p className="auth-msg auth-msg--info" style={{ margin: 0 }}>
                  아직 던파 프로필이 등록되지 않았습니다.
                </p>
              )}
              <div style={{ marginTop: "var(--sp-3)" }}>
                <Link href="/profile/verify" className="btn btn--secondary btn--sm">
                  모험단 인증 / 캐릭 목록 갱신 →
                </Link>
              </div>
            </article>
          </div>

          <section aria-labelledby="myposts-title">
            <header className="section__head">
              <div>
                <span className="section__kicker">MY POSTS</span>
                <h2 id="myposts-title" className="section__title">
                  내가 쓴 글
                </h2>
              </div>
              <Link href="/board" className="section__more">
                전체 게시판 →
              </Link>
            </header>
            {postsError ? (
              <p className="auth-msg auth-msg--error" role="alert">
                {postsError}
              </p>
            ) : null}
            <div className="board">
              <div className="board__rows">
                {myPosts === null ? (
                  <div className="board-row">
                    <span className="board-row__label">…</span>
                    <span className="board-row__title">
                      <strong>불러오는 중…</strong>
                    </span>
                    <span className="board-row__meta">잠시만 기다려주세요</span>
                  </div>
                ) : myPosts.length === 0 ? (
                  <div className="board-row">
                    <span className="board-row__label">안내</span>
                    <span className="board-row__title">
                      <strong>아직 작성한 글이 없습니다.</strong>
                    </span>
                    <span className="board-row__meta">
                      <Link
                        href="/board/new"
                        style={{ color: "var(--color-gold)", fontWeight: 800 }}
                      >
                        첫 글 쓰러 가기 →
                      </Link>
                    </span>
                  </div>
                ) : (
                  myPosts.map((post) => <BoardRow key={post.id} post={post} />)
                )}
              </div>
            </div>
          </section>
        </div>
      </section>
    </>
  );
}
