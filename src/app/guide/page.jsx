import Link from "next/link";
import GuideCard from "@/components/GuideCard";
import { guideCommand, site } from "@/lib/content";

export const metadata = {
  title: "가이드",
};

export default function GuidePage() {
  return (
    <>
      <section className="page-hero">
        <div className="content-wrap page-hero__inner">
          <div>
            <h1 className="page-hero__title">가이드</h1>
            <p className="page-hero__sub">
              톡방 채팅창에 명령어 하나로 가이드 카드. 자체 가이드 보드는 점차 채워집니다.
            </p>
          </div>
          <Link href="/board?category=tip" className="btn btn--secondary btn--sm">
            팁 모음 →
          </Link>
        </div>
      </section>

      <section className="section section--guide-cmd" aria-labelledby="cmd-title">
        <div className="content-wrap">
          <header className="section__head">
            <div>
              <span className="section__kicker">GUIDE COMMAND</span>
              <h2 id="cmd-title" className="section__title">
                톡방 가이드 명령어
              </h2>
            </div>
          </header>
          <div className="guide-cmd">
            <code className="guide-cmd__code">{guideCommand.trigger}</code>
            <p className="guide-cmd__note">{guideCommand.note}</p>
            <small className="guide-cmd__author">작성: {guideCommand.author}</small>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="guide-board-title">
        <div className="content-wrap">
          <header className="section__head">
            <div>
              <span className="section__kicker">GUIDE BOARD</span>
              <h2 id="guide-board-title" className="section__title">
                가이드 보드
              </h2>
            </div>
            <Link className="section__more" href="/board?category=tip">
              팁 게시판 →
            </Link>
          </header>

          {(() => {
            const featured = site.guideCards.filter((g) => g.url);
            const pending = site.guideCards.filter((g) => !g.url);
            return (
              <>
                {featured.length ? (
                  <div className="guide-featured-grid">
                    {featured.map((guide) => (
                      <GuideCard key={guide.id} guide={guide} />
                    ))}
                  </div>
                ) : null}
                {pending.length ? (
                  <>
                    <p className="guide-pending-note" aria-hidden="true">
                      운영자가 채울 자리 · {pending.length}개 준비중
                    </p>
                    <div className="guide-pending-grid">
                      {pending.map((guide) => (
                        <GuideCard key={guide.id} guide={guide} />
                      ))}
                    </div>
                  </>
                ) : null}
              </>
            );
          })()}
        </div>
      </section>
    </>
  );
}
