"use client";

import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";

/**
 * MarkdownBody — newb (양피지·클래식) 톤 마크다운 렌더링.
 * - 토큰만 사용 (raw 색/폰트 금지)
 * - rehype-sanitize default schema 로 XSS 차단 (javascript: / data: URL 차단)
 * - remark-gfm 으로 표/취소선/autolink 지원
 * - bodyFormat plain 이면 markdown 미적용 (whiteSpace: pre-wrap 유지)
 */
export default function MarkdownBody({ source, format = "markdown" }) {
  const body = source ?? "";
  if (!body) return <span className="md-empty">본문이 없습니다.</span>;
  if (format === "plain") return <span style={{ whiteSpace: "pre-wrap" }}>{body}</span>;
  return (
    <div className="md-body md-body--newb">
      <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
        {body}
      </Markdown>
    </div>
  );
}
