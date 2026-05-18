// dnfm.kr (뉴비 훈련소) 정적 콘텐츠 SSOT
// 외부 URL이 아직 확정되지 않은 경우 url: null + reason 으로 비활성 상태를 명시
// 알 수 없는 값은 임의 URL 만들지 말고 그대로 null + reason 유지

// 톡방 운영자 (방장) — 사용자 본인.
export const host = {
  nickname: "시너지통",
  role: "방장 / 운영자 / 개발자",
  // 파일명 = 용도. avatarSrc = 호스트 카드 작은 원형 (피규어 프사), bannerSrc = hero 큰 배너 (군복 일러스트).
  avatarSrc: "/프로필사진.jpg",
  bannerSrc: "/배경사진.jpg",
  contact: { type: "kakao_dm", reason: "톡방 방장 프로필 1:1 대화" },
};

// 메인 히어로 배경 테마 — mp4 배경 + 분위기.
// 사용자가 hero 우측 칩으로 즉시 전환. localStorage 에 마지막 선택 보존.
export const heroThemes = [
  {
    id: "moonlight",
    label: "달빛주점",
    subLabel: "술집 던전",
    kicker: "MOONLIT TAVERN",
    tagline: "달빛주점 던전 분위기",
    videoSrc: "/themes/moonlight.mp4",
    posterSrc: "/themes/moonlight.jpg",
  },
  {
    id: "elvenguard",
    label: "엘븐가드",
    subLabel: "숲 지역",
    kicker: "ELVEN GUARD",
    tagline: "엘븐가드 숲 분위기",
    videoSrc: "/themes/elvenguard.mp4",
    posterSrc: "/themes/elvenguard.jpg",
  },
  {
    id: "campfire",
    label: "캠프파이어",
    subLabel: "모닥불 캠프",
    kicker: "CAMPFIRE",
    tagline: "캠프파이어 모닥불 분위기",
    videoSrc: "/themes/campfire.mp4",
    posterSrc: "/themes/campfire.jpg",
  },
];

// 톡방 핵심 철학 — 운영자 직접 명시.
export const philosophy = {
  oneLiner: "몰라서 손해 보지 않게 돕고, 질문하기 편한 톡방으로 운영합니다.",
  bullets: [
    "이 방은 뉴비 / 복귀 / 초보 / 라이트 유저를 돕고자 개설한 방입니다.",
    "저스펙·무과금·소과금·라이트 유저를 무시하거나 조롱하지 않습니다.",
    "상위 콘텐츠 진입을 위한 성장 과정은 도와드리지만, 콘텐츠를 대신 깨드리는 방은 아닙니다.",
    "각자의 과금 수준, 플레이 속도, 목표를 존중해주세요.",
    "싸우지 말고 사이좋게 지내주세요. 가장 중요한 규칙입니다.",
  ],
};

export const aboutHighlights = [
  {
    value: "질문",
    label: "몰라서 묻는 말이 출발점",
    body: "처음 온 사람이 장비, 성장, 파티 기준을 편하게 물어볼 수 있게 둡니다.",
  },
  {
    value: "공식",
    label: "원문은 공식 링크로 확인",
    body: "패치·공지·이벤트는 원문을 우선하고, 톡방에서는 지금 할 일만 짧게 정리합니다.",
  },
  {
    value: "기록",
    label: "흘러간 답변은 사이트에 저장",
    body: "반복 질문과 운영 기준은 게시판·가이드로 회수해 다음 뉴비가 다시 찾게 합니다.",
  },
];

export const operatingLoop = [
  {
    title: "묻기",
    body: "레벨, 직업, 막힌 콘텐츠, 장비 상태를 같이 적으면 답변이 빨라집니다.",
  },
  {
    title: "확인하기",
    body: "확실하지 않은 세부 수치나 컷은 운영자가 확인한 뒤 사이트에 반영합니다.",
  },
  {
    title: "남기기",
    body: "반복되는 질문은 게시판 댓글, 가이드 후보, 톡방 공지로 정리합니다.",
  },
];

// 톡방 인원 분포 — 2026-05-08 대화 기준 추정치.
export const demographics = {
  asOf: "2026-05-08 대화 기준 추정",
  bars: [
    { label: "생뉴비", pct: 37, accent: "gold" },
    { label: "뉴비 & 복귀", pct: 22, accent: "amber" },
    { label: "초보졸업", pct: 17, accent: "mint" },
    { label: "중수/실전러", pct: 13, accent: "blue" },
    { label: "준고인물", pct: 8, accent: "violet" },
    { label: "고인물", pct: 4, accent: "crimson" },
  ],
};

