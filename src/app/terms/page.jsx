export const metadata = {
  title: "이용약관 — 던파 모바일 뉴비 훈련소",
};

export default function TermsPage() {
  return (
    <>
      <section className="page-hero">
        <div className="content-wrap page-hero__inner">
          <div>
            <h1 className="page-hero__title">이용약관</h1>
            <p className="page-hero__sub">최종 개정일: 2026-05-14</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div
          className="content-wrap"
          style={{ display: "grid", gap: "var(--sp-5)", lineHeight: 1.8 }}
        >
          <section className="profile-card">
            <h2 className="profile-card__title">제1조 (목적)</h2>
            <p>
              본 약관은 던파 모바일 뉴비 훈련소(<strong>dnfm.kr</strong>, 이하 &ldquo;서비스&rdquo;)가
              제공하는 카톡방 운영·게시판·이벤트 서비스 이용에 있어 서비스와 이용자의
              권리·의무 및 책임사항을 규정합니다.
            </p>
          </section>

          <section className="profile-card">
            <h2 className="profile-card__title">제2조 (정의)</h2>
            <ul>
              <li>
                <strong>회원</strong>: 본 약관에 동의하고 가입하여 아이디를 부여받은 자.
              </li>
              <li>
                <strong>비회원</strong>: 가입 없이 임시 닉네임·임시 비밀번호로 글·댓글을 작성하는 자.
              </li>
              <li>
                <strong>콘텐츠</strong>: 회원/비회원이 서비스에 게시한 글·이미지·댓글 일체.
              </li>
            </ul>
          </section>

          <section className="profile-card">
            <h2 className="profile-card__title">제3조 (회원 가입)</h2>
            <ul>
              <li>아이디·비밀번호·닉네임 입력으로 가입이 완료됩니다.</li>
              <li>비밀번호는 최소 4자 이상이며, bcrypt 해시로만 저장됩니다.</li>
              <li>OAuth(구글·카카오) 가입 시 외부 제공자의 식별자만 저장됩니다.</li>
              <li>가입 시 던파 모바일 캐릭터 캡처 인증(선택)을 진행할 수 있습니다.</li>
            </ul>
          </section>

          <section className="profile-card">
            <h2 className="profile-card__title">제4조 (계정 보안)</h2>
            <ul>
              <li>비밀번호 관리는 회원 본인의 책임입니다.</li>
              <li>마이페이지에서 로그인 디바이스 목록을 확인·개별 로그아웃 가능합니다.</li>
              <li>비밀번호 변경 시 모든 디바이스 세션이 즉시 무효화됩니다.</li>
            </ul>
          </section>

          <section className="profile-card">
            <h2 className="profile-card__title">제5조 (콘텐츠의 권리·책임)</h2>
            <ul>
              <li>회원/비회원이 작성한 콘텐츠의 저작권은 작성자에게 있습니다.</li>
              <li>
                서비스는 운영 목적(노출·검색·아카이브)에 한해 비독점·무상으로 콘텐츠를 사용할 수 있습니다.
              </li>
              <li>
                타인의 권리를 침해하거나 법령에 위반되는 콘텐츠는 사전 통지 없이 비공개·삭제될 수 있습니다.
              </li>
            </ul>
          </section>

          <section className="profile-card">
            <h2 className="profile-card__title">제6조 (회원 탈퇴 / 자격 상실)</h2>
            <ul>
              <li>
                마이페이지 &gt; 회원 탈퇴에서 언제든 탈퇴할 수 있습니다.
                탈퇴 시 작성 콘텐츠는 익명화 보존되며, 본문은 게시판 맥락 유지를 위해 남을 수 있습니다.
              </li>
              <li>
                아이디·닉네임·비밀번호 해시·OAuth 식별자·세션은 즉시 삭제됩니다.
              </li>
              <li>
                약관을 중대하게 위반한 회원은 운영진 판단으로 자격이 정지·박탈될 수 있습니다.
              </li>
            </ul>
          </section>

          <section className="profile-card">
            <h2 className="profile-card__title">제7조 (서비스 면책)</h2>
            <ul>
              <li>
                본 서비스는 비영리 카톡방 부속 커뮤니티이며, 천재지변·시스템 장애로 인한
                일시 중단에 대해 책임을 지지 않습니다.
              </li>
              <li>회원 간 분쟁에 대해 서비스는 중재 책임을 지지 않습니다.</li>
            </ul>
          </section>

          <section className="profile-card">
            <h2 className="profile-card__title">제8조 (약관 변경)</h2>
            <p>
              약관 변경 시 서비스 공지 또는 마이페이지를 통해 사전 안내합니다.
              변경 후 계속 이용은 변경 약관에 대한 동의로 간주됩니다.
            </p>
          </section>

          <section className="profile-card">
            <h2 className="profile-card__title">제9조 (문의)</h2>
            <p>본 약관에 관한 문의는 톡방장을 통해 가능합니다.</p>
          </section>
        </div>
      </section>
    </>
  );
}
