// Cloudflare Workers용 API 핸들러
// 음식 데이터베이스 - Workers 내부에 포함
const foods = [
  // 한식
  { emoji: "🍲", name: "찌개", desc: "김치찌개, 된장찌개 등 다양한 한국 찌개" },
  {
    emoji: "🥣",
    name: "국",
    desc: "미역국, 설렁탕, 순대국 등 따뜻한 국물요리",
  },
  { emoji: "🍜", name: "라면", desc: "신라면, 진라면 등 한국 라면" },
  {
    emoji: "🥄",
    name: "냉면",
    desc: "시원한 육수와 쫄깃한 메밀면의 여름 별미",
  },
  { emoji: "🍜", name: "칼국수", desc: "손으로 뽑은 면발의 구수한 국물요리" },
  { emoji: "🥟", name: "만두", desc: "고기와 야채가 들어간 한국식 만두" },
  {
    emoji: "🍱",
    name: "비빔밥",
    desc: "갖가지 나물과 고추장이 어우러진 영양만점 한식",
  },
  {
    emoji: "🍙",
    name: "김밥",
    desc: "다양한 재료를 김에 싸서 만든 한국 대표 간편식",
  },
  {
    emoji: "🥘",
    name: "불고기",
    desc: "달콤짭짤한 양념에 재운 부드러운 소고기 구이",
  },
  { emoji: "🍖", name: "갈비", desc: "양념에 재워 구운 육즙 가득한 갈비" },
  { emoji: "🍚", name: "백반", desc: "집밥 같은 따뜻함의 한국 정식" },
  { emoji: "🐟", name: "생선구이", desc: "소금구이로 담백하게 구운 생선요리" },
  {
    emoji: "🍛",
    name: "김치볶음밥",
    desc: "매콤한 김치와 밥을 볶은 한국 대표 볶음밥",
  },
  { emoji: "🍛", name: "제육볶음", desc: "매콤한 양념에 볶은 돼지고기와 밥" },
  { emoji: "🍜", name: "떡볶이", desc: "매콤달콤한 고추장 양념의 떡 요리" },
  {
    emoji: "🍤",
    name: "튀김",
    desc: "바삭하게 튀긴 다양한 재료의 한국식 튀김",
  },
  {
    emoji: "🍜",
    name: "육개장",
    desc: "소고기와 고사리를 넣고 끓인 매운 국물 요리",
  },
  {
    emoji: "🍜",
    name: "육개장칼국수",
    desc: "육개장 국물에 칼국수 면을 넣은 든든한 면 요리",
  },
  {
    emoji: "🍜",
    name: "치즈라면",
    desc: "라면에 치즈를 올린 고소한 인스턴트 면 요리",
  },
  {
    emoji: "🍜",
    name: "떡라면",
    desc: "라면에 떡을 넣어 더 든든하게 만든 면 요리",
  },
  { emoji: "🍜", name: "쫄면", desc: "쫄깃한 면발의 매콤달콤한 한국 면 요리" },

  // 중식
  { emoji: "🥟", name: "딤섬", desc: "작고 귀여운 중국식 만두와 점심 요리" },
  {
    emoji: "🍜",
    name: "짜장면",
    desc: "달콤한 춘장 소스의 한국식 중국 면요리",
  },
  { emoji: "🍝", name: "짬뽕", desc: "매콤한 해물 국물의 얼큰한 중국 면요리" },
  {
    emoji: "🥠",
    name: "탕수육",
    desc: "바삭한 튀김옷과 새콤달콤한 소스의 중식",
  },
  {
    emoji: "🦐",
    name: "새우볶음밥",
    desc: "통통한 새우와 계란이 들어간 고소한 볶음밥",
  },
  { emoji: "🍲", name: "마파두부", desc: "매콤하고 얼얼한 사천식 두부 요리" },
  { emoji: "🥟", name: "군만두", desc: "바삭하게 구운 중국식 만두" },
  { emoji: "🍖", name: "깐풍기", desc: "매콤달콤한 소스의 닭고기 요리" },

  // 일식
  { emoji: "🍣", name: "초밥", desc: "신선한 생선과 완벽한 샤리의 조화" },
  { emoji: "🍱", name: "덮밥", desc: "다양한 재료가 올라간 일본식 덮밥" },
  { emoji: "🍜", name: "라멘", desc: "진한 국물의 일본 전통 면요리" },
  { emoji: "🍙", name: "오니기리", desc: "김으로 싼 일본식 주먹밥" },
  {
    emoji: "🥢",
    name: "우동",
    desc: "쫄깃한 면발과 깔끔한 국물의 일본 면요리",
  },
  { emoji: "🍜", name: "소바", desc: "메밀로 만든 일본 전통 면 요리" },
  { emoji: "🍛", name: "규동", desc: "소고기가 올라간 일본식 덮밥" },
  { emoji: "🍱", name: "가츠동", desc: "돈까스가 올라간 일본식 덮밥" },
  { emoji: "🍛", name: "오므라이스", desc: "계란으로 감싼 일본식 볶음밥" },
  { emoji: "🥟", name: "교자", desc: "바삭하고 고소한 일본식 만두" },

  // 양식
  { emoji: "🍕", name: "피자", desc: "다양한 토핑이 올라간 이탈리아 요리" },
  { emoji: "🍔", name: "햄버거", desc: "패티와 야채가 들어간 서양식 샌드위치" },
  {
    emoji: "🍝",
    name: "파스타",
    desc: "다양한 소스와 면이 어우러진 이탈리아 요리",
  },
  {
    emoji: "🥪",
    name: "샌드위치",
    desc: "빵 사이에 다양한 재료를 넣은 간편식",
  },
  { emoji: "🥩", name: "스테이크", desc: "부드럽고 육즙이 풍부한 소고기 구이" },
  { emoji: "🍗", name: "치킨", desc: "바삭하거나 양념된 닭고기 요리" },
  { emoji: "🥪", name: "토스트", desc: "버터와 잼이 발라진 간단한 토스트" },

  // 아시아 퓨전
  {
    emoji: "🌮",
    name: "타코",
    desc: "또띠아에 고기와 채소를 넣은 멕시코 음식",
  },
  {
    emoji: "🌯",
    name: "브리또",
    desc: "또띠아에 다양한 재료를 넣고 말아 만든 멕시코 음식",
  },
  { emoji: "🍛", name: "카레", desc: "향신료가 들어간 다양한 스타일의 카레" },
  { emoji: "🥙", name: "케밥", desc: "중동식 향신료로 양념한 꼬치구이" },
  { emoji: "🍲", name: "쌀국수", desc: "베트남 전통의 깔끔한 국물 쌀면 요리" },
  { emoji: "🥘", name: "팟타이", desc: "새콤달콤한 태국식 볶음 쌀국수" },
  { emoji: "🍜", name: "톰얌꿍", desc: "매콤새콤한 태국 전통 새우 수프" },
  { emoji: "🥘", name: "하이라이스", desc: "일본식 카레와 밥의 조합" },

  // 건강식
  {
    emoji: "🥗",
    name: "샐러드",
    desc: "신선한 야채와 다양한 재료의 건강한 요리",
  },
  { emoji: "🥗", name: "포케볼", desc: "하와이식 생선 샐러드 볼" },

  // 세계 각국 요리
  { emoji: "🥘", name: "파에야", desc: "사프란 향이 나는 스페인 전통 쌀 요리" },
  { emoji: "🥘", name: "리조또", desc: "크리미한 이탈리아 쌀 요리" },

  // 간편식
  { emoji: "🍱", name: "배달 도시락", desc: "간편하고 균형잡힌 한 끼 식사" },
  {
    emoji: "🍱",
    name: "편의점도시락",
    desc: "간편하게 구입할 수 있는 편의점 도시락",
  },
  {
    emoji: "🍜",
    name: "컵라면",
    desc: "간편하고 빠르게 먹을 수 있는 인스턴트 면",
  },
  { emoji: "🍙", name: "주먹밥", desc: "손에 들고 먹기 편한 작은 크기의 밥" },
];

