// 순수 클라이언트 사이드 음식 토너먼트 게임
class FoodTournamentGame {
  constructor() {
    this.sessionId = null;
    this.currentRound = 0;
    this.totalRounds = 20;
    this.currentOptions = [];
    this.gameSession = null;
    this.availableFoods = [];
    this.choices = [];
    this.foodCounts = {};
    this.apiBaseUrl = this.getApiBaseUrl();
  }

  // API 기본 URL 설정
  getApiBaseUrl() {
    // 로컬 개발 시 Workers 개발 서버 사용
    if (
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1"
    ) {
      return "http://localhost:8787"; // Wrangler dev 서버
    }

    // 배포된 도메인에서는 같은 호스트 사용
    if (
      window.location.hostname.includes("hunger-game.natureweb.workers.dev")
    ) {
      return "";
    }

    // 기본값: 배포된 Workers URL
    return "https://hunger-game-api.natureweb.workers.dev";
  }

  // Expo 앱에서 API URL 설정
  setApiUrlFromExpo(url) {
    if (url && typeof url === "string" && url.trim()) {
      this.apiBaseUrl = url.trim();
      console.log("API URL set from Expo:", this.apiBaseUrl);
      return true;
    }
    return false;
  }

  // API 호출 헬퍼
  async apiCall(endpoint, options = {}) {
    const url = `${this.apiBaseUrl}/api${endpoint}`;
    const defaultOptions = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    const finalOptions = { ...defaultOptions, ...options };

    console.log(`API Call: ${finalOptions.method || "GET"} ${url}`);

    try {
      const response = await fetch(url, finalOptions);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error("API call failed:", error);
      throw error;
    }
  }

  // 게임 시작
  async startGame() {
    try {
      console.log("Starting game with API server:", this.apiBaseUrl);

      // API 헬스 체크
      try {
        await this.apiCall("/health");
        console.log("API server is healthy");
      } catch (error) {
        console.warn("API health check failed:", error);
      }

      // 게임 세션 생성
      const response = await this.apiCall("/game/session", {
        method: "POST",
      });

      if (!response.success) {
        throw new Error(response.error || "Failed to create game session");
      }

      this.gameSession = response.data;
      this.sessionId = this.gameSession.id;
      this.currentRound = this.gameSession.currentRound;
      this.availableFoods = this.gameSession.availableFoods;
      this.foodCounts = this.gameSession.foodCounts;

      console.log("Game session created:", this.sessionId);

      // 첫 번째 라운드 시작
      await this.startNextRound();
    } catch (error) {
      console.error("Failed to start game:", error);
      this.showError(`게임 시작 실패: ${error.message}`);
    }
  }

  // 다음 라운드 시작
  async startNextRound() {
    if (this.currentRound >= this.totalRounds) {
      await this.showResult();
      return;
    }

    // 옵션 생성 (첫 라운드는 랜덤, 이후는 서버에서 결정)
    if (this.currentRound === 0) {
      const shuffled = [...this.availableFoods].sort(() => 0.5 - Math.random());
      this.currentOptions = shuffled.slice(0, 2);
    }

    this.displayOptions();
  }

  // 선택 처리
  async makeChoice(selectedFood) {
    try {
      const response = await this.apiCall("/game/choice", {
        method: "POST",
        body: JSON.stringify({
          sessionId: this.sessionId,
          selectedFood: selectedFood,
          currentRound: this.currentRound,
        }),
      });

      if (!response.success) {
        throw new Error(response.error || "Failed to process choice");
      }

      // 게임 상태 업데이트
      this.gameSession = response.data.session;
      this.currentRound = this.gameSession.currentRound;
      this.foodCounts = this.gameSession.foodCounts;

      // 게임 완료 체크
      if (response.data.isGameComplete) {
        await this.showResult();
      } else {
        // 다음 옵션 설정
        this.currentOptions = response.data.nextOptions;
        this.displayOptions();
      }
    } catch (error) {
      console.error("Failed to make choice:", error);
      this.showError(`선택 처리 실패: ${error.message}`);
    }
  }

