import Link from "next/link";
import { OwnerStamp, EaveLine } from "./PavilionAccent";

/**
 * SiteFooter — 운영 정보 + 빠른 링크 + 카톡방 CTA.
 *
 * 모든 페이지 하단. 신뢰/연결 정보 SSOT.
 */
export default function SiteFooter({ site }) {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer" aria-labelledby="footer-title">
      <EaveLine className="site-footer__eave" style={{ height: 24, transform: "scaleY(-1)" }} />
      <div className="site-footer__inner content-wrap">
        <OwnerStamp className="site-footer__stamp" size={72} label={`정자
안쪽`} />
        <h2 id="footer-title" className="sr-only">사이트 정보</h2>

        <div className="site-footer__grid">
          {/* 브랜드 + 카톡방 CTA */}
          <div className="site-footer__brand-col">
            <div className="site-footer__brand">
              <span className="site-footer__brand-mark" aria-hidden="true">D</span>
              <div>
                <strong>{site.brandMark}</strong>
                <small>{site.shortTitle}</small>
              </div>
            </div>
            <p className="site-footer__tagline">{site.subtitle}</p>
            <a
              className="btn btn--primary btn--sm site-footer__kakao"
              href="https://open.kakao.com/o/gbsjsZ5g"
              target="_blank"
              rel="noreferrer"
            >
              카톡방 입장 →
            </a>
          </div>

          {/* 빠른 링크 */}
          <nav className="site-footer__col" aria-label="훈련소 메뉴">
            <h3 className="site-footer__col-title">훈련소</h3>
            <ul>
              <li><Link href="/about">톡방 소개·규칙</Link></li>
              <li><Link href="/guide">가이드</Link></li>
              <li><Link href="/board">커뮤니티</Link></li>
              <li><Link href="/events">이벤트</Link></li>
              <li><Link href="/guilds">친화 길드</Link></li>
            </ul>
          </nav>

          {/* 운영 채널 */}
          <nav className="site-footer__col" aria-label="운영 채널">
            <h3 className="site-footer__col-title">운영 채널</h3>
            <ul>
              <li>
                <a href="https://open.kakao.com/o/gbsjsZ5g" target="_blank" rel="noreferrer">
                  카톡방 입장 ↗
                </a>
              </li>
              <li>
                <Link href="/board/new?category=tip">가이드 제보(팁 글)</Link>
              </li>
              <li>
                <a href="mailto:admin@dnfm.kr">운영 문의 — admin@dnfm.kr</a>
              </li>
              <li>
                <Link href="/admin/reports">신고 처리(운영자)</Link>
              </li>
            </ul>
          </nav>

          {/* 공식 + 친구 사이트 */}
          <nav className="site-footer__col" aria-label="외부 링크">
            <h3 className="site-footer__col-title">바로가기</h3>
            <ul>
              <li>
                <a href="https://dnfm.nexon.com/" target="_blank" rel="noreferrer">공식 홈 ↗</a>
              </li>
              <li>
                <a href="https://dnfm.nexon.com/News/Notice" target="_blank" rel="noreferrer">공식 공지 ↗</a>
              </li>
              <li>
                <a href="https://dnfm.nexon.com/News/Event" target="_blank" rel="noreferrer">공식 이벤트 ↗</a>
              </li>
              {site.siblingSite ? (
                <li>
                  <a
                    href={site.siblingSite.href}
                    target="_blank"
                    rel="noreferrer"
                    title={site.siblingSite.description}
                  >
                    {site.siblingSite.label} ↗
                  </a>
                </li>
              ) : null}
            </ul>
          </nav>
        </div>

        <div className="site-footer__bottom">
          <p className="site-footer__note">{site.footerNote}</p>
          <p className="site-footer__copy">© {year} DNFM.KR · 운영자 시너지통</p>
        </div>
      </div>
    </footer>
  );
}
