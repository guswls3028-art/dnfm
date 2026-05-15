import HomeInfoHub from "@/components/HomeInfoHub";
import { site } from "@/lib/content";

export const metadata = {
  title: "새소식",
};

export default function NewsPage() {
  return (
    <>
      <section className="page-hero">
        <div className="content-wrap page-hero__inner">
          <div>
            <span className="page-hero__kicker">NEWS</span>
            <h1 className="page-hero__title">새소식</h1>
            <p className="page-hero__sub">
              운영자가 올린 공지, 커뮤니티 최신글, 공식 정보 링크를 한곳에서 확인합니다.
            </p>
          </div>
        </div>
      </section>

      <HomeInfoHub site={site} />
    </>
  );
}
