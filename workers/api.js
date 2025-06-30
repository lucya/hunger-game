// Cloudflare Workers API 서버
import { foods } from "../foods.js";

// 게임 세션 저장소 (메모리 기반 - 실제 운영에서는 KV나 D1 사용 권장)
const gameSessions = new Map();

// CORS 헤더 설정
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400",
};

// 메인 요청 핸들러
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // CORS preflight 요청 처리
    if (method === "OPTIONS") {
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      });
    }

    try {
      // API 라우팅
      if (path.startsWith("/api/")) {
        return await handleApiRequest(request, env, path, method);
      }

      // 기본 응답
      return new Response("Hunger Game API Server", {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "text/plain",
        },
      });
    } catch (error) {
      console.error("Request error:", error);
      return new Response(
        JSON.stringify({
          success: false,
          error: error.message || "Internal server error",
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }
  },
};

// API 요청 처리
async function handleApiRequest(request, env, path, method) {
  const url = new URL(request.url);

  // 헬스 체크
  if (path === "/api/health" && method === "GET") {
    return jsonResponse({
      success: true,
      status: "OK",
      timestamp: new Date().toISOString(),
      environment: env.ENVIRONMENT || "development",
    });
  }

  // 게임 세션 생성
  if (path === "/api/game/session" && method === "POST") {
    return await handleCreateSession();
  }

  // 게임 선택 처리
  if (path === "/api/game/choice" && method === "POST") {
    return await handleGameChoice(request);
  }

  // 게임 결과 조회
  if (path === "/api/game/result" && method === "GET") {
    return await handleGameResult(url);
  }

  // 근처 음식점 검색
  if (path === "/api/game/nearby-restaurants" && method === "GET") {
    return await handleNearbyRestaurants(url, env);
  }

  // 네이버 역지오코딩
  if (path === "/api/naver/reverse-geocode" && method === "GET") {
    return await handleReverseGeocode(url, env);
  }

  // 404 처리
  return jsonResponse(
    {
      success: false,
      error: "API endpoint not found",
    },
    404
  );
}

// 게임 세션 생성
async function handleCreateSession() {
  const sessionId = generateSessionId();
  const shuffledFoods = [...foods].sort(() => 0.5 - Math.random());
  const availableFoods = shuffledFoods.slice(0, 40);

  const session = {
    id: sessionId,
    currentRound: 0,
    totalRounds: 20,
    gamePhase: 1,
    choices: [],
    foodCounts: {},
    availableFoods: availableFoods,
    createdAt: new Date().toISOString(),
  };

  // 음식별 카운트 초기화
  availableFoods.forEach((food) => {
    session.foodCounts[food.name] = 0;
  });

  gameSessions.set(sessionId, session);

  return jsonResponse({
    success: true,
    data: session,
  });
}

// 게임 선택 처리
async function handleGameChoice(request) {
  const body = await request.json();
  const { sessionId, selectedFood, currentRound } = body;

  const session = gameSessions.get(sessionId);
  if (!session) {
    return jsonResponse(
      {
        success: false,
        error: "Session not found",
      },
      404
    );
  }

  // 선택 기록
  session.choices.push({
    round: currentRound + 1,
    selectedFood: selectedFood.name,
    timestamp: new Date().toISOString(),
  });

  // 선택된 음식 카운트 증가
  session.foodCounts[selectedFood.name] =
    (session.foodCounts[selectedFood.name] || 0) + 1;
  session.currentRound = currentRound + 1;

  // 게임 단계 업데이트
  if (session.currentRound >= 10) {
    session.gamePhase = 2;
  }

  // 게임 완료 체크
  const isGameComplete = session.currentRound >= session.totalRounds;
  let nextOptions = [];

  if (!isGameComplete) {
    // 다음 라운드 옵션 생성
    if (session.gamePhase === 1) {
      // 1단계: 랜덤 선택
      const shuffled = [...session.availableFoods].sort(
        () => 0.5 - Math.random()
      );
      nextOptions = shuffled.slice(0, 2);
    } else {
      // 2단계: 상위 음식들 간의 대결
      const sortedFoods = session.availableFoods
        .filter((food) => session.foodCounts[food.name] > 0)
        .sort(
          (a, b) => session.foodCounts[b.name] - session.foodCounts[a.name]
        );

      if (sortedFoods.length >= 2) {
        nextOptions = sortedFoods.slice(0, 2);
      } else {
        const shuffled = [...session.availableFoods].sort(
          () => 0.5 - Math.random()
        );
        nextOptions = shuffled.slice(0, 2);
      }
    }
  }

  return jsonResponse({
    success: true,
    data: {
      session: session,
      isGameComplete: isGameComplete,
      nextOptions: nextOptions,
    },
  });
}

// 게임 결과 조회
async function handleGameResult(url) {
  const sessionId = url.searchParams.get("sessionId");

  const session = gameSessions.get(sessionId);
  if (!session) {
    return jsonResponse(
      {
        success: false,
        error: "Session not found",
      },
      404
    );
  }

  // 최종 우승자 결정
  let maxCount = 0;
  let winner = null;

  for (const [foodName, count] of Object.entries(session.foodCounts)) {
    if (count > maxCount) {
      maxCount = count;
      winner = session.availableFoods.find((food) => food.name === foodName);
    }
  }

  if (!winner) {
    winner = session.availableFoods[0];
  }

  return jsonResponse({
    success: true,
    data: {
      winner: winner,
      session: session,
      topFoods: Object.entries(session.foodCounts)
        .filter(([_, count]) => count > 0)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([foodName, count]) => ({
          food: session.availableFoods.find((food) => food.name === foodName),
          count: count,
        })),
    },
  });
}