// 게임 세션 저장을 위한 임시 저장소 (실제 프로덕션에서는 KV나 D1 사용 권장)
const gameSessions = new Map();

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // CORS 헤더 설정
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers":
        "Content-Type, Authorization, X-Naver-Client-Id, X-Naver-Client-Secret",
    };

    // OPTIONS 요청 처리 (CORS preflight)
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // 음식 토너먼트 게임 API
      if (url.pathname === "/api/game/foods") {
        return await handleGetFoods(request, corsHeaders);
      }

      if (url.pathname === "/api/game/session") {
        if (request.method === "POST") {
          return await handleCreateSession(request, corsHeaders);
        } else if (request.method === "GET") {
          return await handleGetSession(request, corsHeaders);
        }
      }

      if (url.pathname === "/api/game/choice") {
        return await handleMakeChoice(request, corsHeaders);
      }

      if (url.pathname === "/api/game/result") {
        return await handleGetResult(request, corsHeaders);
      }

      // 근처 음식점 검색
      if (url.pathname === "/api/game/nearby-restaurants") {
        return await handleNearbyRestaurants(request, env, corsHeaders);
      }

      // 네이버 로컬 검색 API 프록시
      if (url.pathname.startsWith("/api/naver/v1/search/local.json")) {
        return await handleNaverLocalSearch(request, env, corsHeaders);
      }

      // 네이버 이미지 검색 API 프록시
      if (url.pathname.startsWith("/api/naver/v1/search/image")) {
        return await handleNaverImageSearch(request, env, corsHeaders);
      }

      // 네이버 Reverse Geocoding API 프록시
      if (url.pathname.startsWith("/api/naver/v1/map-reversegeocode/v2/gc")) {
        return await handleNaverReverseGeocode(request, env, corsHeaders);
      }

      // 헬스 체크
      if (url.pathname === "/api/health") {
        return new Response(
          JSON.stringify({
            status: "OK",
            message: "Hunger Game Cloudflare Workers API is running!",
            environment: "production",
            timestamp: new Date().toISOString(),
            features: ["food-tournament", "naver-api-proxy"],
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      // 정적 파일 서빙 (루트 경로)
      if (url.pathname === "/" || url.pathname === "/index.html") {
        return await serveStaticFile(
          "index.html",
          "text/html",
          corsHeaders,
          env
        );
      }

      if (url.pathname === "/style.css") {
        return await serveStaticFile("style.css", "text/css", corsHeaders, env);
      }

      if (url.pathname === "/script.js") {
        return await serveStaticFile(
          "script.js",
          "application/javascript",
          corsHeaders,
          env
        );
      }

      return new Response("Not Found", { status: 404, headers: corsHeaders });
    } catch (error) {
      console.error("Worker error:", error);
      return new Response(JSON.stringify({ error: "Internal Server Error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  },
};

// 음식 데이터 반환
async function handleGetFoods(request, corsHeaders) {
  const url = new URL(request.url);
  const count = parseInt(url.searchParams.get("count")) || foods.length;

  // 랜덤하게 섞어서 반환
  const shuffled = [...foods].sort(() => 0.5 - Math.random());
  const selectedFoods = shuffled.slice(0, Math.min(count, foods.length));

  return new Response(
    JSON.stringify({
      success: true,
      data: selectedFoods,
      total: foods.length,
    }),
    {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }
  );
}

// 게임 세션 생성
async function handleCreateSession(request, corsHeaders) {
  const sessionId = generateSessionId();
  const initialFoods = [...foods].sort(() => 0.5 - Math.random()).slice(0, 40);

  const gameSession = {
    id: sessionId,
    currentRound: 0,
    totalRounds: 20,
    gamePhase: 1,
    choices: [],
    foodCounts: {},
    availableFoods: initialFoods,
    createdAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
  };

  gameSessions.set(sessionId, gameSession);

  return new Response(
    JSON.stringify({
      success: true,
      data: gameSession,
    }),
    {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }
  );
}

// 게임 세션 조회
async function handleGetSession(request, corsHeaders) {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get("sessionId");

  if (!sessionId) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Session ID is required",
      }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  const session = gameSessions.get(sessionId);
  if (!session) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Session not found",
      }),
      {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  return new Response(
    JSON.stringify({
      success: true,
      data: session,
    }),
    {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }
  );
}

// 선택 처리
async function handleMakeChoice(request, corsHeaders) {
  if (request.method !== "POST") {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Method not allowed",
      }),
      {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  const body = await request.json();
  const { sessionId, selectedFood, currentRound } = body;

  if (!sessionId || !selectedFood) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Session ID and selected food are required",
      }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  const session = gameSessions.get(sessionId);
  if (!session) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Session not found",
      }),
      {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  // 게임 상태 업데이트
  session.currentRound = currentRound + 1;
  session.choices.push(selectedFood);

  // 음식 선택 횟수 업데이트
  const foodName = selectedFood.name;
  session.foodCounts[foodName] = (session.foodCounts[foodName] || 0) + 1;

  // 게임 단계 업데이트
  if (session.currentRound === 12) {
    session.gamePhase = 2;
  } else if (session.currentRound === 18) {
    session.gamePhase = 3;
  }

  session.lastUpdated = new Date().toISOString();
  gameSessions.set(sessionId, session);

  // 다음 라운드 옵션 생성
  let nextOptions = null;
  if (session.currentRound < session.totalRounds) {
    nextOptions = generateNextOptions(session);
  }

  return new Response(
    JSON.stringify({
      success: true,
      data: {
        session,
        nextOptions,
        isGameComplete: session.currentRound >= session.totalRounds,
      },
    }),
    {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }
  );
}

// 게임 결과 조회
async function handleGetResult(request, corsHeaders) {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get("sessionId");

  if (!sessionId) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Session ID is required",
      }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  const session = gameSessions.get(sessionId);
  if (!session) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Session not found",
      }),
      {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  // 최종 우승자 결정
  const winner = decideFinalWinner(session);

  return new Response(
    JSON.stringify({
      success: true,
      data: {
        winner,
        session,
        statistics: {
          totalChoices: session.choices.length,
          foodCounts: session.foodCounts,
          gamePhase: session.gamePhase,
        },
      },
    }),
    {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    }
  );
}

