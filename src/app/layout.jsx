import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { site } from "@/lib/content";

export const metadata = {
  title: {
    default: "던파 모바일 뉴비 훈련소 | dnfm.kr",
    template: "%s | dnfm.kr"
  },
  description: "던파 모바일 뉴비 훈련소 카톡방 공식 웹. 가이드, 이벤트, 게시판을 한곳에.",
  metadataBase: new URL("https://dnfm.kr")
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <div className="site-frame" data-theme={site.theme}>
          <SiteHeader site={site} />
          <main id="main-content" tabIndex={-1}>
            {children}
          </main>
          <SiteFooter site={site} />
        </div>
      </body>
    </html>
  );
}
