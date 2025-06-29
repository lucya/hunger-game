// ES6 모듈에서 음식 데이터 가져오기
import { foods } from "./foods.js";

// 게임 상태 관리를 위한 클래스
class FoodTournamentGame {
  constructor() {
    this.currentRound = 0;
    this.totalRounds = 20;
    this.gameChoices = [];
    this.availableFoods = [];
    this.currentOptions = [];
    this.foodCounts = new Map();

    // 새로운 하이브리드 시스템을 위한 속성들
    this.gamePhase = 1; // 1: 탐색, 2: 정제, 3: 결정
    this.topCandidates = [];
    this.phaseRounds = {
      exploration: 12, // 탐색 단계: 12라운드
      refinement: 6, // 정제 단계: 6라운드
      decision: 2, // 결정 단계: 2라운드
    };
  }

  // 게임 시작
  startGame() {
    this.currentRound = 0;
    this.gamePhase = 1;
    this.gameChoices = [];
    this.foodCounts.clear();
    this.topCandidates = [];
    this.availableFoods = this.getRandomFoods(40);
    this.showScreen("game");
    this.nextRound();
  }

  // 게임 재시작
  restartGame() {
    this.startGame();
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

  // 랜덤 음식 선택
  getRandomFoods(count) {
    const shuffled = [...foods].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  // 현재 단계에 따른 음식 풀 결정
  getCurrentFoodPool() {
    switch (this.gamePhase) {
      case 1: // 탐색 단계: 전체 음식에서
        return this.availableFoods;

      case 2: // 정제 단계: 상위 12개 음식에서
        return this.getTopFoods(12);

      case 3: // 결정 단계: 상위 4개 음식에서
        return this.getTopFoods(4);

      default:
        return this.availableFoods;
    }
  }

  // 상위 음식들 추출
  getTopFoods(count) {
    const foodScores = new Map();

    // 각 음식의 점수 계산 (선택 횟수 + 가중치)
    for (const [foodName, selectCount] of this.foodCounts) {
      const food = this.availableFoods.find((f) => f.name === foodName);
      if (food) {
        // 최근 선택일수록 높은 가중치
        const recentSelections = this.gameChoices
          .slice(-8) // 최근 8라운드
          .filter((choice) => choice.name === foodName).length;

        const score = selectCount + recentSelections * 0.5;
        foodScores.set(food, score);
      }
    }

    // 점수순으로 정렬하여 상위 count개 반환
    const sortedFoods = Array.from(foodScores.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, count)
      .map((entry) => entry[0]);

    // 선택되지 않은 음식들도 일부 포함 (다양성 확보)
    const unselectedFoods = this.availableFoods.filter(
      (food) => !this.foodCounts.has(food.name)
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

  // 게임 단계 업데이트
  updateGamePhase() {
    if (this.currentRound === this.phaseRounds.exploration) {
      this.gamePhase = 2;
    } else if (
      this.currentRound ===
      this.phaseRounds.exploration + this.phaseRounds.refinement
    ) {
      this.gamePhase = 3;
    }
  }

  // 다음 라운드
  nextRound() {
    if (this.currentRound >= this.totalRounds) {
      this.endGame();
      return;
    }

    this.currentRound++;
    this.updateGamePhase();

    // 현재 단계에 맞는 음식 풀에서 2개 선택
    const currentPool = this.getCurrentFoodPool();
    const shuffled = [...currentPool].sort(() => 0.5 - Math.random());
    this.currentOptions = shuffled.slice(0, 2);

    this.displayFoodOptions(this.currentOptions[0], this.currentOptions[1]);
    this.updateProgress();
  }

  // 음식 옵션 표시
  displayFoodOptions(food1, food2) {
    const option1 = document.getElementById("option1");
    const option2 = document.getElementById("option2");

    if (option1 && option2) {
      // 단계별로 다른 스타일 적용
      const phaseClass = `phase-${this.gamePhase}`;

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

  // 옵션 선택 (가중치 적용)
  selectOption(optionIndex) {
    const selectedFood = this.currentOptions[optionIndex];
    this.gameChoices.push(selectedFood);

    // 단계별 가중치 적용
    const phaseWeight = {
      1: 1.0, // 탐색 단계
      2: 1.5, // 정제 단계
      3: 2.0, // 결정 단계
    };

    const currentWeight = phaseWeight[this.gamePhase];
    const count = this.foodCounts.get(selectedFood.name) || 0;
    this.foodCounts.set(selectedFood.name, count + currentWeight);

    // 선택 애니메이션
    const selectedOption = document.getElementById(`option${optionIndex + 1}`);
    if (selectedOption) {
      selectedOption.style.transform = "scale(1.1)";
      selectedOption.style.backgroundColor = "#4CAF50";

      setTimeout(() => {
        selectedOption.style.transform = "";
        selectedOption.style.backgroundColor = "";
        this.nextRound();
      }, 500);
    }
  }

  // 진행도 업데이트
  updateProgress() {
    const progressBar = document.getElementById("progress");
    const roundCounter = document.getElementById("round-counter");

    if (progressBar && roundCounter) {
      const progress = (this.currentRound / this.totalRounds) * 100;
      progressBar.style.width = `${progress}%`;
      roundCounter.textContent = `${this.currentRound} / ${this.totalRounds}`;
    }
  }

  // 게임 종료
  endGame() {
    this.showScreen("result");
    const finalFood = this.decideFinalWinner();

    const resultElement = document.querySelector(".final-food");
    if (resultElement && finalFood) {
      resultElement.innerHTML = `
        <div class="final-emoji">${finalFood.emoji}</div>
        <h3 class="final-name">${finalFood.name}</h3>
        <p class="final-desc">${finalFood.desc}</p>
        <div class="final-stats">
          <p>당신의 최종 선택입니다!</p>
        </div>
      `;
    }
  }

  // 최종 승자 결정 (가중치 반영)
  decideFinalWinner() {
    if (this.gameChoices.length === 0) return null;

    // 가장 높은 점수를 받은 음식 찾기
    let maxScore = 0;
    let winners = [];

    for (const [foodName, score] of this.foodCounts) {
      if (score > maxScore) {
        maxScore = score;
        winners = [foodName];
      } else if (score === maxScore) {
        winners.push(foodName);
      }
    }

    // 동점인 경우 최근 선택된 음식 우선
    if (winners.length > 1) {
      const recentChoices = this.gameChoices.slice(-5); // 최근 5개 선택
      for (const choice of recentChoices.reverse()) {
        if (winners.includes(choice.name)) {
          return choice;
        }
      }
    }

    // 그래도 동점이면 랜덤
    const winnerName = winners[Math.floor(Math.random() * winners.length)];
    return this.gameChoices.find((food) => food.name === winnerName);
  }
}

// 게임 인스턴스 생성
const game = new FoodTournamentGame();

// DOM 로드 완료 후 이벤트 리스너 설정
document.addEventListener("DOMContentLoaded", () => {
  // 게임 시작 버튼
  const startBtn = document.getElementById("start-btn");
  if (startBtn) {
    startBtn.addEventListener("click", () => game.startGame());
  }

  // 다시 하기 버튼
  const restartBtn = document.getElementById("restart-btn");
  if (restartBtn) {
    restartBtn.addEventListener("click", () => game.restartGame());
  }

  // 음식 선택 버튼들
  const option1 = document.getElementById("option1");
  const option2 = document.getElementById("option2");

  if (option1) {
    option1.addEventListener("click", () => game.selectOption(0));
  }

  if (option2) {
    option2.addEventListener("click", () => game.selectOption(1));
  }
});