  // 결과 표시
  async showResult() {
    try {
      const response = await this.apiCall(
        `/game/result?sessionId=${this.sessionId}`
      );

      if (!response.success) {
        throw new Error(response.error || "Failed to get game result");
      }

      const { winner, topFoods } = response.data;

      // 결과 화면 표시
      document.getElementById("game-screen").classList.remove("active");
      document.getElementById("result-screen").classList.add("active");

      // 우승자 표시
      const winnerFoodElement = document.getElementById("winner-food");
      if (winnerFoodElement) {
        winnerFoodElement.innerHTML = `
          <div class="winner-display">
            <div class="winner-emoji">${winner.emoji}</div>
            <div class="winner-name">${winner.name}</div>
            <div class="winner-description">${
              winner.desc || winner.description || ""
            }</div>
          </div>
        `;
      }

      // 상위 음식들 표시
      const gameStatsElement = document.getElementById("game-stats");
      if (gameStatsElement && topFoods.length > 0) {
        let statsHTML =
          '<div class="stats-title">선택 통계</div><div class="top-foods-list">';

        topFoods.forEach((item, index) => {
          statsHTML += `
            <div class="food-item">
              <span class="rank">${index + 1}위</span>
              <span class="food-emoji">${item.food.emoji}</span>
              <span class="food-name">${item.food.name}</span>
              <span class="food-count">${item.count}번 선택</span>
            </div>
          `;
        });

        statsHTML += "</div>";
        gameStatsElement.innerHTML = statsHTML;
      }
    } catch (error) {
      console.error("Failed to show result:", error);
      this.showError(`결과 표시 실패: ${error.message}`);
    }
  }

  // 근처 음식점 찾기
  async findNearbyRestaurants() {
    try {
      const statusElement = document.getElementById("location-status");
      const restaurantsContainer = document.getElementById("restaurants-list");
      const locationInfo = document.getElementById("location-info");

      if (statusElement) {
        statusElement.textContent = "위치 정보를 가져오는 중...";
      }
      statusElement.className = "status loading";

      // 위치 정보 가져오기
      const position = await this.getCurrentPosition();
      const { latitude, longitude } = position.coords;

      console.log("Position obtained:", { latitude, longitude });

      // 음식점 검색과 주소 변환을 병렬로 실행
      const [addressPromise, restaurantsPromise] = await Promise.allSettled([
        this.getAddressFromCoords(latitude, longitude),
        this.searchNearbyRestaurants(latitude, longitude),
      ]);

      // 주소 정보 표시 (주소 변환이 실패해도 좌표 정보는 표시)
      if (addressPromise.status === "fulfilled") {
        const address = addressPromise.value;
        locationInfo.innerHTML = `
          <div class="location-display">
            <span class="location-icon">📍</span>
            <span class="location-text">${address}</span>
          </div>
        `;
      } else {
        console.log(
          "Address conversion failed, showing coordinates:",
          addressPromise.reason
        );
        locationInfo.innerHTML = `
          <div class="location-display">
            <span class="location-icon">📍</span>
            <span class="location-text">현재 위치 (위도: ${latitude.toFixed(
              4
            )}, 경도: ${longitude.toFixed(4)})</span>
          </div>
        `;
      }
      locationInfo.style.display = "block";

      // 음식점 검색 결과 처리
      if (restaurantsPromise.status === "fulfilled") {
        const restaurants = restaurantsPromise.value;
        this.displayRestaurants(restaurants);
        if (statusElement) {
          statusElement.textContent = `${restaurants.length}개의 음식점을 찾았습니다!`;
          statusElement.className = "status success";
        }
      } else {
        throw restaurantsPromise.reason;
      }
    } catch (error) {
      console.error("Failed to find nearby restaurants:", error);
      const statusElement = document.getElementById("location-status");
      if (statusElement) {
        statusElement.textContent = this.getLocationErrorMessage(error);
        statusElement.className = "status error";
      }
    }
  }

  // 근처 음식점 검색
  async searchNearbyRestaurants(latitude, longitude) {
    let foodName = "맛집"; // 기본값

    // 게임이 완료된 경우 승자 음식으로 검색, 아니면 일반 맛집 검색
    if (this.gameSession && this.gameSession.winner) {
      foodName = this.gameSession.winner.name;
    }

    const radius = 1500; // 1.5km

    // URL 파라미터를 안전하게 인코딩
    const params = new URLSearchParams({
      foodName: foodName,
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      radius: radius.toString(),
    });

    const response = await this.apiCall(
      `/api/game/nearby-restaurants?${params.toString()}`
    );

    if (!response.success) {
      throw new Error(response.error || "Failed to search nearby restaurants");
    }

    return response.data.restaurants;
  }

