// dnfm.kr (뉴비 훈련소) 정적 콘텐츠 SSOT
// 외부 URL이 아직 확정되지 않은 경우 url: null + reason 으로 비활성 상태를 명시
// 알 수 없는 값은 가짜 URL 만들지 말고 그대로 null + reason 유지

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
    subLabel: "보랏빛 밤 · 호박 등불",
    kicker: "MOONLIT TAVERN",
    tagline: "달빛 너머, 한 잔 들고 정자에 앉다",
    videoSrc: "/themes/moonlight.mp4",
    posterSrc: "/themes/moonlight.jpg",
  },
  {
    id: "elvenguard",
    label: "엘븐가드",
    subLabel: "고요한 숲 · 신성한 빛",
    kicker: "ELVEN GUARD",
    tagline: "오래된 숲의 결, 잠든 빛 사이를 걷다",
    videoSrc: "/themes/elvenguard.mp4",
    posterSrc: "/themes/elvenguard.jpg",
  },
  {
    id: "campfire",
    label: "캠프파이어",
    subLabel: "장작 · 뜨거운 그림자",
    kicker: "CAMPFIRE",
    tagline: "타닥타닥 — 누군가 옆에 와서 앉는다",
    videoSrc: "/themes/campfire.mp4",
    posterSrc: "/themes/campfire.jpg",
  },
];

// 톡방 핵심 철학 — 운영자 직접 명시.
export const philosophy = {
  oneLiner: "정보부족으로 인한 뉴비의 불이익 예방 + 자유로운 소통.",
  bullets: [
    "이 방은 뉴비 / 복귀 / 초보 / 라이트 유저를 돕고자 개설한 방입니다.",
    "저스펙·무과금·소과금·라이트 유저를 무시하거나 조롱하지 않습니다.",
    "상위 컨텐츠 진입을 위한 성장 과정은 도와드리지만, 컨텐츠를 대신 깨드리는 방은 아닙니다.",
    "각자의 과금 수준, 플레이 속도, 목표를 존중해주세요.",
    "싸우지 말고 사이좋게 지내주세요. 가장 중요한 규칙입니다.",
  ],
};

// 톡방 인원 분포 — 운영자 대화 기준 추정. 표현은 안정형(월 단위) 유지.
export const demographics = {
  asOf: "2026년 5월",
  bars: [
    { label: "생뉴비", pct: 37, accent: "gold" },
    { label: "뉴비 & 복귀", pct: 22, accent: "amber" },
    { label: "초보졸업", pct: 17, accent: "mint" },
    { label: "중수/실전러", pct: 13, accent: "blue" },
    { label: "준고인물", pct: 8, accent: "violet" },
    { label: "고인물", pct: 4, accent: "crimson" },
  ],
};

// 톡방 기본 규칙 — 운영자 명시.
export const rules = [
  { title: "싸우지 않기", body: "제일 중요한 규칙입니다." },
  { title: "서로 존중하기", body: "스펙·과금·숙련도·게임이해도·플레이 방식으로 사람을 무시하지 않습니다." },
  { title: "계정 거래 관련 질문 금지", body: "이 방은 뉴비 가이드 방입니다. 게임 정책위반 관련은 금지." },
  { title: "게임과 무관한 광고/홍보 금지", body: "스팸성 홍보는 제재될 수 있습니다." },
  { title: "타톡방/방송/길드 등 홍보는 자유", body: "단, 과도한 반복 홍보나 분쟁 유도는 삼가주세요." },
  { title: "들낙 자유", body: "필요할 때 들어오고, 필요 없으시면 나가셔도 됩니다." },
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
  trigger: "/가이드ㅡ*",
  author: "@맑남",
  note: "톡방 채팅창에 입력 시 가이드 카드가 자동으로 뜹니다.",
};

// 뉴비 친화 길드.
export const friendlyGuilds = [
  {
    leader: "잭터",
    name: "잭터님의 즉시가입 길드",
    description: "길드 아지트 만렙 — 모든 던전에서 유용한 버프 요리를 매일 지급. 뉴비/복귀 환영.",
    url: "https://dnfm.nexon.com/Community/Guild/View/3243836",
  },
];

