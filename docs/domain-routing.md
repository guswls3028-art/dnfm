# 도메인 라우팅

## 목표

- `dnfm.kr`: 던파 모바일 뉴비 훈련소 커뮤니티 허브
- `www.dnfm.kr`: `dnfm.kr`과 동일한 화면
- `allow.dnfm.kr`: 허락님 스트리머 페이지

## 현재 코드 동작

`src/app.js`는 현재 호스트명을 보고 `src/content.js`의 `hostnames`와 비교합니다.

- `dnfm.kr`, `www.dnfm.kr`이면 `training` 사이트 렌더링
- `allow.dnfm.kr`이면 `allow` 사이트 렌더링
- 로컬에서 `?site=allow`를 붙이면 허락님 페이지 미리보기

## Cloudflare Pages 기준 배포 흐름

1. `pnpm run build`로 `dist/` 생성
2. Pages 프로젝트의 빌드 명령을 `pnpm run build`로 설정
3. 출력 폴더를 `dist`로 설정
4. 커스텀 도메인에 `dnfm.kr`, `www.dnfm.kr`, `allow.dnfm.kr` 추가
5. DNS에서 각 도메인을 Pages가 안내하는 CNAME 또는 apex 레코드로 연결
6. HTTPS 활성화 후 모바일과 데스크톱에서 두 호스트를 각각 확인

## 추후 분리 기준

허락님 페이지가 자체 관리자, 게시판, 방송 API 연동을 갖게 되면 별도 앱으로 분리할 수 있습니다. 지금은 콘텐츠 양이 작고 운영자가 같으므로 한 정적 프로젝트에서 호스트명만 분기하는 편이 관리 비용이 낮습니다.
