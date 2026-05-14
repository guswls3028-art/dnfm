import "./globals.css";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import { CurrentUserProvider } from "@/lib/use-current-user";
import { site } from "@/lib/content";

export const metadata = {
  title: {
    default: "던파 모바일 뉴비 훈련소 | dnfm.kr",
    template: "%s | dnfm.kr"
  },
  description: "던파 모바일 뉴비 훈련소 카톡방 공식 웹. 가이드, 이벤트, 게시판을 한곳에.",
  metadataBase: new URL("https://dnfm.kr"),
  openGraph: {
    title: "던파 모바일 뉴비 훈련소 — dnfm.kr",
    description: "던파 모바일 뉴비 / 부캐 가이드 + 카톡방 + 게시판",
    url: "https://dnfm.kr",
    siteName: "dnfm.kr 뉴비 훈련소",
    locale: "ko_KR",
    type: "website",
    images: [
      {
        url: "/배경사진.jpg",
        width: 768,
        height: 768,
        alt: "던파 모바일 뉴비 훈련소 — 군복 배너"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "던파 모바일 뉴비 훈련소",
    description: "가이드 + 카톡방 + 게시판",
    images: ["/배경사진.jpg"]
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <CurrentUserProvider>
          <div className="site-frame" data-theme={site.theme}>
            <SiteHeader site={site} />
            <div className="site-frame__body">
              <main id="main-content" tabIndex={-1}>
                {children}
              </main>
              <SiteFooter site={site} />
            </div>
          </div>
        </CurrentUserProvider>
      </body>
    </html>
  );
}
