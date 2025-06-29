// Cloudflare Workers API 기반 음식 토너먼트 게임
class FoodTournamentGame {
  constructor() {
    this.apiBaseUrl = "/api"; // Cloudflare Workers API 엔드포인트
    this.sessionId = null;
    this.currentRound = 0;
    this.totalRounds = 20;
    this.currentOptions = [];
    this.gameSession = null;
  }

  // 게임 시작
  async startGame() {
    try {
      // 새로운 게임 세션 생성
      const response = await fetch(`${this.apiBaseUrl}/game/session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to create game session");
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || "Failed to create game session");
      }

      this.gameSession = result.data;
      this.sessionId = this.gameSession.id;
      this.currentRound = 0;

      this.showScreen("game");
      await this.nextRound();
    } catch (error) {
      console.error("Error starting game:", error);
      alert("게임을 시작할 수 없습니다. 다시 시도해주세요.");
    }
  }

  // 게임 재시작
  async restartGame() {
    // 근처 음식점 목록 초기화
    const restaurantsContainer = document.getElementById(
      "restaurants-container"
    );
    const locationStatus = document.getElementById("location-status");
    const locationInfo = document.getElementById("location-info");
    const restaurantsList = document.getElementById("restaurants-list");

    if (restaurantsContainer) {
      restaurantsContainer.classList.add("hidden");
    }
    if (locationInfo) {
      locationInfo.classList.add("hidden");
    }
    if (locationStatus) {
      locationStatus.textContent = "";
      locationStatus.className = "location-status";
    }
    if (restaurantsList) {
      restaurantsList.innerHTML = "";
    }

    this.winnerFood = null;
    await this.startGame();
  }

  // 화면 전환
  showScreen(screenName) {
    const screens = ["start", "game", "result"];
    screens.forEach((screen) => {
      const element = document.getElementById(`${screen}-screen`);
      if (element) {
        element.classList.toggle("active", screen === screenName);
      }
    });
  }

  // 다음 라운드
  async nextRound() {
    if (this.currentRound >= this.totalRounds) {
      await this.endGame();
      return;
    }

    try {
      // 첫 번째 라운드거나 이전 선택 후 다음 옵션이 있는 경우
      if (this.currentRound === 0) {
        // 첫 라운드는 세션 생성 시 받은 음식 데이터에서 랜덤 선택
        const shuffled = [...this.gameSession.availableFoods].sort(
          () => 0.5 - Math.random()
        );
        this.currentOptions = shuffled.slice(0, 2);
      }
      // currentOptions가 이미 설정되어 있으면 사용 (이전 선택 후 서버에서 받은 다음 옵션)

      this.displayFoodOptions(this.currentOptions[0], this.currentOptions[1]);
      this.updateProgress();
    } catch (error) {
      console.error("Error in next round:", error);
      alert("다음 라운드를 진행할 수 없습니다.");
    }
  }

  // 음식 옵션 표시
  displayFoodOptions(food1, food2) {
    const option1 = document.getElementById("option1");
    const option2 = document.getElementById("option2");

    if (option1 && option2) {
      // 현재 게임 단계에 따른 스타일 적용
      const gamePhase = this.gameSession?.gamePhase || 1;
      const phaseClass = `phase-${gamePhase}`;

      option1.className = `food-option ${phaseClass}`;
      option2.className = `food-option ${phaseClass}`;

      option1.innerHTML = `
        <div class="food-emoji">${food1.emoji}</div>
        <div class="food-name">${food1.name}</div>
        <div class="food-desc">${food1.desc}</div>
      `;

      option2.innerHTML = `
        <div class="food-emoji">${food2.emoji}</div>
        <div class="food-name">${food2.name}</div>
        <div class="food-desc">${food2.desc}</div>
      `;
    }
  }

  // 옵션 선택
  async selectOption(optionIndex) {
    const selectedFood = this.currentOptions[optionIndex];

    try {
      // 서버에 선택 전송
      const response = await fetch(`${this.apiBaseUrl}/game/choice`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId: this.sessionId,
          selectedFood: selectedFood,
          currentRound: this.currentRound,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit choice");
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || "Failed to submit choice");
      }

      // 게임 상태 업데이트
      this.gameSession = result.data.session;
      this.currentRound = this.gameSession.currentRound;

      // 선택 애니메이션
      const selectedOption = document.getElementById(
        `option${optionIndex + 1}`
      );
      if (selectedOption) {
        selectedOption.style.transform = "scale(1.1)";
        selectedOption.style.backgroundColor = "#4CAF50";

        setTimeout(async () => {
          selectedOption.style.transform = "";
          selectedOption.style.backgroundColor = "";

          // 게임 완료 확인
          if (result.data.isGameComplete) {
            await this.endGame();
          } else {
            // 다음 라운드 옵션 설정
            this.currentOptions = result.data.nextOptions;
            await this.nextRound();
          }
        }, 500);
      }
    } catch (error) {
      console.error("Error submitting choice:", error);
      alert("선택을 처리할 수 없습니다. 다시 시도해주세요.");
    }
  }

  // 진행률 업데이트
  updateProgress() {
    const progressBar = document.getElementById("progress");
    const roundCounter = document.getElementById("round-counter");

    if (progressBar && roundCounter) {
      const progressPercentage =
        ((this.currentRound + 1) / this.totalRounds) * 100;
      progressBar.style.width = `${progressPercentage}%`;
      roundCounter.textContent = `${this.currentRound + 1} / ${
        this.totalRounds
      }`;
    }
  }

  // 게임 종료
  async endGame() {
    try {
      // 서버에서 최종 결과 가져오기
      const response = await fetch(
        `${this.apiBaseUrl}/game/result?sessionId=${this.sessionId}`
      );

      if (!response.ok) {
        throw new Error("Failed to get game result");
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || "Failed to get game result");
      }

      const winner = result.data.winner;
      this.displayFinalResult(winner);
      this.showScreen("result");
    } catch (error) {
      console.error("Error ending game:", error);
      // 폴백: 로컬에서 마지막 선택한 음식을 우승자로 설정
      if (this.gameSession && this.gameSession.choices.length > 0) {
        const lastChoice =
          this.gameSession.choices[this.gameSession.choices.length - 1];
        this.displayFinalResult(lastChoice);
        this.showScreen("result");
      } else {
        alert("게임 결과를 가져올 수 없습니다.");
      }
    }
  }

  // 최종 결과 표시
  displayFinalResult(winner) {
    const finalEmoji = document.getElementById("final-emoji");
    const finalName = document.getElementById("final-name");
    const finalDesc = document.getElementById("final-desc");

    if (finalEmoji && finalName && finalDesc) {
      finalEmoji.textContent = winner.emoji;
      finalName.textContent = winner.name;
      finalDesc.textContent = `오늘은 ${winner.name}로 결정!`;
    }

    // 우승 음식 저장 (근처 음식점 검색용)
    this.winnerFood = winner;
  }

  // 위치 정보 가져오기 및 근처 음식점 검색
  async findNearbyRestaurants() {
    const findNearbyBtn = document.getElementById("find-nearby-btn");
    const locationStatus = document.getElementById("location-status");
    const locationInfo = document.getElementById("location-info");
    const currentAddress = document.getElementById("current-address");
    const restaurantsContainer = document.getElementById(
      "restaurants-container"
    );

    if (!this.winnerFood) {
      locationStatus.textContent = "게임을 먼저 완료해주세요.";
      locationStatus.className = "location-status error";
      return;
    }

    // 위치 정보 소스 확인
    const locationSource = this.getLocationSource();

    // 버튼 비활성화 및 로딩 상태
    findNearbyBtn.disabled = true;
    findNearbyBtn.textContent = "📍 위치 확인 중...";

    if (locationSource.source === "expo") {
      locationStatus.textContent =
        "Expo 앱에서 전달받은 위치 정보를 사용합니다...";
    } else {
      locationStatus.textContent = "브라우저에서 위치 정보를 가져오는 중...";
    }
    locationStatus.className = "location-status loading";

    try {
      // 위치 정보 요청
      const position = await this.getCurrentPosition();
      const { latitude, longitude } = position.coords;

      // 위치 정보 표시
      locationInfo.classList.remove("hidden");
      currentAddress.textContent = "현재 위치 주소를 확인하는 중...";

      // 주소 변환과 음식점 검색을 병렬로 실행
      const [addressResult, restaurantResult] = await Promise.allSettled([
        this.getAddressFromCoords(latitude, longitude),
        fetch(
          `${
            this.apiBaseUrl
          }/game/nearby-restaurants?foodName=${encodeURIComponent(
            this.winnerFood.name
          )}&latitude=${latitude}&longitude=${longitude}&radius=1500`
        ),
      ]);

      // 주소 표시
      if (addressResult.status === "fulfilled") {
        currentAddress.textContent = addressResult.value;
      } else {
        currentAddress.textContent = `위도: ${latitude.toFixed(
          4
        )}, 경도: ${longitude.toFixed(4)}`;
        console.error("Address conversion failed:", addressResult.reason);
      }

      // 음식점 검색 결과 처리
      locationStatus.textContent = "근처 음식점을 검색하는 중...";

      if (restaurantResult.status === "rejected") {
        throw new Error("Failed to search nearby restaurants");
      }

      const response = restaurantResult.value;
      if (!response.ok) {
        throw new Error("Failed to search nearby restaurants");
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || "Failed to search nearby restaurants");
      }

      // 음식점 목록 표시
      this.displayRestaurants(result.data);
      locationStatus.textContent = `${result.data.total}개의 음식점을 찾았습니다.`;
      locationStatus.className = "location-status success";
      restaurantsContainer.classList.remove("hidden");
    } catch (error) {
      console.error("Error finding nearby restaurants:", error);
      let errorMessage = "음식점 검색에 실패했습니다.";

      if (error.code === error.PERMISSION_DENIED) {
        errorMessage =
          "위치 정보 접근이 거부되었습니다. 브라우저 설정을 확인해주세요.";
      } else if (error.code === error.POSITION_UNAVAILABLE) {
        errorMessage = "위치 정보를 사용할 수 없습니다.";
      } else if (error.code === error.TIMEOUT) {
        errorMessage = "위치 정보 요청이 시간 초과되었습니다.";
      }

      locationStatus.textContent = errorMessage;
      locationStatus.className = "location-status error";

      // 에러 시에도 위치 정보는 숨기지 않음
      if (!locationInfo.classList.contains("hidden")) {
        currentAddress.textContent = "위치 정보를 가져올 수 없습니다.";
      }
    } finally {
      // 버튼 복원
      findNearbyBtn.disabled = false;
      findNearbyBtn.textContent = "📍 내 근처 음식점 찾기";
    }
  }

  // 위치 정보 가져오기 (Promise 래핑) - Expo 호환
  getCurrentPosition() {
    return new Promise((resolve, reject) => {
      // 1. Expo 앱에서 전달된 위도, 경도 값이 있는지 확인 (유효한 숫자 값인지 체크)
      if (
        typeof window.expoLatitude === "number" &&
        typeof window.expoLongitude === "number" &&
        !isNaN(window.expoLatitude) &&
        !isNaN(window.expoLongitude) &&
        window.expoLatitude !== 0 &&
        window.expoLongitude !== 0
      ) {
        console.log(
          "Using location from Expo app:",
          window.expoLatitude,
          window.expoLongitude
        );
        resolve({
          coords: {
            latitude: window.expoLatitude,
            longitude: window.expoLongitude,
            accuracy: window.expoAccuracy || 10,
          },
        });
        return;
      }

      // 2. Expo 파라미터가 없거나 유효하지 않으면 브라우저 geolocation API 사용
      console.log("Expo location not available, using browser geolocation API");
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser"));
        return;
      }

      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5분
      });
    });
  }

  // Expo 앱에서 위도, 경도를 설정하는 메서드
  setLocationFromExpo(latitude, longitude, accuracy = 10) {
    console.log("Setting location from Expo:", latitude, longitude, accuracy);

    // 입력값 검증
    if (
      typeof latitude !== "number" ||
      typeof longitude !== "number" ||
      isNaN(latitude) ||
      isNaN(longitude)
    ) {
      console.error("Invalid location data from Expo:", {
        latitude,
        longitude,
        accuracy,
      });
      return false;
    }

    window.expoLatitude = latitude;
    window.expoLongitude = longitude;
    window.expoAccuracy = accuracy;

    console.log("Location successfully set from Expo");
    return true;
  }

  // 현재 설정된 위치 정보 확인 메서드
  getLocationSource() {
    if (
      typeof window.expoLatitude === "number" &&
      typeof window.expoLongitude === "number" &&
      !isNaN(window.expoLatitude) &&
      !isNaN(window.expoLongitude) &&
      window.expoLatitude !== 0 &&
      window.expoLongitude !== 0
    ) {
      return {
        source: "expo",
        latitude: window.expoLatitude,
        longitude: window.expoLongitude,
        accuracy: window.expoAccuracy || 10,
      };
    }
    return { source: "browser" };
  }

  // 디버그용: 현재 위치 정보 상태 출력
  debugLocationInfo() {
    console.log("=== Location Debug Info ===");
    console.log(
      "window.expoLatitude:",
      window.expoLatitude,
      typeof window.expoLatitude
    );
    console.log(
      "window.expoLongitude:",
      window.expoLongitude,
      typeof window.expoLongitude
    );
    console.log(
      "window.expoAccuracy:",
      window.expoAccuracy,
      typeof window.expoAccuracy
    );
    console.log("getLocationSource():", this.getLocationSource());
    console.log("navigator.geolocation available:", !!navigator.geolocation);
    console.log("========================");
  }

  // 좌표를 주소로 변환하는 메서드
  async getAddressFromCoords(latitude, longitude) {
    try {
      const response = await fetch(
        `${this.apiBaseUrl}/naver/reverse-geocode?coords=${longitude},${latitude}&sourcecrs=epsg:4326&targetcrs=epsg:4326&orders=roadaddr,addr`
      );

      if (!response.ok) {
        throw new Error("Failed to get address");
      }

      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const result = data.results[0];
        const region = result.region;

        // 도로명 주소 우선, 없으면 지번 주소
        if (result.land) {
          const land = result.land;
          return `${region.area1.name} ${region.area2.name} ${
            region.area3.name
          } ${land.name}${land.number1}${
            land.number2 ? "-" + land.number2 : ""
          }`;
        } else {
          return `${region.area1.name} ${region.area2.name} ${region.area3.name}`;
        }
      }

      return "주소를 찾을 수 없습니다";
    } catch (error) {
      console.error("Error getting address:", error);
      return "주소 변환 실패";
    }
  }

  // 음식점 목록 표시
  displayRestaurants(data) {
    const restaurantsList = document.getElementById("restaurants-list");

    if (!data.restaurants || data.restaurants.length === 0) {
      restaurantsList.innerHTML = `
        <div class="no-restaurants">
          <p>근처에서 "${data.foodName}" 관련 음식점을 찾을 수 없습니다.</p>
          <p>다른 지역을 검색해보시거나 검색 반경을 늘려보세요.</p>
        </div>
      `;
      return;
    }

    restaurantsList.innerHTML = data.restaurants
      .map(
        (restaurant) => `
      <div class="restaurant-item">
        <div class="restaurant-info">
          <h4 class="restaurant-name">${restaurant.title}</h4>
          <p class="restaurant-category">${restaurant.category}</p>
          <p class="restaurant-address">${
            restaurant.roadAddress || restaurant.address
          }</p>
        </div>
        <div class="restaurant-actions">
          <a href="tel:${restaurant.telephone}" class="restaurant-phone" ${
          !restaurant.telephone ? 'style="display:none"' : ""
        }>
            📞 전화
          </a>
          <a href="${restaurant.link}" target="_blank" class="restaurant-link">
            🔗 상세보기
          </a>
          <button class="restaurant-map-btn" onclick="window.open('https://map.naver.com/v5/search/${encodeURIComponent(
            restaurant.title + " " + restaurant.address
          )}', '_blank')">
            🗺️ 지도
          </button>
        </div>
      </div>
    `
      )
      .join("");
  }

  // API 헬스 체크
  async checkApiHealth() {
    try {
      const response = await fetch(`${this.apiBaseUrl}/health`);
      const result = await response.json();
      console.log("API Health:", result);
      return result.status === "OK";
    } catch (error) {
      console.error("API Health check failed:", error);
      return false;
    }
  }
}

// 게임 인스턴스 생성 (전역 접근 가능)
const game = new FoodTournamentGame();
window.hungerGame = game; // Expo 앱에서 접근할 수 있도록 전역 변수로 설정

// DOM 로드 완료 후 이벤트 리스너 등록
document.addEventListener("DOMContentLoaded", async () => {
  // API 상태 확인
  const isApiHealthy = await game.checkApiHealth();
  if (!isApiHealthy) {
    console.warn("API is not responding properly");
  }

  // 시작 버튼 이벤트
  const startBtn = document.getElementById("start-btn");
  if (startBtn) {
    startBtn.addEventListener("click", () => {
      game.startGame();
    });
  }

  // 재시작 버튼 이벤트
  const restartBtn = document.getElementById("restart-btn");
  if (restartBtn) {
    restartBtn.addEventListener("click", () => {
      game.restartGame();
    });
  }

  // 근처 음식점 찾기 버튼 이벤트
  const findNearbyBtn = document.getElementById("find-nearby-btn");
  if (findNearbyBtn) {
    findNearbyBtn.addEventListener("click", () => {
      game.findNearbyRestaurants();
    });
  }

  // 음식 옵션 클릭 이벤트
  const option1 = document.getElementById("option1");
  const option2 = document.getElementById("option2");

  if (option1) {
    option1.addEventListener("click", () => {
      if (game.currentOptions.length >= 2) {
        game.selectOption(0);
      }
    });
  }

  if (option2) {
    option2.addEventListener("click", () => {
      if (game.currentOptions.length >= 2) {
        game.selectOption(1);
      }
    });
  }

  // 키보드 단축키 (1, 2번 키로 선택)
  document.addEventListener("keydown", (event) => {
    if (game.currentOptions.length >= 2) {
      if (event.key === "1") {
        game.selectOption(0);
      } else if (event.key === "2") {
        game.selectOption(1);
      }
    }
  });
});

// 에러 처리를 위한 전역 에러 핸들러
window.addEventListener("error", (event) => {
  console.error("Global error:", event.error);
});

window.addEventListener("unhandledrejection", (event) => {
  console.error("Unhandled promise rejection:", event.reason);
});
