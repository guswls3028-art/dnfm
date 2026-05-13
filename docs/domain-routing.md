# 도메인 라우팅

## 목표

- `dnfm.kr`: 던파 모바일 뉴비 훈련소 커뮤니티 허브
- `www.dnfm.kr`: `dnfm.kr`과 동일한 화면
- `allow.dnfm.kr`: 허락님 스트리머 페이지

## 현재 코드 동작

두 사이트는 한 앱에서 호스트명 분기하지 않고 독립 Next.js 앱으로 나눕니다.

- `newb/`: `dnfm.kr`, `www.dnfm.kr`
- `allow/`: `allow.dnfm.kr`

## 배포 흐름

1. 배포 플랫폼에서 프로젝트를 두 개 만든다.
2. `dnfm.kr` 프로젝트의 루트 디렉터리를 `newb`로 설정한다.
3. `allow.dnfm.kr` 프로젝트의 루트 디렉터리를 `allow`로 설정한다.
4. 두 프로젝트 모두 빌드 명령은 `pnpm build`로 둔다.
5. DNS에서 `dnfm.kr`, `www.dnfm.kr`, `allow.dnfm.kr`를 각 프로젝트가 안내하는 레코드로 연결한다.
6. HTTPS 활성화 후 모바일과 데스크톱에서 두 호스트를 각각 확인한다.

## 추후 분리 기준

허락님 페이지가 자체 관리자, 게시판, 방송 API 연동을 갖게 되어도 `allow/` 앱 안에서 독립적으로 확장합니다.
