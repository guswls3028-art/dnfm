export const site = {
  id: "training",
  hostnames: ["dnfm.kr", "www.dnfm.kr"],
  title: "던파 모바일 뉴비 훈련소",
  shortTitle: "뉴비 훈련소",
  eyebrow: "dnfm.kr",
  subtitle: "가이드, 이벤트, 질문 흐름을 한곳에 모으는 카톡방 운영 허브",
  theme: "training",
  hero: {
    kicker: "ARAD FIELD DESK",
    headline: "처음 온 모험가가 길을 잃지 않게",
    headlineLines: ["처음 온", "모험가가", "길을 잃지", "않게"],
    body:
      "입장 링크, 공식 공지, 추천 가이드, 오늘 할 일을 한 화면에서 정리합니다. 실제 톡방 URL만 넣으면 바로 커뮤니티 관문으로 쓸 수 있습니다.",
    calloutTitle: "현재 연결 기준",
    calloutBody:
      "공식 링크는 던파모바일 홈페이지 메뉴 기준으로 연결했습니다. 톡방과 자체 가이드는 운영자가 확정한 주소로 교체합니다."
  },
  actions: [
    { label: "카톡방 입장", url: null, reason: "오픈채팅 URL 등록 전" },
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
    { label: "공지", title: "5/14(목) 정기점검 안내", url: "https://dnfm.nexon.com/News/Notice" },
    { label: "이벤트", title: "진행 이벤트와 보상 기간 확인", url: "https://dnfm.nexon.com/News/Event" },
    { label: "가이드", title: "신규 모험가 공식 추천 가이드", url: "https://dnfm.nexon.com/Guide/Recommand" },
    { label: "운영", title: "뉴비 훈련소 상단 공지 갱신 예정", url: null }
  ],
  noticesMoreUrl: "https://dnfm.nexon.com/News/Notice",
  communityPosts: [
    { label: "질문", title: "직업 선택 전에 먼저 볼 기준", meta: "뉴비 질문" },
    { label: "팁", title: "피로도와 이벤트 숙제 체크 순서", meta: "성장 루트" },
    { label: "파티", title: "파티 입장 전 준비물과 용어", meta: "협동 콘텐츠" },
    { label: "장비", title: "장비 스크린샷 질문 양식", meta: "답변 템플릿" }
  ],
  communityMoreUrl: null,
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
      body: "설치, 서버, 직업 선택, 초반 진행 순서를 한 장으로 정리할 첫 가이드 슬롯입니다.",
      linkLabel: "자체 가이드 준비중",
      url: null
    },
    {
      title: "신규 모험가 공식 가이드",
      category: "공식",
      body: "공식 추천 가이드에 있는 신규 모험가용 안내로 바로 이동합니다.",
      linkLabel: "공식 추천 가이드",
      url: "https://dnfm.nexon.com/Guide/Recommand"
    },
    {
      title: "장비 질문 받는 법",
      category: "장비",
      body: "스크린샷 없이 답이 어려운 질문은 캐릭터 정보와 현재 목표를 함께 받도록 안내합니다.",
      linkLabel: "운영 문구 준비중",
      url: null
    },
    {
      title: "파티와 레이드 예절",
      category: "파티",
      body: "뉴비가 부담 없이 파티에 들어갈 수 있도록 준비물, 용어, 실패 후 대처를 정리합니다.",
      linkLabel: "초안 슬롯",
      url: null
    },
    {
      title: "공식 팁과 공략 게시판",
      category: "공식",
      body: "유저 공략과 최신 팁을 확인할 수 있는 공식 커뮤니티 게시판입니다.",
      linkLabel: "팁&공략 이동",
      url: "https://dnfm.nexon.com/Community/Tip"
    },
    {
      title: "복귀자 점검표",
      category: "성장",
      body: "복귀 시 확인할 이벤트, 장비, 피로도, 주간 콘텐츠 기준을 별도 카드로 확장합니다.",
      linkLabel: "가이드 준비중",
      url: null
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
        { label: "카톡방", url: null, reason: "오픈채팅 URL 등록 전" },
        { label: "가이드 제보", url: null, reason: "폼 또는 게시판 주소 등록 전" },
        { label: "운영 문의", url: "mailto:admin@dnfm.kr" }
      ]
    }
  ],
  timelineTitle: "운영 흐름",
  timeline: [
    {
      time: "오전",
      title: "공지 스캔",
      body: "점검, 오류, 이벤트 마감 시간을 확인하고 톡방 공지 문구를 다듬습니다."
    },
    {
      time: "오후",
      title: "질문 회수",
      body: "반복 질문을 가이드 후보로 모으고 답변 기준을 짧은 문장으로 정리합니다."
    },
    {
      time: "패치일",
      title: "링크 고정",
      body: "공식 이벤트, 개발자 노트, 보상 표를 상단에 올려 신규 유입이 바로 보게 합니다."
    }
  ],
  footerNote:
    "던전앤파이터 모바일은 NEXON/NEOPLE의 게임입니다. 이 사이트는 커뮤니티 운영용 비공식 허브입니다."
};
