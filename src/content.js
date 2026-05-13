window.DNFM_SITES = {
  training: {
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
      body:
        "입장 링크, 공식 공지, 추천 가이드, 오늘 할 일을 한 화면에서 정리합니다. 실제 톡방 URL만 넣으면 바로 커뮤니티 관문으로 쓸 수 있습니다.",
      calloutTitle: "현재 연결 기준",
      calloutBody:
        "공식 링크는 던파모바일 홈페이지 메뉴 기준으로 연결했습니다. 톡방과 자체 가이드는 운영자가 확정한 주소로 교체합니다."
    },
    actions: [
      {
        label: "카톡방 입장",
        url: null,
        reason: "오픈채팅 URL 등록 전"
      },
      {
        label: "공식 홈페이지",
        url: "https://dnfm.nexon.com/",
        note: "이벤트 랜딩"
      },
      {
        label: "공지사항",
        url: "https://dnfm.nexon.com/News/Notice",
        note: "점검, 오류, 공지"
      },
      {
        label: "진행 이벤트",
        url: "https://dnfm.nexon.com/News/Event",
        note: "보상 확인"
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
    footerNote: "던전앤파이터 모바일은 NEXON/NEOPLE의 게임입니다. 이 사이트는 커뮤니티 운영용 비공식 허브입니다."
  },
  allow: {
    id: "allow",
    hostnames: ["allow.dnfm.kr"],
    title: "허락",
    shortTitle: "허락",
    eyebrow: "allow.dnfm.kr",
    subtitle: "방송 공지, 링크, 커뮤니티 동선을 정리하는 스트리머 페이지",
    theme: "allow",
    hero: {
      kicker: "CREATOR ROOM",
      headline: "허락님의 방송 동선을 단정하게",
      body:
        "방송 링크, 공지, 다시보기, 커뮤니티 안내를 한 페이지에 배치합니다. 채널 URL이 확정되면 버튼만 켜면 됩니다.",
      calloutTitle: "서브도메인 준비",
      calloutBody:
        "Cloudflare Pages 기준으로 `allow.dnfm.kr` 커스텀 도메인을 같은 프로젝트에 연결하면 자동으로 이 화면이 열립니다."
    },
    actions: [
      { label: "라이브 채널", url: null, reason: "채널 URL 등록 전" },
      { label: "유튜브", url: null, reason: "유튜브 URL 등록 전" },
      { label: "공지 보기", url: "#notice-board", note: "페이지 내 공지" },
      { label: "문의 메일", url: "mailto:allow@dnfm.kr" }
    ],
    stats: [
      { value: "LIVE", label: "방송 링크", detail: "등록 대기" },
      { value: "VOD", label: "다시보기", detail: "등록 대기" },
      { value: "DNFM", label: "커뮤니티 연결", detail: "뉴비 훈련소 연동" }
    ],
    briefing: [
      {
        title: "첫 화면은 방송 입장",
        body: "방문자가 가장 먼저 라이브 채널과 최근 공지를 확인하도록 구성했습니다.",
        accent: "red"
      },
      {
        title: "콘텐츠 묶음",
        body: "던파 모바일 방송, 공략, 합방, 클립을 섹션으로 나눌 수 있게 했습니다.",
        accent: "amber"
      },
      {
        title: "도메인 분리",
        body: "메인 커뮤니티와 스트리머 페이지가 같은 코드베이스를 쓰되 호스트명으로 화면을 나눕니다.",
        accent: "mint"
      }
    ],
    checklistKey: "dnfm-allow-checklist",
    checklistTitle: "페이지 공개 전 체크",
    checklist: [
      "라이브 채널 URL 등록",
      "유튜브 또는 다시보기 URL 등록",
      "프로필 이미지와 소개 문구 확정",
      "문의 메일 수신 확인"
    ],
    guideFilters: ["전체", "방송", "공지", "공략", "커뮤니티"],
    guides: [
      {
        title: "방송 일정",
        category: "방송",
        body: "요일별 고정 방송 시간이 생기면 이 카드가 일정표로 확장됩니다.",
        linkLabel: "일정 준비중",
        url: null
      },
      {
        title: "최근 공지",
        category: "공지",
        body: "휴방, 이벤트, 합방 안내를 가장 짧은 문장으로 고정하는 영역입니다.",
        linkLabel: "공지 보드",
        url: "#notice-board"
      },
      {
        title: "던파 모바일 공략",
        category: "공략",
        body: "직업, 장비, 레이드 공략 영상을 묶어 둘 수 있는 재생목록 슬롯입니다.",
        linkLabel: "재생목록 준비중",
        url: null
      },
      {
        title: "뉴비 훈련소 연결",
        category: "커뮤니티",
        body: "방송 유입이 질문방으로 자연스럽게 넘어가도록 메인 허브와 연결합니다.",
        linkLabel: "dnfm.kr 이동",
        url: "https://dnfm.kr/"
      }
    ],
    linkGroups: [
      {
        title: "허락 채널",
        links: [
          { label: "라이브", url: null, reason: "채널 URL 등록 전" },
          { label: "유튜브", url: null, reason: "유튜브 URL 등록 전" },
          { label: "클립", url: null, reason: "클립 URL 등록 전" }
        ]
      },
      {
        title: "연결",
        links: [
          { label: "뉴비 훈련소", url: "https://dnfm.kr/" },
          { label: "공식 홈페이지", url: "https://dnfm.nexon.com/" },
          { label: "문의", url: "mailto:allow@dnfm.kr" }
        ]
      }
    ],
    timelineTitle: "공지 보드",
    timelineId: "notice-board",
    timeline: [
      {
        time: "고정",
        title: "채널 링크 등록 예정",
        body: "확정된 방송 플랫폼 URL을 받으면 버튼과 링크 보드를 함께 갱신합니다."
      },
      {
        time: "준비",
        title: "소개 문구 확인",
        body: "방송 톤, 주 콘텐츠, 문의 방식이 정해지면 첫 문장을 더 선명하게 바꿉니다."
      },
      {
        time: "배포",
        title: "allow.dnfm.kr 연결",
        body: "DNS CNAME과 Pages 커스텀 도메인을 연결한 뒤 모바일에서 최종 확인합니다."
      }
    ],
    footerNote: "이 페이지는 dnfm.kr 하위 스트리머 페이지 템플릿입니다."
  }
};
