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
            <span className="page-hero__kicker">GUIDE</span>
            <h1 className="page-hero__title">가이드</h1>
            <p className="page-hero__sub">
              톡방 명령어, 공식 자료, 게시판 가이드를 한곳에서 확인합니다.
            </p>
          </div>
          <Link href="/board?category=tip" className="btn btn--secondary btn--sm">
            팁 모음 →
          </Link>
        </div>
      </section>

      <section className="section" aria-labelledby="quickstart-title">
        <div className="content-wrap">
          <header className="section__head">
            <div>
              <span className="section__kicker">3 STEP</span>
              <h2 id="quickstart-title" className="section__title">
                3분 안에 시작하기
              </h2>
            </div>
          </header>
          <ol className="quickstart">
            <li className="quickstart__step" data-step="1">
              <span className="quickstart__num">01</span>
              <strong>공식 기준 먼저 확인</strong>
              <p>직업·성장·콘텐츠 정보는 던파 모바일 공식 공지와 현재 패치 기준으로 확인합니다.</p>
            </li>
            <li className="quickstart__step" data-step="2">
              <span className="quickstart__num">02</span>
              <strong>내 상황을 같이 적기</strong>
              <p>질문할 때 레벨, 직업, 막힌 콘텐츠, 장비 상태를 함께 적으면 답변이 빨라집니다.</p>
            </li>
            <li className="quickstart__step" data-step="3">
              <span className="quickstart__num">03</span>
              <strong>막히면 톡방에서 묻기</strong>
              <p>채팅에 <code>/가이드ㅡ시작</code> 입력하면 시작 루트 카드 자동. 또는 그냥 질문.</p>
              <a className="btn btn--primary btn--sm" href="https://open.kakao.com/o/gbsjsZ5g" target="_blank" rel="noreferrer">
                카톡방 입장 →
              </a>
            </li>
          </ol>
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

          <div className="guide-featured-grid">
            {site.guideCards.map((guide) => (
              <GuideCard key={guide.id} guide={guide} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