  // 좌표를 주소로 변환 (간단한 지역 추정)
  async getAddressFromCoords(latitude, longitude) {
    try {
      // 우선 네이버 API를 시도
      const coords = `${longitude},${latitude}`;
      const response = await this.apiCall(
        `/api/naver/reverse-geocode?coords=${coords}&orders=roadaddr,addr`
      );

      if (
        response.status &&
        response.status.code === 0 &&
        response.results &&
        response.results.length > 0
      ) {
        const result = response.results[0];
        if (result.region) {
          const region = result.region;
          return `${region.area1.name} ${region.area2.name} ${region.area3.name}`.trim();
        }
      }

      throw new Error("주소 변환 실패");
    } catch (error) {
      console.error("Reverse geocoding failed:", error);

      // 네이버 API 실패시 간단한 지역 추정
      return this.estimateLocationFromCoords(latitude, longitude);
    }
  }

  // 좌표로부터 간단한 지역 추정
  estimateLocationFromCoords(latitude, longitude) {
    // 대한민국 주요 도시 좌표 범위
    const regions = [
      {
        name: "서울특별시",
        latMin: 37.4,
        latMax: 37.7,
        lngMin: 126.8,
        lngMax: 127.2,
      },
      {
        name: "부산광역시",
        latMin: 35.0,
        latMax: 35.4,
        lngMin: 128.9,
        lngMax: 129.4,
      },
      {
        name: "대구광역시",
        latMin: 35.7,
        latMax: 36.0,
        lngMin: 128.4,
        lngMax: 128.8,
      },
      {
        name: "인천광역시",
        latMin: 37.2,
        latMax: 37.6,
        lngMin: 126.4,
        lngMax: 126.9,
      },
      {
        name: "광주광역시",
        latMin: 35.1,
        latMax: 35.3,
        lngMin: 126.7,
        lngMax: 127.0,
      },
      {
        name: "대전광역시",
        latMin: 36.2,
        latMax: 36.5,
        lngMin: 127.3,
        lngMax: 127.6,
      },
      {
        name: "울산광역시",
        latMin: 35.4,
        latMax: 35.7,
        lngMin: 129.1,
        lngMax: 129.5,
      },
      // 경기도 주요 도시들을 세분화
      {
        name: "수원시",
        latMin: 37.23,
        latMax: 37.32,
        lngMin: 126.94,
        lngMax: 127.08,
      },
      {
        name: "성남시",
        latMin: 37.38,
        latMax: 37.47,
        lngMin: 127.09,
        lngMax: 127.18,
      },
      {
        name: "고양시",
        latMin: 37.63,
        latMax: 37.7,
        lngMin: 126.82,
        lngMax: 126.88,
      },
      {
        name: "용인시",
        latMin: 37.23,
        latMax: 37.32,
        lngMin: 127.15,
        lngMax: 127.32,
      },
      {
        name: "부천시",
        latMin: 37.48,
        latMax: 37.54,
        lngMin: 126.76,
        lngMax: 126.81,
      },
      {
        name: "안산시",
        latMin: 37.3,
        latMax: 37.35,
        lngMin: 126.78,
        lngMax: 126.87,
      },
      {
        name: "안양시",
        latMin: 37.38,
        latMax: 37.41,
        lngMin: 126.91,
        lngMax: 126.96,
      },
      {
        name: "남양주시",
        latMin: 37.63,
        latMax: 37.66,
        lngMin: 127.2,
        lngMax: 127.26,
      },
      {
        name: "화성시",
        latMin: 37.18,
        latMax: 37.25,
        lngMin: 126.81,
        lngMax: 126.88,
      },
      {
        name: "평택시",
        latMin: 36.98,
        latMax: 37.05,
        lngMin: 127.08,
        lngMax: 127.15,
      },
      {
        name: "의정부시",
        latMin: 37.73,
        latMax: 37.76,
        lngMin: 127.03,
        lngMax: 127.07,
      },
      {
        name: "시흥시",
        latMin: 37.37,
        latMax: 37.42,
        lngMin: 126.78,
        lngMax: 126.83,
      },
      {
        name: "파주시",
        latMin: 37.75,
        latMax: 37.8,
        lngMin: 126.77,
        lngMax: 126.82,
      },
      {
        name: "김포시",
        latMin: 37.61,
        latMax: 37.65,
        lngMin: 126.71,
        lngMax: 126.76,
      },
      {
        name: "광명시",
        latMin: 37.47,
        latMax: 37.5,
        lngMin: 126.86,
        lngMax: 126.89,
      },
      {
        name: "광주시",
        latMin: 37.4,
        latMax: 37.43,
        lngMin: 127.25,
        lngMax: 127.28,
      },
      {
        name: "군포시",
        latMin: 37.35,
        latMax: 37.38,
        lngMin: 126.93,
        lngMax: 126.96,
      },
      {
        name: "하남시",
        latMin: 37.53,
        latMax: 37.56,
        lngMin: 127.2,
        lngMax: 127.23,
      },
      {
        name: "오산시",
        latMin: 37.14,
        latMax: 37.17,
        lngMin: 127.07,
        lngMax: 127.1,
      },
      {
        name: "이천시",
        latMin: 37.26,
        latMax: 37.29,
        lngMin: 127.43,
        lngMax: 127.46,
      },
      // 나머지 경기도 지역
      {
        name: "경기도",
        latMin: 36.8,
        latMax: 38.3,
        lngMin: 126.3,
        lngMax: 127.9,
      },
      {
        name: "강원도",
        latMin: 37.0,
        latMax: 38.7,
        lngMin: 127.0,
        lngMax: 129.4,
      },
      {
        name: "충청북도",
        latMin: 36.0,
        latMax: 37.2,
        lngMin: 127.2,
        lngMax: 128.5,
      },
      {
        name: "충청남도",
        latMin: 35.7,
        latMax: 37.0,
        lngMin: 125.9,
        lngMax: 127.8,
      },
      {
        name: "전라북도",
        latMin: 35.1,
        latMax: 36.2,
        lngMin: 126.4,
        lngMax: 127.9,
      },
      {
        name: "전라남도",
        latMin: 33.8,
        latMax: 35.8,
        lngMin: 125.0,
        lngMax: 127.6,
      },
      {
        name: "경상북도",
        latMin: 35.4,
        latMax: 37.5,
        lngMin: 128.0,
        lngMax: 130.0,
      },
      {
        name: "경상남도",
        latMin: 34.6,
        latMax: 36.0,
        lngMin: 127.5,
        lngMax: 129.2,
      },
      {
        name: "제주특별자치도",
        latMin: 33.1,
        latMax: 33.6,
        lngMin: 126.1,
        lngMax: 126.9,
      },
    ];

    for (const region of regions) {
      if (
        latitude >= region.latMin &&
        latitude <= region.latMax &&
        longitude >= region.lngMin &&
        longitude <= region.lngMax
      ) {
        return region.name;
      }
    }

    return "대한민국"; // 기본값
  }