// 근처 음식점 검색
async function handleNearbyRestaurants(url, env) {
  const foodName = url.searchParams.get("foodName");
  const latitude = parseFloat(url.searchParams.get("latitude"));
  const longitude = parseFloat(url.searchParams.get("longitude"));
  const radius = parseInt(url.searchParams.get("radius")) || 1500;

  if (!foodName || isNaN(latitude) || isNaN(longitude)) {
    return jsonResponse(
      {
        success: false,
        error:
          "Missing or invalid required parameters: foodName, latitude, longitude",
        received: {
          foodName,
          latitude: url.searchParams.get("latitude"),
          longitude: url.searchParams.get("longitude"),
          parsedLatitude: latitude,
          parsedLongitude: longitude,
        },
      },
      400
    );
  }

  // 네이버 API 키 확인
  if (!env.NAVER_CLIENT_ID || !env.NAVER_CLIENT_SECRET) {
    return jsonResponse(
      {
        success: false,
        error: "Naver API credentials not configured",
      },
      500
    );
  }

  try {
    // 검색 키워드 생성
    const searchKeywords = generateSearchKeywords(foodName);
    const allRestaurants = [];

    // 각 키워드로 검색
    for (const keyword of searchKeywords) {
      try {
        const restaurants = await searchNaverLocal(
          keyword,
          latitude,
          longitude,
          radius,
          env
        );
        allRestaurants.push(...restaurants);
      } catch (error) {
        console.error(`Search failed for keyword: ${keyword}`, error);
      }
    }

    // 중복 제거 및 정렬
    const uniqueRestaurants = removeDuplicateRestaurants(allRestaurants);
    const sortedRestaurants = sortByDistance(
      uniqueRestaurants,
      latitude,
      longitude
    );
    const finalRestaurants = sortedRestaurants.slice(0, 15);

    return jsonResponse({
      success: true,
      data: {
        restaurants: finalRestaurants,
        total: finalRestaurants.length,
        searchKeywords: searchKeywords,
        location: { latitude, longitude, radius },
      },
    });
  } catch (error) {
    console.error("Nearby restaurants search error:", error);
    return jsonResponse(
      {
        success: false,
        error: "Failed to search nearby restaurants",
      },
      500
    );
  }
}