// 톡방 기본 규칙 — 운영자 확인 기준.
export const rules = [
  { title: "싸우지 않기", body: "제일 중요한 규칙입니다." },
  { title: "서로 존중하기", body: "스펙·과금·숙련도·게임이해도·플레이 방식으로 사람을 무시하지 않습니다." },
  { title: "계정 거래 관련 질문 금지", body: "이 방은 뉴비 가이드 방입니다. 게임 정책위반 관련은 금지." },
  { title: "게임과 무관한 광고/홍보 금지", body: "스팸성 홍보는 제재될 수 있습니다." },
  { title: "타톡방/방송/길드 등 홍보는 자유", body: "단, 과도한 반복 홍보나 분쟁 유도는 삼가주세요." },
  { title: "들낙 자유", body: "필요할 때 들어오고, 필요 없어지면 나가셔도 됩니다." },
  { title: "질문 환영", body: "단순한 질문도 괜찮습니다. 부끄러워하지 말고 아무거나 질문해도 됩니다." },
];

// 닉네임 가이드 — 닉네임은 자유. 가입 시 본캐 캐릭명/모험단명 함께 입력.
export const nicknameGuide = {
  format: "닉 자유 + 가입 시 본캐 캐릭터명 / 모험단명",
  fields: [
    { key: "nickname", label: "닉네임", required: true, hint: "자유롭게 — 톡방 / 사이트에 노출" },
    { key: "mainCharacter", label: "본캐 캐릭터명", required: true, hint: "예: 지금간다", autoFill: "ocr_character_select" },
    { key: "adventurer", label: "모험단명", required: true, hint: "예: 광기의 파도", autoFill: "ocr_basic_info" },
  ],
  examples: {
    good: ["(뉴비)지금간다/엘마"],
    bad: ["뉴비/엘마 (다른 사람과 중복)", "뉴비 (단독, 구분 불가)", "복귀유저", "던린이"],
  },
  notes: [
    "톡방 닉네임은 자유롭게. 단, 중복되기 쉬운 단독 닉네임은 가급적 변경.",
    "닉 앞에 (뉴비) 표식 가능.",
    "직업 함께 표기 추천 (예: 지금간다/엘마).",
    "본캐 + 모험단명은 회원가입 시 던파 캡처 OCR 으로 자동 채움 (수기 수정 가능).",
  ],
};

// 가이드 명령어 — 톡방 채팅창에서.
export const guideCommand = {
  trigger: "/가이드",
  author: "@방장 · @잭터 · @맑남",
  note: "톡방 채팅창에 /가이드, /블레이드, /시로코, /테라처럼 입력하면 관련 포탈을 바로 찾습니다.",
};