  // 현재 위치 가져오기
  getCurrentPosition() {
    return new Promise((resolve, reject) => {
      // Expo에서 전달받은 위치 정보 확인 (강화된 검증)
      if (window.expoLatitude && window.expoLongitude) {
        const lat = parseFloat(window.expoLatitude);
        const lng = parseFloat(window.expoLongitude);

        // 더 엄격한 검증
        if (
          typeof lat === "number" &&
          typeof lng === "number" &&
          !isNaN(lat) &&
          !isNaN(lng) &&
          lat !== 0 &&
          lng !== 0 &&
          lat >= -90 &&
          lat <= 90 &&
          lng >= -180 &&
          lng <= 180
        ) {
          console.log("Using Expo location:", { lat, lng });
          resolve({
            coords: { latitude: lat, longitude: lng },
            source: "expo",
          });
          return;
        }
      }

      // 브라우저 geolocation 사용
      if (!navigator.geolocation) {
        reject(new Error("이 기기에서는 위치 서비스를 지원하지 않습니다."));
        return;
      }

      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5분
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Using browser geolocation:", position.coords);
          resolve({
            coords: position.coords,
            source: "browser",
          });
        },
        (error) => {
          console.error("Geolocation error:", error);
          reject(error);
        },
        options
      );
    });
  }

  // Expo에서 위치 정보 설정
  setLocationFromExpo(latitude, longitude) {
    // 입력값 검증
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (
      typeof lat === "number" &&
      typeof lng === "number" &&
      !isNaN(lat) &&
      !isNaN(lng) &&
      lat !== 0 &&
      lng !== 0 &&
      lat >= -90 &&
      lat <= 90 &&
      lng >= -180 &&
      lng <= 180
    ) {
      window.expoLatitude = lat;
      window.expoLongitude = lng;
      console.log("Location set from Expo:", { lat, lng });
      return true;
    } else {
      console.warn("Invalid location parameters from Expo:", {
        latitude,
        longitude,
      });
      return false;
    }
  }

  // 위치 소스 확인
  getLocationSource() {
    if (window.expoLatitude && window.expoLongitude) {
      return "expo";
    }
    return "browser";
  }

  // 위치 디버깅 정보
  debugLocationInfo() {
    return {
      expoLatitude: window.expoLatitude,
      expoLongitude: window.expoLongitude,
      hasGeolocation: !!navigator.geolocation,
      locationSource: this.getLocationSource(),
      apiBaseUrl: this.apiBaseUrl,
    };
  }

  // 음식점 목록 표시
  displayRestaurants(restaurants) {
    const container = document.getElementById("restaurants-list");
    container.innerHTML = "";

    if (!restaurants || restaurants.length === 0) {
      container.innerHTML =
        '<p class="no-restaurants">근처에 음식점을 찾을 수 없습니다.</p>';
      return;
    }

    restaurants.forEach((restaurant) => {
      const restaurantElement = document.createElement("div");
      restaurantElement.className = "restaurant-item";
      restaurantElement.innerHTML = `
        <div class="restaurant-info">
          <h4 class="restaurant-name">${restaurant.title}</h4>
          <p class="restaurant-category">${restaurant.category}</p>
          <p class="restaurant-address">${
            restaurant.roadAddress || restaurant.address
          }</p>
          ${
            restaurant.telephone
              ? `<p class="restaurant-phone">${restaurant.telephone}</p>`
              : ""
          }
        </div>
      `;

      if (restaurant.link) {
        restaurantElement.addEventListener("click", () => {
          window.open(restaurant.link, "_blank");
        });
        restaurantElement.style.cursor = "pointer";
      }

      container.appendChild(restaurantElement);
    });
  }

  // 옵션 표시
  displayOptions() {
    const roundElement = document.getElementById("round-info");
    const progressElement = document.getElementById("progress");
    const option1Element = document.getElementById("option1");
    const option2Element = document.getElementById("option2");

    // 라운드 정보 업데이트
    if (roundElement) {
      roundElement.textContent = `${this.currentRound + 1} / ${
        this.totalRounds
      }`;
    }

    // 진행률 업데이트
    const progressPercent = (this.currentRound / this.totalRounds) * 100;
    if (progressElement) {
      progressElement.style.width = `${progressPercent}%`;
    }

    // 옵션 표시
    if (this.currentOptions.length >= 2) {
      if (option1Element) {
        option1Element.innerHTML = `
          <div class="food-emoji">${this.currentOptions[0].emoji}</div>
          <div class="food-name">${this.currentOptions[0].name}</div>
          <div class="food-desc">${
            this.currentOptions[0].desc ||
            this.currentOptions[0].description ||
            ""
          }</div>
        `;
      }

      if (option2Element) {
        option2Element.innerHTML = `
          <div class="food-emoji">${this.currentOptions[1].emoji}</div>
          <div class="food-name">${this.currentOptions[1].name}</div>
          <div class="food-desc">${
            this.currentOptions[1].desc ||
            this.currentOptions[1].description ||
            ""
          }</div>
        `;
      }
    }
  }

  // 게임 재시작
  restartGame() {
    // 상태 초기화
    this.sessionId = null;
    this.currentRound = 0;
    this.currentOptions = [];
    this.gameSession = null;
    this.availableFoods = [];
    this.choices = [];
    this.foodCounts = {};

    // 화면 초기화
    document.getElementById("result-screen").classList.remove("active");
    document.getElementById("game-screen").classList.remove("active");
    document.getElementById("start-screen").classList.add("active");

    // 위치 정보 초기화
    const locationInfo = document.getElementById("location-info");
    if (locationInfo) {
      locationInfo.style.display = "none";
      locationInfo.innerHTML = "";
    }

    // 음식점 목록 초기화
    const restaurantsList = document.getElementById("restaurants-list");
    if (restaurantsList) {
      restaurantsList.innerHTML = "";
    }

    // 상태 메시지 초기화
    const locationStatus = document.getElementById("location-status");
    if (locationStatus) {
      locationStatus.textContent = "";
      locationStatus.className = "status";
    }
  }

  // 위치 에러 메시지
  getLocationErrorMessage(error) {
    switch (error.code) {
      case 1:
        return "위치 접근이 거부되었습니다. 설정에서 위치 권한을 허용해주세요.";
      case 2:
        return "위치 정보를 가져올 수 없습니다. 네트워크 연결을 확인해주세요.";
      case 3:
        return "위치 정보 요청이 시간 초과되었습니다. 다시 시도해주세요.";
      default:
        return error.message || "위치 정보를 가져오는 중 오류가 발생했습니다.";
    }
  }

  // 에러 표시
  showError(message) {
    // 상세한 에러 정보 포함
    const errorDetails = {
      message: message,
      apiUrl: this.apiBaseUrl,
      sessionId: this.sessionId,
      currentRound: this.currentRound,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      locationSource: this.getLocationSource(),
    };

    console.error("Game Error:", errorDetails);

    // 사용자에게 표시할 메시지
    let userMessage = message;

    if (message.includes("fetch")) {
      userMessage += "\n\n네트워크 연결을 확인해주세요.";
    } else if (message.includes("API")) {
      userMessage +=
        "\n\n서버 연결에 문제가 있습니다. 잠시 후 다시 시도해주세요.";
    }

    userMessage += `\n\n문제가 지속되면 다음 정보를 포함하여 문의해주세요:\n- API URL: ${
      this.apiBaseUrl
    }\n- 세션 ID: ${
      this.sessionId || "N/A"
    }\n- 시간: ${new Date().toLocaleString()}`;

    alert(userMessage);
  }
}