export const site = {
  id: "training",
  hostnames: ["dnfm.kr", "www.dnfm.kr"],
  title: "던파 모바일 뉴비 훈련소",
  shortTitle: "뉴비 훈련소",
  brandMark: "DNFM.KR",
  eyebrow: "dnfm.kr",
  subtitle: "가이드, 이벤트, 질문 흐름을 한곳에 모으는 카톡방 운영 허브",
  theme: "training",
  hero: {
    kicker: "공원 정자 · 환영의 자리",
    headline: "길 잃은 뉴비에게 도움을 주는 방",
    headlineLines: ["길 잃은 뉴비에게", "도움을 주는 방"],
    subtitle: "목적없이 와서 쉬어도 되는 공원정자 감성",
    bullets: [
      "뉴비 / 복귀 모두 환영",
      "뉴비 도와주고 싶은 고인물도 환영",
      "위 아래 없는 수평적 공간",
    ],
    body:
      "톡방 입장 링크, 공식 공지, 가이드, 길드 안내. 부담 없이 들렀다 가셔도 됩니다.",
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
    callout: "공식 링크는 던파모바일 공식 홈 기준. 톡방·가이드는 운영자가 직접 관리합니다.",
  },
  heroSlides: [
    {
      id: "hero-onboard",
      kicker: "입소 안내",
      title: "처음 온 모험가가 길을 잃지 않게",
      body: "톡방 링크, 추천 직업, 오늘의 숙제까지 한 화면에서.",
      accent: "amber",
      cta: { label: "입소 시작", href: "/signup" }
    },
    {
      id: "hero-event",
      kicker: "진행중 이벤트",
      title: "이번 주 보상 일정 한 번에",
      body: "공식 이벤트와 톡방 이벤트를 같은 시간선으로 정리합니다.",
      accent: "crimson",
      cta: { label: "이벤트 보러가기", href: "/events" }
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
      label: "뉴비훈련소 카톡방 입장 — 군복 지급, 정자 환영",
      href: "https://open.kakao.com/o/gbsjsZ5g"
    },
    {
      id: "fb-hurock-contest",
      kind: "image",
      src: "/hurock-banner.png",
      label: "허락 — 룩 콘테스트 이벤트 페이지",
      href: "https://hurock.dnfm.kr/"
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
  eventSlides: [
    { index: "1", title: "입소 안내", body: "처음 온 모험가를 위한 성장 순서" },
    { index: "2", title: "공식 공지", body: "점검, 업데이트, 보상 링크" },
    { index: "3", title: "질문 루트", body: "직업, 장비, 파티 질문 정리" },
    { index: "4", title: "가이드 보드", body: "반복 질문을 한 장으로 회수" }
  ],
  notices: [
    { id: "n1", label: "공지", title: "공식 점검·업데이트 일정", url: "https://dnfm.nexon.com/News/Notice", meta: "공식" },
    { id: "n2", label: "이벤트", title: "진행 이벤트와 보상 기간 확인", url: "https://dnfm.nexon.com/News/Event", meta: "공식" },
    { id: "n3", label: "가이드", title: "신규 모험가 공식 추천 가이드", url: "https://dnfm.nexon.com/Guide/Recommand", meta: "공식" },
    { id: "n4", label: "운영", title: "톡방 입장 — 뉴비 훈련소 오픈채팅", url: "https://open.kakao.com/o/gbsjsZ5g", meta: "내부" },
    { id: "n5", label: "운영", title: "회원 가입 + 던파 캡처 인증 안내", url: "/signup", meta: "내부" }
  ],
  noticesMoreUrl: "https://dnfm.nexon.com/News/Notice",
  communityPosts: [
    {
      id: "p1",
      label: "질문",
      title: "직업 선택 전에 먼저 볼 기준이 뭐예요?",
      meta: "뉴비 질문",
      author: "초보모험가",
      time: "방금",
      views: 12,
      comments: 3,
      likes: 0
    },
    {
      id: "p2",
      label: "팁",
      title: "피로도와 이벤트 숙제 체크 순서 정리",
      meta: "성장 루트",
      author: "훈련소장",
      time: "1시간 전",
      views: 142,
      comments: 7,
      likes: 12
    },
    {
      id: "p3",
      label: "파티",
      title: "파티 입장 전 준비물과 용어 한 줄 정리",
      meta: "협동 콘텐츠",
      author: "팟장",
      time: "오늘",
      views: 88,
      comments: 4,
      likes: 5
    },
    {
      id: "p4",
      label: "장비",
      title: "장비 스크린샷 질문할 때 같이 보내주실 정보",
      meta: "답변 템플릿",
      author: "운영진",
      time: "어제",
      views: 230,
      comments: 11,
      likes: 18
    },
    {
      id: "p5",
      label: "잡담",
      title: "오늘 던파모바일 시작했어요 환영 부탁",
      meta: "신규",
      author: "신참",
      time: "어제",
      views: 41,
      comments: 14,
      likes: 9
    }
  ],
  communityMoreUrl: "/board",
  featureCards: [
    {
      title: "처음 시작 루트",
      body: "설치 후 초반 진행, 직업 선택, 성장 기준을 한 장으로 정리합니다.",
      accent: "gold"
    },
    {
      title: "오늘의 던파모바일",
      body: "이벤트, 점검, 보상 기간을 톡방 공지에 맞게 빠르게 확인합니다.",
      accent: "red"
    },
    {
      title: "공식 정보 연결",
      body: "출처가 필요한 내용은 공식 홈페이지와 추천 가이드로 바로 연결합니다.",
      accent: "ink"
    }
  ],
  eventCards: [
    {
      id: "e1",
      badge: "HOT",
      category: "공식",
      title: "신규 캐릭터 성장 지원 이벤트",
      period: "5/8 ~ 5/22",
      body: "신규 캐릭터 레벨 구간별 성장 재화 지원. 공식 공지 참조.",
      url: "https://dnfm.nexon.com/News/Event",
      status: "진행중"
    },
    {
      id: "e2",
      badge: null,
      category: "톡방",
      title: "뉴비 훈련소 입소 인증 이벤트",
      period: "5/13 ~ 5/27",
      body: "회원가입 + 캐릭터 정보 인증 후 톡방 닉네임 자동 등록.",
      url: "/signup",
      status: "진행중"
    },
    {
      id: "e3",
      badge: "END",
      category: "공식",
      title: "출석 보상 시즌1",
      period: "4/10 ~ 5/10",
      body: "시즌1 출석 보상 마감. 시즌2 안내는 공식 공지에서 확인.",
      url: "https://dnfm.nexon.com/News/Notice",
      status: "종료"
    }
  ],
  guideCards: [
    {
      id: "g1",
      category: "시작",
      title: "처음 시작 루트",
      body: "설치 → 서버 선택(카인 추천) → 직업 결정(끌리는 것) → 메인 퀘스트 따라가기. 톡방 채팅창에 `/가이드ㅡ시작` 입력하면 시작 루트 카드를 자동 발송합니다.",
      linkLabel: "톡방 입장 후 명령어로 보기",
      url: "https://open.kakao.com/o/gbsjsZ5g"
    },
    {
      id: "g2",
      category: "공식",
      title: "신규 모험가 공식 가이드",
      body: "넥슨 공식 사이트의 추천 가이드. 직업·콘텐츠·이벤트 기준 공식 자료.",
      linkLabel: "공식 추천 가이드",
      url: "https://dnfm.nexon.com/Guide/Recommand"
    },
    {
      id: "g3",
      category: "장비",
      title: "장비 질문 받는 법",
      body: "캐릭터 정보 창 + 현재 강화 단계 + 다음에 하고 싶은 콘텐츠를 함께 적어주세요. 정보가 부족하면 답이 어렵습니다.",
      linkLabel: "장비 게시판 이동",
      url: "/board?category=equip"
    },
    {
      id: "g4",
      category: "파티",
      title: "파티와 레이드 예절",
      body: "포션·무기 강화·항마력 확인 후 파티 신청. 모르는 용어는 부담 없이 톡방에 질문 — 거의 항상 누군가 알려줍니다.",
      linkLabel: "파티 게시판 이동",
      url: "/board?category=party"
    }
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
      body: "레벨, 직업, 항마력, 현재 막힌 콘텐츠를 먼저 묻고 같은 질문은 가이드 카드로 회수합니다.",
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
    "공식 공지와 점검 안내 확인",
    "진행 이벤트 보상 기간 확인",
    "톡방 상단 공지 갱신",
    "반복 질문 1개를 가이드 후보로 기록"
  ],
  guideFilters: ["전체", "시작", "성장", "장비", "파티", "공식"],
  guides: [
    {
      title: "처음 시작 루트",
      category: "시작",
      body: "설치 → 카인 서버 권장 → 끌리는 직업 → 메인 퀘스트. 톡방 `/가이드ㅡ시작` 명령어로 즉시 카드.",
      linkLabel: "톡방 입장",
      url: "https://open.kakao.com/o/gbsjsZ5g"
    },
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
      body: "캐릭터 정보 창 + 현재 강화 단계 + 다음 목표를 함께 적으면 답이 빠릅니다.",
      linkLabel: "장비 게시판",
      url: "/board?category=equip"
    },
    {
      title: "파티와 레이드 예절",
      category: "파티",
      body: "포션·무기 강화·항마력 확인 후 파티 신청. 용어는 부담 없이 톡방에 질문.",
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
      title: "복귀자 점검표",
      category: "성장",
      body: "복귀 후 확인 — (1) 시즌 보상 (2) 장비 등급 (3) 일일 피로도 (4) 주간 콘텐츠. 막막하면 톡방 질문 환영.",
      linkLabel: "톡방 입장",
      url: "https://open.kakao.com/o/gbsjsZ5g"
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
        { label: "가이드 제보 — 팁 글로", url: "/board/new?category=tip" },
        { label: "운영 문의", url: "mailto:admin@dnfm.kr" }
      ]
    }
  ],
  navItems: [
    { label: "소개", href: "/about" },
    { label: "커뮤니티", href: "/board" },
    { label: "가이드", href: "/guide" },
    { label: "이벤트", href: "/events" },
    { label: "친화 길드", href: "/guilds" }
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
  boardPosts: [
    {
      id: "b1",
      categoryId: "notice",
      label: "공지",
      title: "뉴비 훈련소 게시판 운영 규칙",
      author: "운영진",
      time: "어제",
      views: 412,
      comments: 8,
      likes: 24,
      body:
        "톡방과 같은 톤으로 운영합니다. 인신공격 / 광고 / 외부 거래 글은 즉시 삭제됩니다. 질문은 본인 레벨·직업·항마력·막힌 콘텐츠를 함께 적어주시면 답변이 빨라요.",
      pinned: true
    },
    {
      id: "b2",
      categoryId: "question",
      label: "질문",
      title: "직업 선택 전에 먼저 봐야 할 기준이 뭐예요?",
      author: "초보모험가",
      time: "방금",
      views: 12,
      comments: 3,
      likes: 0,
      body:
        "오늘 처음 시작했습니다. 그냥 끌리는 캐릭으로 가도 되는지, 아니면 솔플 / 파티 어느 쪽 기준으로 골라야 하는지 궁금합니다."
    },
    {
      id: "b3",
      categoryId: "tip",
      label: "팁",
      title: "피로도와 이벤트 숙제 체크 순서 정리",
      author: "훈련소장",
      time: "1시간 전",
      views: 142,
      comments: 7,
      likes: 12,
      body:
        "1) 출석 보상 → 2) 일일 던전 피로도 소모 → 3) 이벤트 일일 → 4) 주간 콘텐츠. 시간 부족하면 (1)(3) 만이라도 챙기세요.",
      hot: true
    },
    {
      id: "b4",
      categoryId: "party",
      label: "파티",
      title: "파티 입장 전 준비물과 용어 한 줄 정리",
      author: "팟장",
      time: "오늘",
      views: 88,
      comments: 4,
      likes: 5,
      body: "포션, 무기 강화 확인, 항마력 확인 후 파티 신청. 용어는 댓글에 더 정리해둘게요."
    },
    {
      id: "b5",
      categoryId: "equip",
      label: "장비",
      title: "장비 스크린샷 질문할 때 같이 보내주실 정보",
      author: "운영진",
      time: "어제",
      views: 230,
      comments: 11,
      likes: 18,
      body:
        "캐릭터 정보 창 + 현재 강화 단계 + 다음에 하고 싶은 콘텐츠를 함께 적어주시면 답이 정확해집니다.",
      hot: true
    },
    {
      id: "b6",
      categoryId: "talk",
      label: "잡담",
      title: "오늘 던파모바일 시작했어요 환영 부탁",
      author: "신참",
      time: "어제",
      views: 41,
      comments: 14,
      likes: 9,
      body: "원작 던파 유저였는데 모바일은 처음입니다. 잘 부탁드려요."
    }
  ],
  postComments: [
    { postId: "b3", author: "모험가A", time: "30분 전", body: "출석 보상은 잊으면 너무 아까워요" },
    { postId: "b3", author: "신참", time: "15분 전", body: "정리 감사합니다 저장했어요" },
    { postId: "b2", author: "훈련소장", time: "방금", body: "지금은 어느 정도 솔플로 가도 무난해요. 끌리는 캐릭으로 가시고 후반에 파티 콘텐츠 들어갈 때 다시 봐도 됩니다." }
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
    "DNFM.KR 은 던파 모바일 뉴비 훈련소 카톡방의 비공식 운영 허브입니다. 던전앤파이터 모바일 IP는 NEXON / NEOPLE 에 귀속됩니다.",
  profileMock: {
    nickname: "모험가닉네임",
    joinedAt: "2026-04-21",
    dnfCharacter: {
      name: "캐릭이름",
      job: "스트라이커",
      level: 47,
      adventure: "모험단이름",
      server: "카인"
    },
    myPosts: [
      { id: "b2", label: "질문", title: "직업 선택 전에 먼저 봐야 할 기준이 뭐예요?", time: "방금", comments: 3 },
      { id: "b6", label: "잡담", title: "오늘 던파모바일 시작했어요 환영 부탁", time: "어제", comments: 14 }
    ]
  }
};
