import Link from "next/link";
import { site } from "@/lib/content";

export const metadata = {
  title: "글쓰기"
};

export default function NewPostPage() {
  const writableCats = site.boardCategories.filter((c) => c.id !== "all" && c.id !== "notice");

  return (
    <>
      <section className="page-hero">
        <div className="content-wrap page-hero__inner">
          <div>
            <h1 className="page-hero__title">글쓰기</h1>
            <p className="page-hero__sub">말머리를 선택하고 본문을 작성해주세요. 광고·외부 거래는 즉시 삭제됩니다.</p>
          </div>
          <Link href="/board" className="btn btn--secondary btn--sm">
            ← 게시판
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="content-wrap" style={{ maxWidth: 820 }}>
          <form action="#" aria-label="글쓰기 폼" style={{ display: "grid", gap: "var(--sp-4)" }}>
            <div className="field">
              <label className="field__label" htmlFor="post-cat">말머리</label>
              <select id="post-cat" name="category" className="select" defaultValue={writableCats[0]?.id}>
                {writableCats.map((c) => (
                  <option key={c.id} value={c.id}>
                    [{c.label}]
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label className="field__label" htmlFor="post-title">제목</label>
              <input id="post-title" name="title" className="input" placeholder="제목을 입력하세요" maxLength={80} />
              <span className="field__hint">최대 80자</span>
            </div>

            <div className="field">
              <label className="field__label" htmlFor="post-body">본문</label>
              <textarea
                id="post-body"
                name="body"
                className="textarea"
                placeholder="질문일 경우 본인 레벨·직업·항마력·막힌 콘텐츠를 함께 적어주세요."
                rows={10}
              />
            </div>

            <div className="field">
              <label className="field__label" htmlFor="post-file">첨부 (선택)</label>
              <label className="file-input is-disabled" htmlFor="post-file">
                <span className="file-input__btn">파일 선택</span>
                <span className="file-input__hint">선택된 파일 없음</span>
                <input id="post-file" name="attachment" type="file" disabled title="백엔드 연동 전" />
              </label>
              <span className="field__hint">이미지 / 캡처 — 최대 5MB. 백엔드 연동 후 활성화됩니다.</span>
            </div>

            <div style={{ display: "flex", gap: "var(--sp-2)", justifyContent: "flex-end" }}>
              <Link href="/board" className="btn btn--ghost">
                취소
              </Link>
              <button type="submit" className="btn btn--primary" disabled title="백엔드 연동 전">
                등록 (준비중)
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
}