// 전역 게임 인스턴스
const game = new FoodTournamentGame();

// 전역 함수들
function startGame() {
  document.getElementById("start-screen").classList.remove("active");
  document.getElementById("game-screen").classList.add("active");
  game.startGame();
}

function restartGame() {
  game.restartGame();
}

function findNearbyRestaurants() {
  game.findNearbyRestaurants();
}

function selectOption(optionIndex) {
  if (game.currentOptions && game.currentOptions[optionIndex]) {
    game.makeChoice(game.currentOptions[optionIndex]);
  }
}

// Expo 앱과의 연동을 위한 전역 객체
window.hungerGame = {
  setLocationFromExpo: (lat, lng) => game.setLocationFromExpo(lat, lng),
  setApiUrlFromExpo: (url) => game.setApiUrlFromExpo(url),
  getLocationSource: () => game.getLocationSource(),
  debugLocationInfo: () => game.debugLocationInfo(),
  restartGame: () => game.restartGame(),
  findNearbyRestaurants: () => game.findNearbyRestaurants(),
};

// 디버깅을 위한 전역 객체
window.debugGame = {
  checkApiConnection: async () => {
    try {
      const response = await game.apiCall("/health");
      console.log("API Connection OK:", response);
      return response;
    } catch (error) {
      console.error("API Connection Failed:", error);
      return { error: error.message };
    }
  },
  getGameState: () => ({
    sessionId: game.sessionId,
    currentRound: game.currentRound,
    apiBaseUrl: game.apiBaseUrl,
    locationSource: game.getLocationSource(),
    locationInfo: game.debugLocationInfo(),
  }),
  forceStartGame: () => {
    startGame();
  },
};

console.log("Hunger Game loaded successfully!");
console.log("API Base URL:", game.apiBaseUrl);
console.log("Available debug functions:", Object.keys(window.debugGame));