// 네이버 역지오코딩
async function handleReverseGeocode(url, env) {
  const coords = url.searchParams.get("coords");
  const sourcecrs = url.searchParams.get("sourcecrs") || "epsg:4326";
  const targetcrs = url.searchParams.get("targetcrs") || "epsg:4326";
  const orders = url.searchParams.get("orders") || "roadaddr,addr";

  if (!coords) {
    return jsonResponse(
      {
        success: false,
        error: "Missing coords parameter",
      },
      400
    );
  }

  if (!env.NAVER_CLIENT_ID || !env.NAVER_CLIENT_SECRET) {
    return jsonResponse(
      {
        success: false,
        error: "Naver API credentials not configured",
      },
      500
    );
  }

  try {
    const naverUrl = `https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc?coords=${coords}&sourcecrs=${sourcecrs}&targetcrs=${targetcrs}&orders=${orders}`;

    const response = await fetch(naverUrl, {
      headers: {
        "X-NCP-APIGW-API-KEY-ID": env.NAVER_CLIENT_ID,
        "X-NCP-APIGW-API-KEY": env.NAVER_CLIENT_SECRET,
      },
    });

    if (!response.ok) {
      throw new Error(`Naver API error: ${response.status}`);
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Reverse geocode error:", error);
    return jsonResponse(
      {
        success: false,
        error: "Failed to reverse geocode",
      },
      500
    );
  }
}

// 네이버 로컬 검색
async function searchNaverLocal(query, latitude, longitude, radius, env) {
  const naverUrl = `https://openapi.naver.com/v1/search/local.json?query=${encodeURIComponent(
    query
  )}&coordinate=${longitude},${latitude}&radius=${radius}&display=20&start=1&sort=distance`;

  const response = await fetch(naverUrl, {
    headers: {
      "X-Naver-Client-Id": env.NAVER_CLIENT_ID,
      "X-Naver-Client-Secret": env.NAVER_CLIENT_SECRET,
    },
  });

  if (!response.ok) {
    throw new Error(`Naver Local API error: ${response.status}`);
  }

  const data = await response.json();

  return data.items.map((item) => ({
    title: removeHtmlTags(item.title),
    category: item.category,
    address: item.address,
    roadAddress: item.roadAddress,
    telephone: item.telephone,
    link: item.link,
    mapx: item.mapx,
    mapy: item.mapy,
  }));
}

// 검색 키워드 생성
function generateSearchKeywords(foodName) {
  const keywordMap = {
    // 한식
    김치찌개: ["김치찌개", "김치찌개 맛집", "한식", "찌개"],
    된장찌개: ["된장찌개", "된장찌개 맛집", "한식", "찌개"],
    비빔밥: ["비빔밥", "비빔밥 맛집", "한식", "밥"],
    불고기: ["불고기", "불고기 맛집", "한식", "고기"],
    갈비: ["갈비", "갈비 맛집", "한식", "고기"],
    삼겹살: ["삼겹살", "삼겹살 맛집", "한식", "고기", "구이"],
    냉면: ["냉면", "냉면 맛집", "한식", "면"],
    떡볶이: ["떡볶이", "떡볶이 맛집", "한식", "분식"],

    // 중식
    짜장면: ["짜장면", "짜장면 맛집", "중식", "면"],
    짬뽕: ["짬뽕", "짬뽕 맛집", "중식", "면"],
    탕수육: ["탕수육", "탕수육 맛집", "중식"],
    마파두부: ["마파두부", "마파두부 맛집", "중식"],

    // 일식
    초밥: ["초밥", "초밥 맛집", "일식", "스시"],
    라멘: ["라멘", "라멘 맛집", "일식", "면"],
    돈까스: ["돈까스", "돈까스 맛집", "일식"],
    우동: ["우동", "우동 맛집", "일식", "면"],

    // 양식
    피자: ["피자", "피자 맛집", "양식"],
    파스타: ["파스타", "파스타 맛집", "양식", "면"],
    스테이크: ["스테이크", "스테이크 맛집", "양식", "고기"],
    햄버거: ["햄버거", "햄버거 맛집", "양식", "버거"],

    // 기타
    치킨: ["치킨", "치킨 맛집", "닭"],
    족발: ["족발", "족발 맛집", "한식"],
    보쌈: ["보쌈", "보쌈 맛집", "한식"],
  };

  return keywordMap[foodName] || [foodName, `${foodName} 맛집`];
}

// HTML 태그 제거
function removeHtmlTags(str) {
  return str.replace(/<[^>]*>/g, "");
}

// 중복 음식점 제거
function removeDuplicateRestaurants(restaurants) {
  const seen = new Set();
  return restaurants.filter((restaurant) => {
    const key = `${restaurant.title}-${restaurant.address}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

// 거리순 정렬
function sortByDistance(restaurants, userLat, userLng) {
  return restaurants.sort((a, b) => {
    const distA = calculateDistance(
      userLat,
      userLng,
      a.mapy / 10000000,
      a.mapx / 10000000
    );
    const distB = calculateDistance(
      userLat,
      userLng,
      b.mapy / 10000000,
      b.mapx / 10000000
    );
    return distA - distB;
  });
}

// 거리 계산 (Haversine formula)
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // 지구 반지름 (km)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// 세션 ID 생성
function generateSessionId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// JSON 응답 헬퍼
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status: status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
}
