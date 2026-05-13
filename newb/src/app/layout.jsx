import "./globals.css";

export const metadata = {
  title: {
    default: "던파 모바일 뉴비 훈련소 | dnfm.kr",
    template: "%s | dnfm.kr"
  },
  description: "던파 모바일 뉴비 훈련소 커뮤니티 허브와 스트리머 서브도메인 사이트",
  metadataBase: new URL("https://dnfm.kr")
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
