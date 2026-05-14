/**
 * PavilionAccent — newb 시그너처 SVG 4종.
 *
 *  - <Lantern />  호박등불 (정자 처마에 매달린)
 *  - <Pushpin />  압정 (양피지 쪽지 고정)
 *  - <OwnerStamp />  운영자 인장 (붉은 크림슨 도장)
 *  - <EaveLine />  처마 (한옥 정자 처마 라인)
 *
 * 정자 게시판 메타포 — newb 만의 시그너처. dnfm 클래식(양피지/골드)에
 * "한국 공원 정자" 톤을 박는다. 허락 B급과 톤 분리.
 */

export function Lantern({ size = 48, className = "", style }) {
  return (
    <svg
      className={`pavilion-lantern ${className}`}
      width={size}
      height={size * 1.45}
      viewBox="0 0 48 70"
      fill="none"
      aria-hidden="true"
      style={style}
    >
      {/* 매다는 줄 */}
      <line x1="24" y1="0" x2="24" y2="8" stroke="rgba(31,35,26,0.6)" strokeWidth="1" />
      {/* 위 갓 */}
      <path
        d="M14 8 L34 8 L31 12 L17 12 Z"
        fill="#3a4d23"
        stroke="rgba(17,20,13,0.6)"
        strokeWidth="0.5"
      />
      {/* 등 몸체 — 호박 amber glow */}
      <ellipse
        cx="24"
        cy="32"
        rx="14"
        ry="20"
        fill="url(#lantern-grad)"
        stroke="#7a5e1f"
        strokeWidth="1"
      />
      {/* 세로 살 */}
      <line x1="24" y1="14" x2="24" y2="50" stroke="rgba(122,94,31,0.7)" strokeWidth="0.6" />
      <line x1="16" y1="18" x2="16" y2="46" stroke="rgba(122,94,31,0.5)" strokeWidth="0.5" />
      <line x1="32" y1="18" x2="32" y2="46" stroke="rgba(122,94,31,0.5)" strokeWidth="0.5" />
      {/* 가로 살 */}
      <ellipse cx="24" cy="22" rx="13" ry="2" fill="none" stroke="rgba(122,94,31,0.55)" strokeWidth="0.5" />
      <ellipse cx="24" cy="42" rx="13" ry="2" fill="none" stroke="rgba(122,94,31,0.55)" strokeWidth="0.5" />
      {/* 아래 갓 */}
      <path
        d="M16 50 L32 50 L29 56 L19 56 Z"
        fill="#3a4d23"
        stroke="rgba(17,20,13,0.6)"
        strokeWidth="0.5"
      />
      {/* 술 */}
      <line x1="24" y1="56" x2="24" y2="64" stroke="#c8492a" strokeWidth="1" />
      <circle cx="24" cy="66" r="2" fill="#c8492a" />
      {/* glow */}
      <ellipse cx="24" cy="32" rx="20" ry="24" fill="url(#lantern-glow)" opacity="0.5" />
      <defs>
        <radialGradient id="lantern-grad" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#ffe082" stopOpacity="0.95" />
          <stop offset="50%" stopColor="#f0b050" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#c98b1a" stopOpacity="0.85" />
        </radialGradient>
        <radialGradient id="lantern-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffd070" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#ffd070" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}

export function Pushpin({ size = 18, className = "", style }) {
  return (
    <svg
      className={`pavilion-pushpin ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      style={style}
    >
      {/* 핀 그림자 */}
      <ellipse cx="13" cy="20" rx="3" ry="0.8" fill="rgba(0,0,0,0.22)" />
      {/* 핀 침 */}
      <path d="M12 14 L13 22" stroke="#5a5a4a" strokeWidth="1.2" strokeLinecap="round" />
      {/* 핀 머리 — 크림슨 도자기 */}
      <circle cx="12" cy="10" r="6" fill="url(#pin-grad)" stroke="#5a0e0e" strokeWidth="0.6" />
      {/* 하이라이트 */}
      <ellipse cx="10" cy="8" rx="2" ry="1.4" fill="rgba(255,220,200,0.65)" />
      <defs>
        <radialGradient id="pin-grad" cx="35%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#d04545" />
          <stop offset="100%" stopColor="#7a1414" />
        </radialGradient>
      </defs>
    </svg>
  );
}

export function OwnerStamp({ size = 64, className = "", label = "운영자\n인장", style }) {
  const lines = label.split("\n");
  return (
    <svg
      className={`pavilion-stamp ${className}`}
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
      style={style}
    >
      {/* 도장 외곽 */}
      <rect
        x="6"
        y="6"
        width="52"
        height="52"
        rx="3"
        fill="none"
        stroke="rgba(139,26,26,0.85)"
        strokeWidth="2.5"
      />
      <rect
        x="10"
        y="10"
        width="44"
        height="44"
        rx="2"
        fill="none"
        stroke="rgba(139,26,26,0.55)"
        strokeWidth="0.8"
      />
      {/* 한자 톤 글자 — 2줄 */}
      <text
        x="32"
        y={lines.length === 1 ? 38 : 28}
        textAnchor="middle"
        fontFamily="'Nanum Myeongjo', 'Noto Serif KR', serif"
        fontSize="14"
        fontWeight="800"
        fill="rgba(139,26,26,0.95)"
        letterSpacing="0.1em"
      >
        {lines[0]}
      </text>
      {lines.length > 1 ? (
        <text
          x="32"
          y="48"
          textAnchor="middle"
          fontFamily="'Nanum Myeongjo', 'Noto Serif KR', serif"
          fontSize="14"
          fontWeight="800"
          fill="rgba(139,26,26,0.95)"
          letterSpacing="0.1em"
        >
          {lines[1]}
        </text>
      ) : null}
      {/* 잉크 번짐 / 결 */}
      <rect
        x="6"
        y="6"
        width="52"
        height="52"
        rx="3"
        fill="rgba(139,26,26,0.05)"
      />
    </svg>
  );
}

/**
 * EaveLine — 한옥 정자 처마 SVG line.
 * 가로 폭 = 부모 100%. 처마 결 + 처마 tile (◣◢◣◢) 반복.
 */
export function EaveLine({ className = "", style }) {
  return (
    <svg
      className={`pavilion-eave ${className}`}
      viewBox="0 0 1200 48"
      preserveAspectRatio="none"
      aria-hidden="true"
      style={{ width: "100%", height: 32, display: "block", ...style }}
    >
      {/* 처마 baseline */}
      <line x1="0" y1="6" x2="1200" y2="6" stroke="rgba(122,94,31,0.55)" strokeWidth="1.2" />
      {/* 처마 위 살짝 들어가는 곡선 */}
      <path
        d="M0 14 C 300 2, 900 2, 1200 14"
        fill="none"
        stroke="rgba(122,94,31,0.35)"
        strokeWidth="0.8"
        strokeDasharray="4 6"
      />
      {/* 처마 tile — 반복 ◣◢ */}
      <g fill="rgba(58,77,35,0.4)">
        {Array.from({ length: 30 }).map((_, i) => (
          <polygon key={i} points={`${i * 40},14 ${i * 40 + 20},36 ${i * 40 + 40},14`} />
        ))}
      </g>
    </svg>
  );
}