// 다음 라운드 옵션 생성
function generateNextOptions(session) {
  let currentPool = session.availableFoods;

  // 게임 단계에 따른 음식 풀 결정
  if (session.gamePhase === 2) {
    currentPool = getTopFoods(session, 12);
  } else if (session.gamePhase === 3) {
    currentPool = getTopFoods(session, 4);
  }

  // 2개 랜덤 선택
  const shuffled = [...currentPool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 2);
}

// 상위 음식들 추출
function getTopFoods(session, count) {
  const foodScores = new Map();

  // 각 음식의 점수 계산
  for (const [foodName, selectCount] of Object.entries(session.foodCounts)) {
    const food = session.availableFoods.find((f) => f.name === foodName);
    if (food) {
      // 최근 선택일수록 높은 가중치
      const recentSelections = session.choices
        .slice(-8)
        .filter((choice) => choice.name === foodName).length;

      const score = selectCount + recentSelections * 0.5;
      foodScores.set(food, score);
    }
  }

  // 점수순으로 정렬
  const sortedFoods = Array.from(foodScores.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map((entry) => entry[0]);

  // 선택되지 않은 음식들도 일부 포함
  const unselectedFoods = session.availableFoods.filter(
    (food) => !session.foodCounts[food.name]
  );

  const remainingSlots = count - sortedFoods.length;
  if (remainingSlots > 0 && unselectedFoods.length > 0) {
    const randomUnselected = unselectedFoods
      .sort(() => 0.5 - Math.random())
      .slice(0, remainingSlots);
    sortedFoods.push(...randomUnselected);
  }

  return sortedFoods.slice(0, count);
}

// 최종 우승자 결정
function decideFinalWinner(session) {
  if (session.choices.length === 0) {
    return session.availableFoods[0];
  }

  const foodScores = {};

  // 각 음식의 점수 계산
  session.choices.forEach((food, index) => {
    const roundWeight = index < 12 ? 1.0 : index < 18 ? 1.5 : 2.0;
    const recentWeight = index >= session.choices.length - 5 ? 1.2 : 1.0;

    foodScores[food.name] =
      (foodScores[food.name] || 0) + roundWeight * recentWeight;
  });

  // 최고 점수 음식 찾기
  let maxScore = 0;
  let winner = session.choices[session.choices.length - 1];

  for (const [foodName, score] of Object.entries(foodScores)) {
    if (score > maxScore) {
      maxScore = score;
      const food =
        session.availableFoods.find((f) => f.name === foodName) ||
        session.choices.find((f) => f.name === foodName);
      if (food) winner = food;
    }
  }

  return winner;
}

// 세션 ID 생성
function generateSessionId() {
  return (
    "session_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9)
  );
}

// 근처 음식점 검색 핸들러
async function handleNearbyRestaurants(request, env, corsHeaders) {
  try {
    const url = new URL(request.url);
    const foodName = url.searchParams.get("foodName");
    const latitude = url.searchParams.get("latitude");
    const longitude = url.searchParams.get("longitude");
    const radius = url.searchParams.get("radius") || "1500"; // 기본 1.5km

    if (!foodName || !latitude || !longitude) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "foodName, latitude, longitude parameters are required",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // 음식 이름을 기반으로 검색 키워드 생성
    const searchKeywords = generateSearchKeywords(foodName);
    const restaurants = [];

    // 각 키워드로 검색 수행
    for (const keyword of searchKeywords) {
      const searchQuery = `${keyword} ${latitude},${longitude}`;
      const naverUrl = `https://openapi.naver.com/v1/search/local.json?query=${encodeURIComponent(
        searchQuery
      )}&display=10&start=1&sort=distance`;

      const response = await fetch(naverUrl, {
        headers: {
          "X-Naver-Client-Id": env.VITE_NAVER_CLIENT_ID,
          "X-Naver-Client-Secret": env.VITE_NAVER_CLIENT_SECRET,
          "User-Agent": "Mozilla/5.0 (compatible; HungerGame/1.0)",
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.items && data.items.length > 0) {
          // 거리 필터링 및 중복 제거
          const filteredItems = data.items
            .filter((item) => {
              // HTML 태그 제거
              item.title = item.title.replace(/<[^>]*>/g, "");
              item.category = item.category.replace(/<[^>]*>/g, "");
              item.address = item.address.replace(/<[^>]*>/g, "");
              item.roadAddress = item.roadAddress.replace(/<[^>]*>/g, "");

              // 중복 제거 (제목과 주소가 같은 경우)
              return !restaurants.some(
                (existing) =>
                  existing.title === item.title &&
                  existing.address === item.address
              );
            })
            .slice(0, 5); // 키워드당 최대 5개

          restaurants.push(...filteredItems);
        }
      }
    }

    // 거리순으로 정렬하고 최대 15개만 반환
    const sortedRestaurants = restaurants
      .sort((a, b) => {
        // 네이버 API는 이미 거리순으로 정렬되어 있지만, 키워드별로 섞였으므로 재정렬
        return 0; // 현재 순서 유지
      })
      .slice(0, 15);

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          foodName: foodName,
          restaurants: sortedRestaurants,
          total: sortedRestaurants.length,
          searchRadius: `${radius}m`,
        },
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error searching nearby restaurants:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to search nearby restaurants",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
}

// 음식 이름을 기반으로 검색 키워드 생성
function generateSearchKeywords(foodName) {
  const keywordMap = {
    // 한식
    찌개: ["찌개", "김치찌개", "된장찌개", "부대찌개"],
    국: ["국", "미역국", "설렁탕", "순대국", "갈비탕"],
    라면: ["라면", "라멘", "면요리"],
    냉면: ["냉면", "물냉면", "비빔냉면"],
    칼국수: ["칼국수", "수제비", "국수"],
    만두: ["만두", "군만두", "찐만두"],
    비빔밥: ["비빔밥", "돌솥비빔밥"],
    덮밥: ["덮밥", "규동", "가츠동"],
    김밥: ["김밥", "마약김밥"],
    불고기: ["불고기", "양념갈비", "고기구이"],
    갈비: ["갈비", "돼지갈비", "소갈비"],
    백반: ["백반", "한정식", "정식"],
    생선구이: ["생선구이", "조기구이", "고등어구이"],
    김치볶음밥: ["김치볶음밥", "볶음밥"],
    제육볶음: ["제육볶음", "돼지고기볶음"],
    떡볶이: ["떡볶이", "분식"],
    튀김: ["튀김", "오징어튀김", "새우튀김"],
    육개장: ["육개장", "얼큰한국물"],
    육개장칼국수: ["육개장칼국수", "칼국수"],
    치즈라면: ["치즈라면", "라면"],
    떡라면: ["떡라면", "라면"],
    쫄면: ["쫄면", "비빔면"],

    // 중식
    딤섬: ["딤섬", "중식당", "만두"],
    짜장면: ["짜장면", "중국집", "중식"],
    짬뽕: ["짬뽕", "중국집", "중식"],
    탕수육: ["탕수육", "중식당"],
    새우볶음밥: ["새우볶음밥", "볶음밥", "중식"],
    마파두부: ["마파두부", "중식당"],
    군만두: ["군만두", "중식당"],
    깐풍기: ["깐풍기", "중식당"],

    // 일식
    초밥: ["초밥", "스시", "일식당"],
    라멘: ["라멘", "일본라면", "일식"],
    오니기리: ["오니기리", "주먹밥", "일식"],
    우동: ["우동", "일식당"],
    소바: ["소바", "메밀국수", "일식"],
    규동: ["규동", "소고기덮밥", "일식"],
    가츠동: ["가츠동", "돈까스덮밥", "일식"],
    오므라이스: ["오므라이스", "일식당"],
    교자: ["교자", "군만두", "일식"],

    // 양식
    피자: ["피자", "피자헛", "도미노피자"],
    햄버거: ["햄버거", "버거킹", "맥도날드"],
    파스타: ["파스타", "스파게티", "이탈리안"],
    샌드위치: ["샌드위치", "서브웨이", "토스트"],
    스테이크: ["스테이크", "양식당", "고기"],
    치킨: ["치킨", "후라이드치킨", "양념치킨"],
    토스트: ["토스트", "샌드위치"],

    // 기타
    타코: ["타코", "멕시칸", "브리또"],
    브리또: ["브리또", "멕시칸", "타코"],
    카레: ["카레", "인도카레", "일본카레"],
    케밥: ["케밥", "터키음식"],
    쌀국수: ["쌀국수", "베트남음식", "포"],
    팟타이: ["팟타이", "태국음식"],
    톰얌꿍: ["톰얌꿍", "태국음식"],
    하이라이스: ["하이라이스", "카레라이스"],
    샐러드: ["샐러드", "샐러드바"],
    포케볼: ["포케볼", "하와이안"],
  };

  // 키워드 맵에서 찾기
  const keywords = keywordMap[foodName];
  if (keywords) {
    return keywords;
  }

  // 기본 키워드 (맵에 없는 경우)
  return [foodName, `${foodName} 맛집`, "음식점"];
}

// 네이버 로컬 검색 API 핸들러
async function handleNaverLocalSearch(request, env, corsHeaders) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const naverUrl = new URL("https://openapi.naver.com/v1/search/local.json");

  // 쿼리 파라미터 복사
  for (const [key, value] of searchParams) {
    naverUrl.searchParams.set(key, value);
  }

  const response = await fetch(naverUrl.toString(), {
    headers: {
      "X-Naver-Client-Id": env.VITE_NAVER_CLIENT_ID,
      "X-Naver-Client-Secret": env.VITE_NAVER_CLIENT_SECRET,
      "User-Agent": "Mozilla/5.0 (compatible; LunchHunt/1.0)",
    },
  });

  const data = await response.json();

  return new Response(JSON.stringify(data), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

// 네이버 이미지 검색 API 핸들러
async function handleNaverImageSearch(request, env, corsHeaders) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const naverUrl = new URL("https://openapi.naver.com/v1/search/image");

  // 쿼리 파라미터 복사
  for (const [key, value] of searchParams) {
    naverUrl.searchParams.set(key, value);
  }

  const response = await fetch(naverUrl.toString(), {
    headers: {
      "X-Naver-Client-Id": env.VITE_NAVER_CLIENT_ID,
      "X-Naver-Client-Secret": env.VITE_NAVER_CLIENT_SECRET,
      "User-Agent": "Mozilla/5.0 (compatible; LunchHunt/1.0)",
    },
  });

  const data = await response.json();

  return new Response(JSON.stringify(data), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

// 네이버 Reverse Geocoding API 핸들러
async function handleNaverReverseGeocode(request, env, corsHeaders) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const naverUrl = new URL(
    "https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc"
  );

  // 쿼리 파라미터 복사
  for (const [key, value] of searchParams) {
    naverUrl.searchParams.set(key, value);
  }

  const response = await fetch(naverUrl.toString(), {
    headers: {
      "X-Naver-Client-Id": env.VITE_NAVER_CLIENT_ID,
      "X-Naver-Client-Secret": env.VITE_NAVER_CLIENT_SECRET,
      "User-Agent": "Mozilla/5.0 (compatible; LunchHunt/1.0)",
    },
  });

  const data = await response.json();

  return new Response(JSON.stringify(data), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

// 정적 파일 서빙 함수
async function serveStaticFile(filename, contentType, corsHeaders, env) {
  // Assets binding을 사용해서 정적 파일 서빙
  if (env.ASSETS) {
    try {
      const asset = await env.ASSETS.fetch(
        new Request(`http://placeholder/${filename}`)
      );
      if (asset.status === 200) {
        const content = await asset.text();
        return new Response(content, {
          headers: { ...corsHeaders, "Content-Type": contentType },
        });
      }
    } catch (error) {
      console.error(`Error serving ${filename}:`, error);
    }
  }

  let content = "";

  switch (filename) {
    case "style.css":
      // CSS 파일을 찾을 수 없으므로 404 반환
      return new Response("CSS file not found", {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "text/css" },
      });

    case "script.js":
      // JavaScript 파일을 찾을 수 없으므로 404 반환
      return new Response("JavaScript file not found", {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/javascript" },
      });

    case "index.html":
      content = `<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>오늘 뭐 먹지? 🍽️ 토너먼트</title>
    <link rel="stylesheet" href="style.css" />
    <link
      href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap"
      rel="stylesheet" />
  </head>
  <body>
    <div class="container">
      <header class="header">
        <h1>🍽️ 오늘 뭐 먹지?</h1>
        <p class="subtitle">토너먼트로 결정해보세요!</p>
      </header>

      <div class="game-container">
        <!-- 시작 화면 -->
        <div id="start-screen" class="screen active">
          <div class="start-content">
            <div class="game-info">
              <h2>게임 방법</h2>
              <ul>
                <li>두 개의 음식 중 하나를 선택하세요</li>
                <li>총 20번의 선택을 통해 최종 음식을 결정합니다</li>
                <li>당신의 취향에 맞는 음식을 찾아보세요!</li>
              </ul>
            </div>
            <button id="start-btn" class="start-button">게임 시작 🎮</button>
          </div>
        </div>

        <!-- 게임 화면 -->
        <div id="game-screen" class="screen">
          <div class="progress-container">
            <div class="progress-bar">
              <div id="progress" class="progress-fill"></div>
            </div>
            <span id="round-counter" class="round-text">1 / 20</span>
          </div>

          <div class="vs-container">
            <div class="food-option" id="option1">
              <div class="food-emoji" id="emoji1">🍕</div>
              <h3 id="name1" class="food-name">피자</h3>
              <p id="desc1" class="food-desc">치즈가 듬뿍 들어간 맛있는 피자</p>
            </div>

            <div class="vs-divider">
              <span class="vs-text">VS</span>
            </div>

            <div class="food-option" id="option2">
              <div class="food-emoji" id="emoji2">🍜</div>
              <h3 id="name2" class="food-name">라면</h3>
              <p id="desc2" class="food-desc">따뜻하고 얼큰한 라면</p>
            </div>
          </div>
        </div>

        <!-- 결과 화면 -->
        <div id="result-screen" class="screen">
          <div class="result-content">
            <h2>🎉 결정되었습니다!</h2>
            <div class="final-food">
              <div id="final-emoji" class="final-emoji">🍕</div>
              <h3 id="final-name" class="final-name">피자</h3>
              <p id="final-desc" class="final-desc">오늘은 이걸로 결정!</p>
            </div>
            
            <!-- 근처 음식점 찾기 섹션 -->
            <div class="nearby-section">
              <button id="find-nearby-btn" class="find-nearby-button">
                📍 내 근처 음식점 찾기
              </button>
              <div id="location-status" class="location-status"></div>
              <div id="restaurants-container" class="restaurants-container hidden">
                <h3 class="restaurants-title">근처 음식점 (1.5km 이내)</h3>
                <div id="restaurants-list" class="restaurants-list"></div>
              </div>
            </div>
            
            <button id="restart-btn" class="restart-button">
              다시 하기 🔄
            </button>
          </div>
        </div>
      </div>
    </div>

    <script src="script.js"></script>
  </body>
</html>`;
      break;

    default:
      return new Response("File not found", {
        status: 404,
        headers: corsHeaders,
      });
  }

  return new Response(content, {
    headers: { ...corsHeaders, "Content-Type": contentType },
  });
}
