"use client";

/**
 * 모험단 인증 마크 — SSOT 컴포넌트.
 *
 * 사용: <VerifiedBadge verified={user.dnfProfile?.verifiedBySelectScreen} />
 *
 * 표시 기준: 사용자가 character_select 화면을 통한 본인 인증을 통과한 경우만 ✓.
 * (사칭 가능한 basic_info / character_list 만으로는 부여 X.)
 * 닉네임이 노출되는 모든 위치 (게시판, 댓글, 프로필, author 카드) 에 동일 컴포넌트.
 */
export default function VerifiedBadge({ verified, size = "sm", title }) {
  if (!verified) return null;
  const px = size === "lg" ? 18 : size === "md" ? 15 : 12;
  return (
    <span
      className="verified-badge"
      title={title || "모험단 인증 회원"}
      aria-label="모험단 인증 회원"
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: px + 4,
        height: px + 4,
        borderRadius: "50%",
        background: "var(--color-success, #4ade80)",
        color: "#0a0a0a",
        fontSize: px - 2,
        fontWeight: 700,
        lineHeight: 1,
        verticalAlign: "middle",
        marginLeft: 4,
        flexShrink: 0,
      }}
    >
      ✓
    </span>
  );
}
