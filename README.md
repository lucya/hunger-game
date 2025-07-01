# 🍽️ Hunger Game

**음식 토너먼트 게임 & 위치 기반 맛집 찾기 서비스**

[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers-orange)](https://hunger-game-api.natureweb.workers.dev)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Naver API](https://img.shields.io/badge/Naver-Local%20API-green)](https://developers.naver.com/docs/serviceapi/search/local/local.md)

## 🎯 프로젝트 소개

**Hunger Game**은 "오늘 뭐 먹지?"라는 일상적인 고민을 재미있는 토너먼트 게임으로 해결해주는 웹 애플리케이션입니다.

800개 이상의 다양한 음식 중에서 20라운드의 1:1 대결을 통해 당신의 진짜 취향을 찾아드리고, 게임이 끝나면 현재 위치 기반으로 우승한 음식을 파는 실제 맛집을 추천해드립니다.

### ✨ 주요 특징

- 🏆 **토너먼트 방식**: 20라운드 1:1 대결로 공정한 선택
- 📍 **위치 기반 서비스**: 게임 결과와 연계된 실제 맛집 추천
- 📱 **모바일 최적화**: 웹브라우저와 Expo 앱 완벽 지원
- 🌏 **다양한 음식**: 한식, 중식, 일식, 양식 등 800+ 개 음식 데이터
- ⚡ **빠른 성능**: 서버리스 아키텍처로 빠른 응답 속도

## 🎮 게임 방식

### 3단계 토너먼트 시스템

1. **1단계 (1-10라운드)**: 완전 랜덤 선택으로 다양한 음식 탐색
2. **2단계 (11-15라운드)**: 상위 음식과 새로운 음식의 혼합 대결
3. **3단계 (16-20라운드)**: 상위 음식들 간의 최종 대결

### 🏅 결과 분석

- 우승 음식 발표
- 선택 통계 및 순위
- 현재 위치 기반 맛집 추천

## 🚀 라이브 데모

**🌐 [Hunger Game 플레이하기](https://hunger-game-api.natureweb.workers.dev)**

## 📱 스크린샷

```
🎮 게임 화면          📊 결과 화면          📍 맛집 추천
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│  🍕 vs 🍜   │      │ 🏆 우승: 🍕  │      │ 📍 서울시    │
│             │  →   │ 피자 (12번)  │  →   │ 🍕 도미노피자 │
│ [피자] [라면] │      │ 2위: 🍜 (8번) │      │ 🍕 피자헛    │
└─────────────┘      └─────────────┘      └─────────────┘
```

## 🛠️ 기술 스택

### Frontend

- **HTML5/CSS3**: 반응형 UI
- **Vanilla JavaScript**: ES6+ 문법 활용
- **Geolocation API**: 위치 기반 서비스

### Backend

- **Cloudflare Workers**: 서버리스 컴퓨팅
- **Naver Local Search API**: 맛집 검색
- **Naver Reverse Geocoding API**: 주소 변환

### Deployment

- **Cloudflare Workers**: 글로벌 CDN 배포
- **GitHub**: 소스 코드 관리
- **Wrangler CLI**: 배포 자동화

## 📦 설치 및 실행

### 사전 요구사항

- Node.js 16+
- npm 또는 yarn
- Cloudflare 계정
- Naver Developers 계정

### 로컬 개발 환경 설정

```bash
# 1. 저장소 클론
git clone https://github.com/lucya/hunger-game.git
cd hunger-game

# 2. 의존성 설치
npm install

# 3. 환경 변수 설정
cp .env.example .env
# .env 파일에 네이버 API 키 입력

# 4. 로컬 개발 서버 실행
npx wrangler dev --port 8787 --local
```

### 환경 변수 설정

```bash
# Wrangler secrets 설정
npx wrangler secret put NAVER_CLIENT_ID
npx wrangler secret put NAVER_CLIENT_SECRET
```

### 배포

```bash
# 프로덕션 배포
npx wrangler deploy

# 특정 환경 배포
npx wrangler deploy --env production
```

## 🗂️ 프로젝트 구조

```
hunger-game/
├── 📄 index.html          # 메인 HTML 파일
├── 🎨 style.css           # CSS 스타일시트
├── ⚡ script.js           # 프론트엔드 게임 로직
├── 🍕 foods.js            # 음식 데이터 (800+ 개)
├── 📁 workers/
│   └── 🔧 api.js          # Cloudflare Workers API
├── ⚙️ wrangler.toml       # Workers 설정 파일
├── 📦 package.json        # 의존성 관리
├── 📝 README.md           # 프로젝트 문서 (본 파일)
└── 📊 PROGRESS_LOG.md     # 개발 기록
```

## 🔌 API 엔드포인트

| 엔드포인트                     | 메서드 | 기능             | 파라미터                              |
| ------------------------------ | ------ | ---------------- | ------------------------------------- |
| `/api/health`                  | GET    | 서버 상태 체크   | -                                     |
| `/api/game/session`            | POST   | 게임 세션 생성   | -                                     |
| `/api/game/choice`             | POST   | 게임 선택 처리   | sessionId, selectedFood, currentRound |
| `/api/game/result`             | GET    | 게임 결과 조회   | sessionId                             |
| `/api/game/nearby-restaurants` | GET    | 근처 음식점 검색 | foodName, latitude, longitude, radius |
| `/api/naver/reverse-geocode`   | GET    | 좌표→주소 변환   | coords, orders                        |

## 🎯 사용법

### 웹 브라우저

1. [https://hunger-game-api.natureweb.workers.dev](https://hunger-game-api.natureweb.workers.dev) 접속
2. "게임 시작" 버튼 클릭
3. 20라운드 동안 선호하는 음식 선택
4. 결과 확인 및 맛집 추천 받기

### Expo 앱 연동

```javascript
// Expo 앱에서 위치 정보 전달
window.hungerGame.setLocationFromExpo(latitude, longitude);

// API URL 설정 (선택사항)
window.hungerGame.setApiUrlFromExpo("https://your-api-url.com");
```

## 🍕 음식 데이터

### 카테고리별 분류 (총 800+ 개)

- **한식**: 김치찌개, 비빔밥, 불고기, 갈비, 냉면 등 (200+ 개)
- **중식**: 짜장면, 짬뽕, 탕수육, 마파두부 등 (150+ 개)
- **일식**: 초밥, 라멘, 돈까스, 우동 등 (150+ 개)
- **양식**: 피자, 파스타, 스테이크, 햄버거 등 (150+ 개)
- **기타**: 치킨, 디저트, 음료, 간식 등 (150+ 개)

### 데이터 구조

```javascript
{
  name: "김치찌개",           // 음식명
  emoji: "🍲",              // 이모지
  desc: "한국의 대표적인 찌개 요리"  // 설명
}
```

## 🔧 개발 도구

### 디버깅

```javascript
// 브라우저 콘솔에서 사용 가능한 디버깅 도구
window.debugGame.checkApiConnection(); // API 연결 상태 확인
window.debugGame.getGameState(); // 현재 게임 상태 조회
window.debugGame.forceStartGame(); // 강제 게임 시작
```

### 로깅

- 상세한 에러 로깅 및 사용자 가이드 제공
- 네트워크 요청/응답 모니터링
- 위치 서비스 상태 추적

## 🐛 문제 해결

### 자주 발생하는 문제

**Q: 위치 정보를 가져올 수 없어요**

```
A: 브라우저 설정에서 위치 권한을 허용해주세요.
   Chrome: 설정 > 개인정보 및 보안 > 사이트 설정 > 위치
```

**Q: 맛집 검색이 안돼요**

```
A: 네트워크 연결을 확인하고, 위치 서비스가 활성화되어 있는지 확인해주세요.
```

**Q: 게임이 멈춰요**

```
A: 페이지를 새로고침하거나, 브라우저 캐시를 삭제해보세요.
```

### 디버깅 정보 확인

```javascript
// 콘솔에서 실행
console.log(window.debugGame.getGameState());
```

## 🤝 기여하기

### 기여 방법

1. **Fork** 이 저장소
2. **Feature branch** 생성 (`git checkout -b feature/amazing-feature`)
3. **Commit** 변경사항 (`git commit -m 'Add amazing feature'`)
4. **Push** to branch (`git push origin feature/amazing-feature`)
5. **Pull Request** 생성

### 개발 가이드라인

- 코드 스타일: ES6+ 문법 사용
- 커밋 메시지: 영어로 작성, 명확한 설명
- 테스트: 새로운 기능 추가시 테스트 케이스 포함
- 문서: 주요 변경사항은 README 업데이트

## 📄 라이선스

이 프로젝트는 **MIT License** 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 👨‍💻 개발자

**Adele**

- GitHub: [@lucya](https://github.com/lucya)
- 프로젝트 URL: [https://github.com/lucya/hunger-game](https://github.com/lucya/hunger-game)

## 🙏 감사의 말

- **Naver Developers**: 지도 API 및 로컬 검색 API 제공
- **Cloudflare**: 서버리스 플랫폼 제공
- **모든 테스터들**: 소중한 피드백과 버그 리포트

## 📊 프로젝트 통계

- **음식 데이터**: 800+ 개
- **지원 지역**: 대한민국 전국
- **평균 게임 시간**: 3-5분
- **API 응답 시간**: 평균 300ms
- **모바일 호환성**: 100%

---

### 🎮 지금 바로 플레이하세요!

**[🍽️ Hunger Game 시작하기](https://hunger-game-api.natureweb.workers.dev)**

_"오늘 뭐 먹지?"의 해답을 찾아보세요!_
