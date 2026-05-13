import Link from "next/link";
import BoardRow from "@/components/BoardRow";
import { site } from "@/lib/content";

export const metadata = {
  title: "마이페이지"
};

export default function ProfilePage() {
  const me = site.profileMock;

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
          <div style={{ display: "flex", gap: "var(--sp-2)" }}>
            <Link href="/board/new" className="btn btn--primary btn--sm">
              글쓰기
            </Link>
            <button type="button" className="btn btn--ghost btn--sm" disabled title="백엔드 연동 전">
              로그아웃 (준비중)
            </button>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="content-wrap profile-grid">
          <div style={{ display: "grid", gap: "var(--sp-4)" }}>
            <article className="profile-card">
              <h2 className="profile-card__title">회원 정보</h2>
              <div className="profile-row">
                <span className="profile-row__label">닉네임</span>
                <span className="profile-row__value">{me.nickname}</span>
              </div>
              <div className="profile-row">
                <span className="profile-row__label">이메일</span>
                <span className="profile-row__value">{me.email}</span>
              </div>
              <div className="profile-row">
                <span className="profile-row__label">가입일</span>
                <span className="profile-row__value">{me.joinedAt}</span>
              </div>
              <div style={{ marginTop: "var(--sp-3)" }}>
                <button type="button" className="btn btn--secondary btn--sm" disabled title="백엔드 연동 전">
                  비밀번호 변경 (준비중)
                </button>
              </div>
            </article>

            <article className="profile-card">
              <h2 className="profile-card__title">던파 캐릭터</h2>
              <div className="profile-row">
                <span className="profile-row__label">캐릭터명</span>
                <span className="profile-row__value">{me.dnfCharacter.name}</span>
              </div>
              <div className="profile-row">
                <span className="profile-row__label">직업</span>
                <span className="profile-row__value">{me.dnfCharacter.job}</span>
              </div>
              <div className="profile-row">
                <span className="profile-row__label">레벨</span>
                <span className="profile-row__value">Lv.{me.dnfCharacter.level}</span>
              </div>
              <div className="profile-row">
                <span className="profile-row__label">모험단</span>
                <span className="profile-row__value">{me.dnfCharacter.adventure}</span>
              </div>
              <div className="profile-row">
                <span className="profile-row__label">서버</span>
                <span className="profile-row__value">{me.dnfCharacter.server}</span>
              </div>
              <div style={{ marginTop: "var(--sp-3)" }}>
                <Link href="/signup" className="btn btn--secondary btn--sm">
                  캐릭터 재인증 →
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
            <div className="board">
              <div className="board__rows">
                {me.myPosts.length === 0 ? (
                  <div className="board-row">
                    <span className="board-row__label">안내</span>
                    <span className="board-row__title">
                      <strong>아직 작성한 글이 없습니다.</strong>
                    </span>
                    <span className="board-row__meta">
                      <Link href="/board/new" style={{ color: "var(--color-gold)", fontWeight: 800 }}>
                        첫 글 쓰러 가기 →
                      </Link>
                    </span>
                  </div>
                ) : (
                  me.myPosts.map((post) => <BoardRow key={post.id} post={post} />)
                )}
              </div>
            </div>
          </section>
        </div>
      </section>
    </>
  );
}