export const guidePortalGroups = [
  {
    id: "official",
    role: "공식",
    title: "공홈 공지·패치 포탈",
    summary: "공지, 업데이트, 개발자 노트처럼 최신 원문 확인이 필요한 정보는 공식 링크로 바로 연결합니다.",
    accent: "red",
    items: [
      {
        id: "official-notice",
        category: "공식",
        title: "공식 공지사항",
        shortTitle: "공지",
        author: "공식",
        body: "점검, 오류, 안내, 공식 공지를 확인하는 던파 모바일 공홈 링크.",
        linkLabel: "공지사항",
        url: "https://dnfm.nexon.com/News/Notice",
        keywords: ["공지", "공지사항", "점검공지", "오류공지", "공홈공지", "공식공지"],
      },
      {
        id: "official-update",
        category: "공식",
        title: "공식 업데이트",
        shortTitle: "업데이트",
        author: "공식",
        body: "패치 내용, 신규 콘텐츠, 변경사항을 확인하는 던파 모바일 공식 업데이트 링크.",
        linkLabel: "업데이트",
        url: "https://dnfm.nexon.com/News/Update",
        keywords: ["업데이트", "패치", "패치노트", "업뎃", "업데이트노트"],
      },
      {
        id: "official-devnote",
        category: "공식",
        title: "공식 개발자 노트",
        shortTitle: "개노",
        author: "공식",
        body: "개발 방향, 패치 의도, 운영 코멘트를 확인하는 던파 모바일 공식 개발자 노트 링크.",
        linkLabel: "개발자 노트",
        url: "https://dnfm.nexon.com/News/Devnote",
        keywords: ["개노", "개발자노트", "devnote", "디렉터노트", "운영자노트"],
      },
    ],
  },
  {
    id: "host",
    role: "방장",
    title: "방장 작성 가이드",
    summary: "직업 운용, 세팅 판단, 과금·테라 루트처럼 톡방에서 반복되는 질문을 정리한 글입니다.",
    accent: "gold",
    items: [
      {
        id: "blade-standard",
        category: "직업",
        title: "블레이드 정석 가이드",
        shortTitle: "블레이드 30/33와플",
        author: "방장",
        body: "30/33와플 기준 블레이드 운용, 세팅, 스킬룬, 스킬트리, 콤보와 체크포인트까지 한 번에 보는 직업 공략.",
        linkLabel: "블레이드 공략",
        url: "https://dnfm.nexon.com/Community/Tip/View/3428289",
        keywords: ["블레이드", "블레", "와플", "30와플", "33와플", "스킬트리", "콤보", "직업공략"],
      },
      {
        id: "element-status",
        category: "세팅",
        title: "속강·상변 속성부여 정리",
        shortTitle: "속강·상변",
        author: "방장",
        body: "상변 피해와 속성강화 적용 구조를 정리한 글. 스킬 자체 속성만 있는 직업은 속성부여가 필요한지 판단할 때 봅니다.",
        linkLabel: "속강/상변 정리",
        url: "https://dnfm.nexon.com/Community/Tip/View/3340326",
        keywords: ["속강", "상변", "속성부여", "무기카드", "화상", "중독", "자속성", "상변뎀"],
      },
      {
        id: "spending-guide",
        category: "과금",
        title: "과금 어떻게 해야할까",
        shortTitle: "무소과금~고과금",
        author: "방장",
        body: "오라·칭호·크리쳐·아티팩트·계약 등 과금 우선순위와 무소과금/중과금 기준 선택지를 정리한 과금 판단 글.",
        linkLabel: "과금 가이드",
        url: "https://dnfm.nexon.com/Community/Tip/View/2996348",
        keywords: ["과금", "무과금", "소과금", "중과금", "고과금", "패키지", "오칭크", "아티팩트", "계약"],
      },
      {
        id: "free-terra-package",
        category: "재화",
        title: "무과금 테라 모으는 법",
        shortTitle: "무과금 테라",
        author: "방장",
        body: "일일·주간 고정 테라 수급과 패키지 구매까지 걸리는 기간을 계산한 무과금/라이트 유저용 테라 루트.",
        linkLabel: "무과금 테라 루트",
        url: "https://dnfm.nexon.com/Community/Tip/View/2996567",
        keywords: ["무과금테라", "테라모으기", "테라", "패키지구매", "일일테라", "주간테라", "라이트"],
      },
    ],
  },
  {
    id: "jactor",
    role: "잭터",
    title: "잭터 운영·레이드 포탈",
    summary: "슈시아 길드 운영 안내와 시로코 레이드 실전 진행 자료를 묶었습니다.",
    accent: "mint",
    items: [
      {
        id: "guild-sushia",
        category: "길드",
        title: "잭터님의 즉시가입길드",
        shortTitle: "즉시가입 길드",
        author: "잭터",
        body: "잭터님이 안내하는 슈시아 즉시가입 길드. 53~54렙 길드 7개, 자율 운영, 밥차 만렙과 길드버프 제공 안내.",
        linkLabel: "즉시가입 길드",
        url: "https://dnfm.nexon.com/Community/Guild/View/3446236",
        keywords: ["길드", "슈시아", "즉시가입", "잭터길드", "밥차", "길드버프", "뉴비훈련소길드"],
      },
      {
        id: "siroco-total",
        category: "레이드",
        title: "시로코 레이드 종합 가이드",
        shortTitle: "시로코 종합",
        author: "잭터",
        body: "6인 동선, 관문별 방어 버프, 저항마 구간, 3인 진행, 경미참 운영과 패턴 영상 링크까지 모은 종합 자료.",
        linkLabel: "시로코 종합",
        url: "https://dnfm.nexon.com/Community/Tip/View/3423263",
        keywords: ["시로코", "시로코레이드", "레이드", "저항마", "3인", "경미참", "동선", "망울", "패턴"],
      },
      {
        id: "siroco-raid-buff",
        category: "레이드",
        title: "시로코 공대버프 활용법",
        shortTitle: "공대버프",
        author: "잭터",
        body: "오즈마 호출과 이젤리아 호출의 숨겨진 버프, 각성기·그로기 타이밍 연계를 짧게 확인하는 보조 자료.",
        linkLabel: "공대버프 정리",
        url: "https://dnfm.nexon.com/Community/Tip/View/3423032",
        keywords: ["공대버프", "오즈마호출", "이젤리아", "그로기", "각성기", "시로코버프"],
      },
    ],
  },
  {
    id: "clear-man",
    role: "맑남",
    title: "맑남 재화·성장 포탈",
    summary: "초보와 복귀가 자주 묻는 재화 획득처와 장비·속성 세팅 자료를 공식 커뮤니티 공략으로 연결합니다.",
    accent: "blue",
    items: [
      {
        id: "currency-sources",
        category: "재화",
        title: "주요 재화 획득처 정리",
        shortTitle: "재화 획득처",
        author: "맑남",
        body: "골드, 테라, 라코, 촉매제, 연마석, 젤바 초대장을 일간·주간·월간 루틴 기준으로 확인하는 재화 지도.",
        linkLabel: "재화 획득처",
        url: "https://dnfm.nexon.com/Community/Tip/View/3385102",
        keywords: ["재화", "골드", "테라", "라코", "촉매제", "연마석", "초대장", "젤바초대장", "획득처"],
      },
      {
        id: "gear-attribute-options",
        category: "세팅",
        title: "딜러/시너지 장비 추천 옵션·자체 속성 정리",
        shortTitle: "장비 추천/속성",
        author: "맑남",
        body: "딜러/시너지 장비 추천 옵션과 자체 속성 직업을 함께 보는 세팅 참고 글.",
        linkLabel: "장비/속성 정리",
        url: "https://dnfm.nexon.com/Community/Tip/View/3329968",
        keywords: ["장비추천", "속성", "속강", "자체속성", "속성부여", "딜러장비", "시너지장비", "추천옵션", "상변"],
      },
    ],
  },
];

export const guidePortalItems = guidePortalGroups.flatMap((group) =>
  group.items.map((item) => ({ ...item, groupId: group.id, role: group.role, accent: group.accent })),
);

// 뉴비 친화 길드 — 운영자가 직접 채움.
export const friendlyGuilds = [];

export const site = {
  id: "training",
  hostnames: ["dnfm.kr", "www.dnfm.kr"],
  title: "던파 모바일 뉴비 훈련소",
  shortTitle: "뉴비 훈련소",
  brandMark: "DNFM.KR",
  eyebrow: "dnfm.kr",
  subtitle: "뉴비훈련소 톡방 입구 · 질문 저장소 · 운영 기록소",
  theme: "training",
  hero: {
    kicker: "톡방 운영 허브",
    headline: "뉴비훈련소 질문 저장소",
    headlineLines: ["뉴비훈련소", "질문 저장소"],
    subtitle: "톡방에서 놓친 질문을 사이트에 남기고, 답변은 댓글로 회수합니다.",
    bullets: [
      "몰라서 손해 보지 않게",
      "과금 압박 없이 상황부터 확인",
      "확인된 답변은 댓글과 공지로 정리",
      "처음 질문도 편하게 환영",
    ],
    body:
      "공식 공지와 이벤트는 원문 링크로 확인하고, 톡방 운영에 필요한 질문·답변·이벤트 기록만 모읍니다.",
    hashtags: [
      "#던파모바일",
      "#던파m",
      "#뉴비",
      "#복귀",
      "#레이드",
      "#정예던전",
      "#재해던전",
      "#아스마르",
      "#시로코",
      "#소멸의공동",
      "#절망의탑",
    ],
    callout: "공식 정보는 공홈 링크로, 질문과 운영 기록은 DNFM.KR로 나눠 관리합니다.",
  },
  heroSlides: [
    {
      id: "hero-onboard",
      kicker: "질문 저장소",
      headlineLines: ["질문은", "묻히기 전에"],
      title: "톡방 질문이 묻히기 전에 남겨두기",
      tagline: "놓친 질문을 댓글 답변으로 회수",
      body: "회원·인증회원·비회원 모두 질문 게시판에 남길 수 있습니다. 운영자가 댓글로 정리합니다.",
      navTitle: "톡방 질문이 묻히기 전에 남기기",
      themeId: "moonlight",
      accent: "amber",
      cta: { label: "질문하기", href: "/board/new?category=question" }
    },
    {
      id: "hero-hurock-avatar-contest",
      kicker: "진행중 이벤트",
      headlineLines: ["허락 아바타", "콘테스트"],
      title: "허락 아바타 콘테스트 1회",
      tagline: "6월 1일 ~ 6월 13일(토) 19시 전",
      body: "5개 부문 코디 자랑 이벤트. 참가 모집중이며, 허락 사이트에서 안내와 참가를 확인합니다.",
      navTitle: "허락 아바타 콘테스트 진행중",
      navHref: "https://hurock.dnfm.kr/contests/1582e41c-1ce5-4532-9642-6ea93f537f4a",
      themeId: "campfire",
      accent: "crimson",
      primaryCta: true,
      cta: {
        label: "허락 이벤트 보기",
        href: "https://hurock.dnfm.kr/contests/1582e41c-1ce5-4532-9642-6ea93f537f4a"
      }
    },
    {
      id: "hero-charter",
      kicker: "운영 헌장",
      headlineLines: ["공식 정보는 링크", "톡방 판단은 짧게"],
      title: "공식 정보는 링크, 톡방 판단은 짧게",
      tagline: "공홈 복붙 대신 뉴비 기준 정리",
      body: "공홈을 복붙하지 않고 뉴비 기준으로 지금 무엇을 하면 되는지만 정리합니다.",
      navTitle: "공식 정보는 링크, 톡방 판단은 짧게",
      themeId: "elvenguard",
      accent: "crimson",
      cta: { label: "톡방 안내", href: "/about" }
    },
    {
      id: "hero-openchat",
      kicker: "오픈채팅",
      headlineLines: ["카톡방 입장", "질문부터 편하게"],
      title: "카톡방 입장, 질문부터 편하게",
      tagline: "처음 질문도 환영",
      body: "상황을 길게 설명하지 않아도 됩니다. 막힌 곳과 목표만 남기면 같이 확인합니다.",
      navTitle: "카톡방 입장 후 바로 질문",
      themeId: "campfire",
      accent: "mint",
      cta: { label: "질문하기", href: "/board/new?category=question" }
    },
    {
      id: "hero-community-event",
      kicker: "이벤트장",
      headlineLines: ["톡방 이벤트", "참가와 기록"],
      title: "톡방 이벤트 참가와 기록",
      tagline: "공지, 신청, 결과를 한곳에",
      body: "아바타 콘테스트 같은 톡방 이벤트는 신청과 결과를 사이트에 보관합니다.",
      navTitle: "톡방 이벤트 참가와 기록",
      themeId: "moonlight",
      accent: "gold",
      cta: { label: "이벤트 보기", href: "/events" }
    },
    {
      id: "hero-guild-mentor",
      kicker: "매칭",
      headlineLines: ["길드와 멘토", "동의 기반으로"],
      title: "길드와 멘토는 동의 기반으로",
      tagline: "도움 가능 분야만 가볍게 연결",
      body: "길드, 파티, 세팅 도움은 공개 랭킹이 아니라 동의한 사람과 분야 중심으로 연결합니다.",
      navTitle: "길드와 멘토는 동의 기반으로",
      themeId: "elvenguard",
      accent: "olive",
      cta: { label: "길드 보기", href: "/guilds" }
    }
  ],
  // 정자 위에 걸어둔 게시판 같은 카드 슬라이더 fallback.
  // backend hero_banners 가 비어 있거나 fetch 실패 시 화면 비지 않게 띄움.
  // 어드민이 실 배너를 등록하면 자동으로 대체됨.
  heroSliderFallback: [
    {
      id: "fb-newb-kakao",
      kind: "image",
      src: "/배경사진.jpg",
      label: "뉴비훈련소 카톡방 입장",
      href: "https://open.kakao.com/o/gbsjsZ5g"
    },
    {
      id: "fb-dnf-update",
      kicker: "공식 업데이트",
      title: "던파모바일 최신 업데이트",
      body: "공식 홈에서 패치 / 신규 콘텐츠 / 보상 기간 확인.",
      accent: "amber",
      href: "https://dnfm.nexon.com/News/Update",
      cta: "공식 업데이트 →"
    },
    {
      id: "fb-dnf-devnote",
      kicker: "개발자 노트",
      title: "던파모바일 최신 개발자노트",
      body: "방향성 / 패치 의도 / Q&A. 운영 입장 직접.",
      accent: "olive",
      href: "https://dnfm.nexon.com/News/DevNote",
      cta: "개발자 노트 →"
    }
  ],
  actions: [
    { label: "카톡방 입장", url: "https://open.kakao.com/o/gbsjsZ5g", note: "뉴비훈련소 오픈채팅" },
    { label: "공식 홈페이지", url: "https://dnfm.nexon.com/", note: "이벤트 랜딩" },
    { label: "공지사항", url: "https://dnfm.nexon.com/News/Notice", note: "점검, 오류, 공지" },
    { label: "진행 이벤트", url: "https://dnfm.nexon.com/News/Event", note: "보상 확인" }
  ],
  homeCtas: [
    { label: "카톡방 입장", href: "https://open.kakao.com/o/gbsjsZ5g", note: "바로 질문하고 답 받기" },
    { label: "질문하기", href: "/board/new?category=question", note: "회원·비회원 모두 가능" },
    { label: "질문 저장소", href: "/board?category=question", note: "운영자가 댓글로 정리" }
  ],
  officialChannels: [
    {
      id: "notice",
      tag: "공지",
      label: "공지사항",
      body: "공식 원문 확인용 링크",
      href: "https://dnfm.nexon.com/News/Notice"
    },
    {
      id: "update",
      tag: "패치",
      label: "패치노트 / 업데이트",
      body: "패치 원문 확인용 링크",
      href: "https://dnfm.nexon.com/News/Update"
    },
    {
      id: "devnote",
      tag: "개노",
      label: "개발자 노트",
      body: "운영 방향 원문 링크",
      href: "https://dnfm.nexon.com/News/DevNote"
    },
    {
      id: "event",
      tag: "보상",
      label: "진행 이벤트",
      body: "보상 기간 원문 링크",
      href: "https://dnfm.nexon.com/News/Event"
    }
  ],
  communityShortcuts: [
    { label: "공지", href: "/board?category=notice" },
    { label: "질문", href: "/board?category=question" },
    { label: "팁", href: "/board?category=tip" },
    { label: "파티", href: "/board?category=party" },
    { label: "장비", href: "/board?category=equip" },
    { label: "잡담", href: "/board?category=talk" }
  ],
  trainingFlow: [
    {
      step: "01",
      tone: "gold",
      title: "카톡방 입장",
      body: "실시간 질문은 톡방에서. 사이트는 질문이 흘러가서 사라지는 문제를 보완합니다.",
      primary: { label: "카톡방 입장", href: "https://open.kakao.com/o/gbsjsZ5g" },
      secondary: { label: "톡방 안내", href: "/about" }
    },
    {
      step: "02",
      tone: "mint",
      title: "질문 저장",
      body: "레벨, 직업, 항마력, 막힌 곳을 양식으로 남기면 운영자가 답변하기 쉬워집니다.",
      primary: { label: "질문하기", href: "/board/new?category=question" },
      secondary: { label: "질문 게시판", href: "/board?category=question" }
    },
    {
      step: "03",
      tone: "crimson",
      title: "답변 회수",
      body: "운영자가 댓글로 답변하고, 반복 질문은 가이드 후보나 톡방 공지로 정리합니다.",
      primary: { label: "질문 보기", href: "/board?category=question" },
      secondary: { label: "가이드 보드", href: "/guide" }
    }
  ],
  eventSlides: [
    { index: "1", title: "톡방 입장", body: "처음 온 모험가를 위한 입구" },
    { index: "2", title: "질문 저장", body: "답변 못 받은 질문을 남김" },
    { index: "3", title: "답변 정리", body: "운영자가 댓글로 회수" },
    { index: "4", title: "이벤트장", body: "톡방 이벤트 기록" }
  ],
  noticesMoreUrl: "https://dnfm.nexon.com/News/Notice",
  communityMoreUrl: "/board",
  featureCards: [
    {
      title: "질문 저장소",
      body: "톡방에서 흘러간 질문을 사이트에 남기고, 운영자가 댓글로 답변을 회수합니다.",
      accent: "gold"
    },
    {
      title: "뉴비 번역소",
      body: "공식 원문은 링크만 두고, 뉴비가 지금 할 일을 짧게 정리합니다.",
      accent: "red"
    },
    {
      title: "운영 피로도 줄이기",
      body: "반복 질문, 이벤트 참가, 공지 링크를 톡방 밖에 보관합니다.",
      accent: "ink"
    }
  ],
  eventCards: [
    {
      id: "e1",
      badge: null,
      category: "공식",
      title: "공식 이벤트 바로가기",
      period: "상시 확인",
      body: "보상·출석·성장 지원 이벤트는 공식 페이지에서 원문으로 확인합니다.",
      url: "https://dnfm.nexon.com/News/Event",
      thumbnailSrc: "/dnfm-official-thumb.jpg",
      thumbnailAlt: "던파 모바일 공식 썸네일",
      status: "진행중"
    },
    {
      id: "e2",
      badge: null,
      category: "톡방",
      title: "톡방 이벤트 기록소",
      period: "진행 공지 후 등록",
      body: "아바타 콘테스트처럼 톡방에서 진행한 이벤트 참가 안내와 결과를 보관합니다.",
      url: "/board?category=notice",
      thumbnailSrc: "/배경사진.jpg",
      thumbnailAlt: "군복을 입은 뉴비훈련소 일러스트",
      status: "대기"
    }
  ],
  guideCards: [
    ...guidePortalItems.slice(0, 4),
  ],
  stats: [
    { value: "01", label: "입장 후 먼저 볼 것", detail: "초반 성장 순서" },
    { value: "02", label: "매일 확인할 것", detail: "공식 이벤트와 점검" },
    { value: "03", label: "질문 전 체크", detail: "직업, 장비, 파티 기준" }
  ],
  briefing: [
    {
      title: "오늘의 공지 루틴",
      body: "점검, 오류, 신규 이벤트 링크를 먼저 확인하고 톡방 상단 공지에 짧게 요약합니다.",
      accent: "mint"
    },
    {
      title: "뉴비 질문 흐름",
      body: "막히면 톡방에서 질문. 확인되지 않은 세부 수치는 사이트에 적지 않습니다.",
      accent: "amber"
    },
    {
      title: "공식 연결점",
      body: "공식 공지, 이벤트, 추천 가이드, 팁 게시판으로 빠르게 이동하게 해서 정보 출처를 흐리지 않습니다.",
      accent: "red"
    }
  ],
  checklistKey: "dnfm-training-checklist",
  checklistTitle: "오늘 훈련소 체크",
  checklist: [
    "공식 공지·진행 이벤트 확인",
    "레벨·직업·막힌 콘텐츠 정리",
    "막히면 /가이드ㅡ시작 또는 톡방 질문"
  ],
  guideFilters: ["전체", "직업", "세팅", "과금", "재화", "레이드", "길드", "공식"],
  guides: [
    ...guidePortalItems,
    {
      title: "신규 모험가 공식 가이드",
      category: "공식",
      body: "공식 추천 가이드 — 직업·콘텐츠·이벤트 기준 공식 자료.",
      linkLabel: "공식 추천 가이드",
      url: "https://dnfm.nexon.com/Guide/Recommand"
    },
    {
      title: "장비 질문 받는 법",
      category: "장비",
      body: "세부 장비 정보는 운영자가 확인한 뒤 채웁니다. 지금은 톡방 질문을 우선합니다.",
      linkLabel: "장비 게시판",
      url: "/board?category=equip"
    },
    {
      title: "파티와 레이드 예절",
      category: "파티",
      body: "파티 관련 세부 기준은 운영자가 확인한 뒤 채웁니다. 지금은 톡방 질문을 우선합니다.",
      linkLabel: "파티 게시판",
      url: "/board?category=party"
    },
    {
      title: "공식 팁과 공략 게시판",
      category: "공식",
      body: "유저 공략과 최신 팁 — 공식 커뮤니티 게시판.",
      linkLabel: "팁&공략 이동",
      url: "https://dnfm.nexon.com/Community/Tip"
    },
    {
      title: "성장 질문 남기기",
      category: "성장",
      body: "성장 루트가 막히면 레벨, 직업, 항마력, 막힌 곳을 질문 게시판에 남겨주세요.",
      linkLabel: "질문하기",
      url: "/board/new?category=question"
    }
  ],
  linkGroups: [
    {
      title: "공식 바로가기",
      links: [
        { label: "홈", url: "https://dnfm.nexon.com/" },
        { label: "공지사항", url: "https://dnfm.nexon.com/News/Notice" },
        { label: "이벤트", url: "https://dnfm.nexon.com/News/Event" },
        { label: "추천 가이드", url: "https://dnfm.nexon.com/Guide/Recommand" },
        { label: "쿠폰", url: "https://mcoupon.nexon.com/dnfm/" }
      ]
    },
    {
      title: "운영 채널",
      links: [
        { label: "카톡방 입장", url: "https://open.kakao.com/o/gbsjsZ5g" },
        { label: "가이드 제보 — 팁 글로", url: "/board/new?category=tip" }
      ]
    }
  ],
  navItems: [
    { label: "홈", href: "/" },
    { label: "새소식", href: "/news" },
    { label: "커뮤니티", href: "/board" },
    { label: "가이드", href: "/guide" },
    { label: "이벤트", href: "/events" },
    { label: "길드", href: "/guilds" },
    { label: "소개", href: "/about" }
  ],
  boardCategories: [
    { id: "all", label: "전체" },
    { id: "notice", label: "공지" },
    { id: "question", label: "질문" },
    { id: "tip", label: "팁" },
    { id: "party", label: "파티" },
    { id: "equip", label: "장비" },
    { id: "talk", label: "잡담" }
  ],
  /** 간단 가입 — 아이디 + 비번 + 닉네임. 모험단 인증은 별 페이지(/profile/verify)에서 선택. */
  signupBasics: {
    title: "간단 가입",
    body: "아이디 · 비밀번호 · 닉네임만 입력하면 끝. 모험단 인증은 가입 후에 원하시면 진행해주세요.",
    fields: [
      { key: "username", label: "아이디", hint: "영문/숫자/언더스코어 3~32자. 가입 후 변경 불가." },
      { key: "password", label: "비밀번호", hint: "4자 이상. 너무 복잡하지 않게." },
      { key: "displayName", label: "닉네임", hint: "톡방/사이트에 보일 이름. 자유롭게." }
    ]
  },
  /** /profile/verify 의 모험단 인증 안내. */
  verifyGuide: {
    title: "모험단 인증 (선택)",
    body: "캡처를 묶어서 한 번에 올리면 자동으로 모험단명·대표 캐릭터·캐릭 목록을 인식합니다.",
    captures: [
      { id: "basic_info", label: "모험단 기본정보", hint: "정보 → 모험단 → 기본정보 화면 1장.", imagePath: "/verify-examples/basic_info.png" },
      { id: "character_list", label: "보유 캐릭터 (선택)", hint: "모험단 → 보유캐릭터. 캐릭이 많으면 1~3장.", imagePath: "/verify-examples/character_list.png" },
      { id: "character_select", label: "캐릭터 선택창", hint: "게임 로그인 직후 캐릭 선택 창 1장. 사칭 방지.", imagePath: "/verify-examples/character_select.png" }
    ],
    classGrid: {
      label: "직업이 헷갈리면 — 직업 변경 화면 캡처에서 매칭",
      hint: "OCR 직업명이 잘못 인식되면 (메카닉 남/여 등) 캐릭터 직업 select 에서 바꿔주세요. 아이콘 매칭 참고용.",
      images: ["/verify-examples/class_grid_1.png", "/verify-examples/class_grid_2.png"]
    },
    rules: []
  },
  loginProviders: [
    { id: "local", label: "DNFM 계정으로 로그인", note: "아이디·비밀번호" },
    { id: "kakao", label: "카카오로 시작", note: "톡방과 같은 계정 권장", brand: "kakao" },
    { id: "google", label: "구글로 시작", brand: "google" }
  ],
  timelineTitle: "운영 흐름",
  timeline: [
    { time: "오전", title: "공지 스캔", body: "점검, 오류, 이벤트 마감 시간을 확인하고 톡방 공지 문구를 다듬습니다." },
    { time: "오후", title: "질문 회수", body: "반복 질문을 가이드 후보로 모으고 답변 기준을 짧은 문장으로 정리합니다." },
    { time: "패치일", title: "링크 고정", body: "공식 이벤트, 개발자 노트, 보상 표를 상단에 올려 신규 유입이 바로 보게 합니다." }
  ],
  siblingSite: {
    label: "허락 페이지",
    href: "https://hurock.dnfm.kr",
    description: "친구 사이트, 별도 운영"
  },
  footerNote:
    "DNFM.KR 은 던파 모바일 뉴비 훈련소 카톡방의 비공식 운영 허브입니다. 던전앤파이터 모바일 IP는 NEXON / NEOPLE 에 귀속됩니다."
};
