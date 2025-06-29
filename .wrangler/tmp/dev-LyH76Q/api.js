var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// .wrangler/tmp/bundle-4WHswG/checked-fetch.js
var urls = /* @__PURE__ */ new Set();
function checkURL(request, init) {
  const url = request instanceof URL ? request : new URL(
    (typeof request === "string" ? new Request(request, init) : request).url
  );
  if (url.port && url.port !== "443" && url.protocol === "https:") {
    if (!urls.has(url.toString())) {
      urls.add(url.toString());
      console.warn(
        `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
      );
    }
  }
}
__name(checkURL, "checkURL");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    const [request, init] = argArray;
    checkURL(request, init);
    return Reflect.apply(target, thisArg, argArray);
  }
});

// workers/api.js
var foods = [
  // 한식
  { emoji: "\u{1F372}", name: "\uCC0C\uAC1C", desc: "\uAE40\uCE58\uCC0C\uAC1C, \uB41C\uC7A5\uCC0C\uAC1C \uB4F1 \uB2E4\uC591\uD55C \uD55C\uAD6D \uCC0C\uAC1C" },
  {
    emoji: "\u{1F963}",
    name: "\uAD6D",
    desc: "\uBBF8\uC5ED\uAD6D, \uC124\uB801\uD0D5, \uC21C\uB300\uAD6D \uB4F1 \uB530\uB73B\uD55C \uAD6D\uBB3C\uC694\uB9AC"
  },
  { emoji: "\u{1F35C}", name: "\uB77C\uBA74", desc: "\uC2E0\uB77C\uBA74, \uC9C4\uB77C\uBA74 \uB4F1 \uD55C\uAD6D \uB77C\uBA74" },
  {
    emoji: "\u{1F944}",
    name: "\uB0C9\uBA74",
    desc: "\uC2DC\uC6D0\uD55C \uC721\uC218\uC640 \uCAC4\uAE43\uD55C \uBA54\uBC00\uBA74\uC758 \uC5EC\uB984 \uBCC4\uBBF8"
  },
  { emoji: "\u{1F35C}", name: "\uCE7C\uAD6D\uC218", desc: "\uC190\uC73C\uB85C \uBF51\uC740 \uBA74\uBC1C\uC758 \uAD6C\uC218\uD55C \uAD6D\uBB3C\uC694\uB9AC" },
  { emoji: "\u{1F95F}", name: "\uB9CC\uB450", desc: "\uACE0\uAE30\uC640 \uC57C\uCC44\uAC00 \uB4E4\uC5B4\uAC04 \uD55C\uAD6D\uC2DD \uB9CC\uB450" },
  {
    emoji: "\u{1F371}",
    name: "\uBE44\uBE54\uBC25",
    desc: "\uAC16\uAC00\uC9C0 \uB098\uBB3C\uACFC \uACE0\uCD94\uC7A5\uC774 \uC5B4\uC6B0\uB7EC\uC9C4 \uC601\uC591\uB9CC\uC810 \uD55C\uC2DD"
  },
  {
    emoji: "\u{1F359}",
    name: "\uAE40\uBC25",
    desc: "\uB2E4\uC591\uD55C \uC7AC\uB8CC\uB97C \uAE40\uC5D0 \uC2F8\uC11C \uB9CC\uB4E0 \uD55C\uAD6D \uB300\uD45C \uAC04\uD3B8\uC2DD"
  },
  {
    emoji: "\u{1F958}",
    name: "\uBD88\uACE0\uAE30",
    desc: "\uB2EC\uCF64\uC9ED\uC9E4\uD55C \uC591\uB150\uC5D0 \uC7AC\uC6B4 \uBD80\uB4DC\uB7EC\uC6B4 \uC18C\uACE0\uAE30 \uAD6C\uC774"
  },
  { emoji: "\u{1F356}", name: "\uAC08\uBE44", desc: "\uC591\uB150\uC5D0 \uC7AC\uC6CC \uAD6C\uC6B4 \uC721\uC999 \uAC00\uB4DD\uD55C \uAC08\uBE44" },
  { emoji: "\u{1F35A}", name: "\uBC31\uBC18", desc: "\uC9D1\uBC25 \uAC19\uC740 \uB530\uB73B\uD568\uC758 \uD55C\uAD6D \uC815\uC2DD" },
  { emoji: "\u{1F41F}", name: "\uC0DD\uC120\uAD6C\uC774", desc: "\uC18C\uAE08\uAD6C\uC774\uB85C \uB2F4\uBC31\uD558\uAC8C \uAD6C\uC6B4 \uC0DD\uC120\uC694\uB9AC" },
  {
    emoji: "\u{1F35B}",
    name: "\uAE40\uCE58\uBCF6\uC74C\uBC25",
    desc: "\uB9E4\uCF64\uD55C \uAE40\uCE58\uC640 \uBC25\uC744 \uBCF6\uC740 \uD55C\uAD6D \uB300\uD45C \uBCF6\uC74C\uBC25"
  },
  { emoji: "\u{1F35B}", name: "\uC81C\uC721\uBCF6\uC74C", desc: "\uB9E4\uCF64\uD55C \uC591\uB150\uC5D0 \uBCF6\uC740 \uB3FC\uC9C0\uACE0\uAE30\uC640 \uBC25" },
  { emoji: "\u{1F35C}", name: "\uB5A1\uBCF6\uC774", desc: "\uB9E4\uCF64\uB2EC\uCF64\uD55C \uACE0\uCD94\uC7A5 \uC591\uB150\uC758 \uB5A1 \uC694\uB9AC" },
  {
    emoji: "\u{1F364}",
    name: "\uD280\uAE40",
    desc: "\uBC14\uC0AD\uD558\uAC8C \uD280\uAE34 \uB2E4\uC591\uD55C \uC7AC\uB8CC\uC758 \uD55C\uAD6D\uC2DD \uD280\uAE40"
  },
  {
    emoji: "\u{1F35C}",
    name: "\uC721\uAC1C\uC7A5",
    desc: "\uC18C\uACE0\uAE30\uC640 \uACE0\uC0AC\uB9AC\uB97C \uB123\uACE0 \uB053\uC778 \uB9E4\uC6B4 \uAD6D\uBB3C \uC694\uB9AC"
  },
  {
    emoji: "\u{1F35C}",
    name: "\uC721\uAC1C\uC7A5\uCE7C\uAD6D\uC218",
    desc: "\uC721\uAC1C\uC7A5 \uAD6D\uBB3C\uC5D0 \uCE7C\uAD6D\uC218 \uBA74\uC744 \uB123\uC740 \uB4E0\uB4E0\uD55C \uBA74 \uC694\uB9AC"
  },
  {
    emoji: "\u{1F35C}",
    name: "\uCE58\uC988\uB77C\uBA74",
    desc: "\uB77C\uBA74\uC5D0 \uCE58\uC988\uB97C \uC62C\uB9B0 \uACE0\uC18C\uD55C \uC778\uC2A4\uD134\uD2B8 \uBA74 \uC694\uB9AC"
  },
  {
    emoji: "\u{1F35C}",
    name: "\uB5A1\uB77C\uBA74",
    desc: "\uB77C\uBA74\uC5D0 \uB5A1\uC744 \uB123\uC5B4 \uB354 \uB4E0\uB4E0\uD558\uAC8C \uB9CC\uB4E0 \uBA74 \uC694\uB9AC"
  },
  { emoji: "\u{1F35C}", name: "\uCAC4\uBA74", desc: "\uCAC4\uAE43\uD55C \uBA74\uBC1C\uC758 \uB9E4\uCF64\uB2EC\uCF64\uD55C \uD55C\uAD6D \uBA74 \uC694\uB9AC" },
  // 중식
  { emoji: "\u{1F95F}", name: "\uB524\uC12C", desc: "\uC791\uACE0 \uADC0\uC5EC\uC6B4 \uC911\uAD6D\uC2DD \uB9CC\uB450\uC640 \uC810\uC2EC \uC694\uB9AC" },
  {
    emoji: "\u{1F35C}",
    name: "\uC9DC\uC7A5\uBA74",
    desc: "\uB2EC\uCF64\uD55C \uCD98\uC7A5 \uC18C\uC2A4\uC758 \uD55C\uAD6D\uC2DD \uC911\uAD6D \uBA74\uC694\uB9AC"
  },
  { emoji: "\u{1F35D}", name: "\uC9EC\uBF55", desc: "\uB9E4\uCF64\uD55C \uD574\uBB3C \uAD6D\uBB3C\uC758 \uC5BC\uD070\uD55C \uC911\uAD6D \uBA74\uC694\uB9AC" },
  {
    emoji: "\u{1F960}",
    name: "\uD0D5\uC218\uC721",
    desc: "\uBC14\uC0AD\uD55C \uD280\uAE40\uC637\uACFC \uC0C8\uCF64\uB2EC\uCF64\uD55C \uC18C\uC2A4\uC758 \uC911\uC2DD"
  },
  {
    emoji: "\u{1F990}",
    name: "\uC0C8\uC6B0\uBCF6\uC74C\uBC25",
    desc: "\uD1B5\uD1B5\uD55C \uC0C8\uC6B0\uC640 \uACC4\uB780\uC774 \uB4E4\uC5B4\uAC04 \uACE0\uC18C\uD55C \uBCF6\uC74C\uBC25"
  },
  { emoji: "\u{1F372}", name: "\uB9C8\uD30C\uB450\uBD80", desc: "\uB9E4\uCF64\uD558\uACE0 \uC5BC\uC5BC\uD55C \uC0AC\uCC9C\uC2DD \uB450\uBD80 \uC694\uB9AC" },
  { emoji: "\u{1F95F}", name: "\uAD70\uB9CC\uB450", desc: "\uBC14\uC0AD\uD558\uAC8C \uAD6C\uC6B4 \uC911\uAD6D\uC2DD \uB9CC\uB450" },
  { emoji: "\u{1F356}", name: "\uAE50\uD48D\uAE30", desc: "\uB9E4\uCF64\uB2EC\uCF64\uD55C \uC18C\uC2A4\uC758 \uB2ED\uACE0\uAE30 \uC694\uB9AC" },
  // 일식
  { emoji: "\u{1F363}", name: "\uCD08\uBC25", desc: "\uC2E0\uC120\uD55C \uC0DD\uC120\uACFC \uC644\uBCBD\uD55C \uC0E4\uB9AC\uC758 \uC870\uD654" },
  { emoji: "\u{1F371}", name: "\uB36E\uBC25", desc: "\uB2E4\uC591\uD55C \uC7AC\uB8CC\uAC00 \uC62C\uB77C\uAC04 \uC77C\uBCF8\uC2DD \uB36E\uBC25" },
  { emoji: "\u{1F35C}", name: "\uB77C\uBA58", desc: "\uC9C4\uD55C \uAD6D\uBB3C\uC758 \uC77C\uBCF8 \uC804\uD1B5 \uBA74\uC694\uB9AC" },
  { emoji: "\u{1F359}", name: "\uC624\uB2C8\uAE30\uB9AC", desc: "\uAE40\uC73C\uB85C \uC2FC \uC77C\uBCF8\uC2DD \uC8FC\uBA39\uBC25" },
  {
    emoji: "\u{1F962}",
    name: "\uC6B0\uB3D9",
    desc: "\uCAC4\uAE43\uD55C \uBA74\uBC1C\uACFC \uAE54\uB054\uD55C \uAD6D\uBB3C\uC758 \uC77C\uBCF8 \uBA74\uC694\uB9AC"
  },
  { emoji: "\u{1F35C}", name: "\uC18C\uBC14", desc: "\uBA54\uBC00\uB85C \uB9CC\uB4E0 \uC77C\uBCF8 \uC804\uD1B5 \uBA74 \uC694\uB9AC" },
  { emoji: "\u{1F35B}", name: "\uADDC\uB3D9", desc: "\uC18C\uACE0\uAE30\uAC00 \uC62C\uB77C\uAC04 \uC77C\uBCF8\uC2DD \uB36E\uBC25" },
  { emoji: "\u{1F371}", name: "\uAC00\uCE20\uB3D9", desc: "\uB3C8\uAE4C\uC2A4\uAC00 \uC62C\uB77C\uAC04 \uC77C\uBCF8\uC2DD \uB36E\uBC25" },
  { emoji: "\u{1F35B}", name: "\uC624\uBBC0\uB77C\uC774\uC2A4", desc: "\uACC4\uB780\uC73C\uB85C \uAC10\uC2FC \uC77C\uBCF8\uC2DD \uBCF6\uC74C\uBC25" },
  { emoji: "\u{1F95F}", name: "\uAD50\uC790", desc: "\uBC14\uC0AD\uD558\uACE0 \uACE0\uC18C\uD55C \uC77C\uBCF8\uC2DD \uB9CC\uB450" },
  // 양식
  { emoji: "\u{1F355}", name: "\uD53C\uC790", desc: "\uB2E4\uC591\uD55C \uD1A0\uD551\uC774 \uC62C\uB77C\uAC04 \uC774\uD0C8\uB9AC\uC544 \uC694\uB9AC" },
  { emoji: "\u{1F354}", name: "\uD584\uBC84\uAC70", desc: "\uD328\uD2F0\uC640 \uC57C\uCC44\uAC00 \uB4E4\uC5B4\uAC04 \uC11C\uC591\uC2DD \uC0CC\uB4DC\uC704\uCE58" },
  {
    emoji: "\u{1F35D}",
    name: "\uD30C\uC2A4\uD0C0",
    desc: "\uB2E4\uC591\uD55C \uC18C\uC2A4\uC640 \uBA74\uC774 \uC5B4\uC6B0\uB7EC\uC9C4 \uC774\uD0C8\uB9AC\uC544 \uC694\uB9AC"
  },
  {
    emoji: "\u{1F96A}",
    name: "\uC0CC\uB4DC\uC704\uCE58",
    desc: "\uBE75 \uC0AC\uC774\uC5D0 \uB2E4\uC591\uD55C \uC7AC\uB8CC\uB97C \uB123\uC740 \uAC04\uD3B8\uC2DD"
  },
  { emoji: "\u{1F969}", name: "\uC2A4\uD14C\uC774\uD06C", desc: "\uBD80\uB4DC\uB7FD\uACE0 \uC721\uC999\uC774 \uD48D\uBD80\uD55C \uC18C\uACE0\uAE30 \uAD6C\uC774" },
  { emoji: "\u{1F357}", name: "\uCE58\uD0A8", desc: "\uBC14\uC0AD\uD558\uAC70\uB098 \uC591\uB150\uB41C \uB2ED\uACE0\uAE30 \uC694\uB9AC" },
  { emoji: "\u{1F96A}", name: "\uD1A0\uC2A4\uD2B8", desc: "\uBC84\uD130\uC640 \uC7BC\uC774 \uBC1C\uB77C\uC9C4 \uAC04\uB2E8\uD55C \uD1A0\uC2A4\uD2B8" },
  // 아시아 퓨전
  {
    emoji: "\u{1F32E}",
    name: "\uD0C0\uCF54",
    desc: "\uB610\uB760\uC544\uC5D0 \uACE0\uAE30\uC640 \uCC44\uC18C\uB97C \uB123\uC740 \uBA55\uC2DC\uCF54 \uC74C\uC2DD"
  },
  {
    emoji: "\u{1F32F}",
    name: "\uBE0C\uB9AC\uB610",
    desc: "\uB610\uB760\uC544\uC5D0 \uB2E4\uC591\uD55C \uC7AC\uB8CC\uB97C \uB123\uACE0 \uB9D0\uC544 \uB9CC\uB4E0 \uBA55\uC2DC\uCF54 \uC74C\uC2DD"
  },
  { emoji: "\u{1F35B}", name: "\uCE74\uB808", desc: "\uD5A5\uC2E0\uB8CC\uAC00 \uB4E4\uC5B4\uAC04 \uB2E4\uC591\uD55C \uC2A4\uD0C0\uC77C\uC758 \uCE74\uB808" },
  { emoji: "\u{1F959}", name: "\uCF00\uBC25", desc: "\uC911\uB3D9\uC2DD \uD5A5\uC2E0\uB8CC\uB85C \uC591\uB150\uD55C \uAF2C\uCE58\uAD6C\uC774" },
  { emoji: "\u{1F372}", name: "\uC300\uAD6D\uC218", desc: "\uBCA0\uD2B8\uB0A8 \uC804\uD1B5\uC758 \uAE54\uB054\uD55C \uAD6D\uBB3C \uC300\uBA74 \uC694\uB9AC" },
  { emoji: "\u{1F958}", name: "\uD31F\uD0C0\uC774", desc: "\uC0C8\uCF64\uB2EC\uCF64\uD55C \uD0DC\uAD6D\uC2DD \uBCF6\uC74C \uC300\uAD6D\uC218" },
  { emoji: "\u{1F35C}", name: "\uD1B0\uC58C\uAFCD", desc: "\uB9E4\uCF64\uC0C8\uCF64\uD55C \uD0DC\uAD6D \uC804\uD1B5 \uC0C8\uC6B0 \uC218\uD504" },
  { emoji: "\u{1F958}", name: "\uD558\uC774\uB77C\uC774\uC2A4", desc: "\uC77C\uBCF8\uC2DD \uCE74\uB808\uC640 \uBC25\uC758 \uC870\uD569" },
  // 건강식
  {
    emoji: "\u{1F957}",
    name: "\uC0D0\uB7EC\uB4DC",
    desc: "\uC2E0\uC120\uD55C \uC57C\uCC44\uC640 \uB2E4\uC591\uD55C \uC7AC\uB8CC\uC758 \uAC74\uAC15\uD55C \uC694\uB9AC"
  },
  { emoji: "\u{1F957}", name: "\uD3EC\uCF00\uBCFC", desc: "\uD558\uC640\uC774\uC2DD \uC0DD\uC120 \uC0D0\uB7EC\uB4DC \uBCFC" },
  // 세계 각국 요리
  { emoji: "\u{1F958}", name: "\uD30C\uC5D0\uC57C", desc: "\uC0AC\uD504\uB780 \uD5A5\uC774 \uB098\uB294 \uC2A4\uD398\uC778 \uC804\uD1B5 \uC300 \uC694\uB9AC" },
  { emoji: "\u{1F958}", name: "\uB9AC\uC870\uB610", desc: "\uD06C\uB9AC\uBBF8\uD55C \uC774\uD0C8\uB9AC\uC544 \uC300 \uC694\uB9AC" },
  // 간편식
  { emoji: "\u{1F371}", name: "\uBC30\uB2EC \uB3C4\uC2DC\uB77D", desc: "\uAC04\uD3B8\uD558\uACE0 \uADE0\uD615\uC7A1\uD78C \uD55C \uB07C \uC2DD\uC0AC" },
  {
    emoji: "\u{1F371}",
    name: "\uD3B8\uC758\uC810\uB3C4\uC2DC\uB77D",
    desc: "\uAC04\uD3B8\uD558\uAC8C \uAD6C\uC785\uD560 \uC218 \uC788\uB294 \uD3B8\uC758\uC810 \uB3C4\uC2DC\uB77D"
  },
  {
    emoji: "\u{1F35C}",
    name: "\uCEF5\uB77C\uBA74",
    desc: "\uAC04\uD3B8\uD558\uACE0 \uBE60\uB974\uAC8C \uBA39\uC744 \uC218 \uC788\uB294 \uC778\uC2A4\uD134\uD2B8 \uBA74"
  },
  { emoji: "\u{1F359}", name: "\uC8FC\uBA39\uBC25", desc: "\uC190\uC5D0 \uB4E4\uACE0 \uBA39\uAE30 \uD3B8\uD55C \uC791\uC740 \uD06C\uAE30\uC758 \uBC25" }
];
var gameSessions = /* @__PURE__ */ new Map();
var api_default = {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Naver-Client-Id, X-Naver-Client-Secret"
    };
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }
    try {
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
      if (url.pathname === "/api/game/nearby-restaurants") {
        return await handleNearbyRestaurants(request, env, corsHeaders);
      }
      if (url.pathname.startsWith("/api/naver/v1/search/local.json")) {
        return await handleNaverLocalSearch(request, env, corsHeaders);
      }
      if (url.pathname.startsWith("/api/naver/v1/search/image")) {
        return await handleNaverImageSearch(request, env, corsHeaders);
      }
      if (url.pathname.startsWith("/api/naver/v1/map-reversegeocode/v2/gc")) {
        return await handleNaverReverseGeocode(request, env, corsHeaders);
      }
      if (url.pathname === "/api/health") {
        return new Response(
          JSON.stringify({
            status: "OK",
            message: "Hunger Game Cloudflare Workers API is running!",
            environment: "production",
            timestamp: (/* @__PURE__ */ new Date()).toISOString(),
            features: ["food-tournament", "naver-api-proxy"]
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          }
        );
      }
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
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
  }
};
async function handleGetFoods(request, corsHeaders) {
  const url = new URL(request.url);
  const count = parseInt(url.searchParams.get("count")) || foods.length;
  const shuffled = [...foods].sort(() => 0.5 - Math.random());
  const selectedFoods = shuffled.slice(0, Math.min(count, foods.length));
  return new Response(
    JSON.stringify({
      success: true,
      data: selectedFoods,
      total: foods.length
    }),
    {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    }
  );
}
__name(handleGetFoods, "handleGetFoods");
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
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    lastUpdated: (/* @__PURE__ */ new Date()).toISOString()
  };
  gameSessions.set(sessionId, gameSession);
  return new Response(
    JSON.stringify({
      success: true,
      data: gameSession
    }),
    {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    }
  );
}
__name(handleCreateSession, "handleCreateSession");
async function handleGetSession(request, corsHeaders) {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get("sessionId");
  if (!sessionId) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Session ID is required"
      }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
  const session = gameSessions.get(sessionId);
  if (!session) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Session not found"
      }),
      {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
  return new Response(
    JSON.stringify({
      success: true,
      data: session
    }),
    {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    }
  );
}
__name(handleGetSession, "handleGetSession");
async function handleMakeChoice(request, corsHeaders) {
  if (request.method !== "POST") {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Method not allowed"
      }),
      {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
  const body = await request.json();
  const { sessionId, selectedFood, currentRound } = body;
  if (!sessionId || !selectedFood) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Session ID and selected food are required"
      }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
  const session = gameSessions.get(sessionId);
  if (!session) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Session not found"
      }),
      {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
  session.currentRound = currentRound + 1;
  session.choices.push(selectedFood);
  const foodName = selectedFood.name;
  session.foodCounts[foodName] = (session.foodCounts[foodName] || 0) + 1;
  if (session.currentRound === 12) {
    session.gamePhase = 2;
  } else if (session.currentRound === 18) {
    session.gamePhase = 3;
  }
  session.lastUpdated = (/* @__PURE__ */ new Date()).toISOString();
  gameSessions.set(sessionId, session);
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
        isGameComplete: session.currentRound >= session.totalRounds
      }
    }),
    {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    }
  );
}
__name(handleMakeChoice, "handleMakeChoice");
async function handleGetResult(request, corsHeaders) {
  const url = new URL(request.url);
  const sessionId = url.searchParams.get("sessionId");
  if (!sessionId) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Session ID is required"
      }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
  const session = gameSessions.get(sessionId);
  if (!session) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Session not found"
      }),
      {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
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
          gamePhase: session.gamePhase
        }
      }
    }),
    {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    }
  );
}
__name(handleGetResult, "handleGetResult");
function generateNextOptions(session) {
  let currentPool = session.availableFoods;
  if (session.gamePhase === 2) {
    currentPool = getTopFoods(session, 12);
  } else if (session.gamePhase === 3) {
    currentPool = getTopFoods(session, 4);
  }
  const shuffled = [...currentPool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 2);
}
__name(generateNextOptions, "generateNextOptions");
function getTopFoods(session, count) {
  const foodScores = /* @__PURE__ */ new Map();
  for (const [foodName, selectCount] of Object.entries(session.foodCounts)) {
    const food = session.availableFoods.find((f) => f.name === foodName);
    if (food) {
      const recentSelections = session.choices.slice(-8).filter((choice) => choice.name === foodName).length;
      const score = selectCount + recentSelections * 0.5;
      foodScores.set(food, score);
    }
  }
  const sortedFoods = Array.from(foodScores.entries()).sort((a, b) => b[1] - a[1]).slice(0, count).map((entry) => entry[0]);
  const unselectedFoods = session.availableFoods.filter(
    (food) => !session.foodCounts[food.name]
  );
  const remainingSlots = count - sortedFoods.length;
  if (remainingSlots > 0 && unselectedFoods.length > 0) {
    const randomUnselected = unselectedFoods.sort(() => 0.5 - Math.random()).slice(0, remainingSlots);
    sortedFoods.push(...randomUnselected);
  }
  return sortedFoods.slice(0, count);
}
__name(getTopFoods, "getTopFoods");
function decideFinalWinner(session) {
  if (session.choices.length === 0) {
    return session.availableFoods[0];
  }
  const foodScores = {};
  session.choices.forEach((food, index) => {
    const roundWeight = index < 12 ? 1 : index < 18 ? 1.5 : 2;
    const recentWeight = index >= session.choices.length - 5 ? 1.2 : 1;
    foodScores[food.name] = (foodScores[food.name] || 0) + roundWeight * recentWeight;
  });
  let maxScore = 0;
  let winner = session.choices[session.choices.length - 1];
  for (const [foodName, score] of Object.entries(foodScores)) {
    if (score > maxScore) {
      maxScore = score;
      const food = session.availableFoods.find((f) => f.name === foodName) || session.choices.find((f) => f.name === foodName);
      if (food) winner = food;
    }
  }
  return winner;
}
__name(decideFinalWinner, "decideFinalWinner");
function generateSessionId() {
  return "session_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
}
__name(generateSessionId, "generateSessionId");
async function handleNearbyRestaurants(request, env, corsHeaders) {
  try {
    const url = new URL(request.url);
    const foodName = url.searchParams.get("foodName");
    const latitude = url.searchParams.get("latitude");
    const longitude = url.searchParams.get("longitude");
    const radius = url.searchParams.get("radius") || "1500";
    if (!foodName || !latitude || !longitude) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "foodName, latitude, longitude parameters are required"
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
    const searchKeywords = generateSearchKeywords(foodName);
    const restaurants = [];
    for (const keyword of searchKeywords) {
      const searchQuery = `${keyword} ${latitude},${longitude}`;
      const naverUrl = `https://openapi.naver.com/v1/search/local.json?query=${encodeURIComponent(
        searchQuery
      )}&display=10&start=1&sort=distance`;
      const response = await fetch(naverUrl, {
        headers: {
          "X-Naver-Client-Id": env.VITE_NAVER_CLIENT_ID,
          "X-Naver-Client-Secret": env.VITE_NAVER_CLIENT_SECRET,
          "User-Agent": "Mozilla/5.0 (compatible; HungerGame/1.0)"
        }
      });
      if (response.ok) {
        const data = await response.json();
        if (data.items && data.items.length > 0) {
          const filteredItems = data.items.filter((item) => {
            item.title = item.title.replace(/<[^>]*>/g, "");
            item.category = item.category.replace(/<[^>]*>/g, "");
            item.address = item.address.replace(/<[^>]*>/g, "");
            item.roadAddress = item.roadAddress.replace(/<[^>]*>/g, "");
            return !restaurants.some(
              (existing) => existing.title === item.title && existing.address === item.address
            );
          }).slice(0, 5);
          restaurants.push(...filteredItems);
        }
      }
    }
    const sortedRestaurants = restaurants.sort((a, b) => {
      return 0;
    }).slice(0, 15);
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          foodName,
          restaurants: sortedRestaurants,
          total: sortedRestaurants.length,
          searchRadius: `${radius}m`
        }
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error("Error searching nearby restaurants:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to search nearby restaurants"
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
}
__name(handleNearbyRestaurants, "handleNearbyRestaurants");
function generateSearchKeywords(foodName) {
  const keywordMap = {
    // 한식
    \uCC0C\uAC1C: ["\uCC0C\uAC1C", "\uAE40\uCE58\uCC0C\uAC1C", "\uB41C\uC7A5\uCC0C\uAC1C", "\uBD80\uB300\uCC0C\uAC1C"],
    \uAD6D: ["\uAD6D", "\uBBF8\uC5ED\uAD6D", "\uC124\uB801\uD0D5", "\uC21C\uB300\uAD6D", "\uAC08\uBE44\uD0D5"],
    \uB77C\uBA74: ["\uB77C\uBA74", "\uB77C\uBA58", "\uBA74\uC694\uB9AC"],
    \uB0C9\uBA74: ["\uB0C9\uBA74", "\uBB3C\uB0C9\uBA74", "\uBE44\uBE54\uB0C9\uBA74"],
    \uCE7C\uAD6D\uC218: ["\uCE7C\uAD6D\uC218", "\uC218\uC81C\uBE44", "\uAD6D\uC218"],
    \uB9CC\uB450: ["\uB9CC\uB450", "\uAD70\uB9CC\uB450", "\uCC10\uB9CC\uB450"],
    \uBE44\uBE54\uBC25: ["\uBE44\uBE54\uBC25", "\uB3CC\uC1A5\uBE44\uBE54\uBC25"],
    \uB36E\uBC25: ["\uB36E\uBC25", "\uADDC\uB3D9", "\uAC00\uCE20\uB3D9"],
    \uAE40\uBC25: ["\uAE40\uBC25", "\uB9C8\uC57D\uAE40\uBC25"],
    \uBD88\uACE0\uAE30: ["\uBD88\uACE0\uAE30", "\uC591\uB150\uAC08\uBE44", "\uACE0\uAE30\uAD6C\uC774"],
    \uAC08\uBE44: ["\uAC08\uBE44", "\uB3FC\uC9C0\uAC08\uBE44", "\uC18C\uAC08\uBE44"],
    \uBC31\uBC18: ["\uBC31\uBC18", "\uD55C\uC815\uC2DD", "\uC815\uC2DD"],
    \uC0DD\uC120\uAD6C\uC774: ["\uC0DD\uC120\uAD6C\uC774", "\uC870\uAE30\uAD6C\uC774", "\uACE0\uB4F1\uC5B4\uAD6C\uC774"],
    \uAE40\uCE58\uBCF6\uC74C\uBC25: ["\uAE40\uCE58\uBCF6\uC74C\uBC25", "\uBCF6\uC74C\uBC25"],
    \uC81C\uC721\uBCF6\uC74C: ["\uC81C\uC721\uBCF6\uC74C", "\uB3FC\uC9C0\uACE0\uAE30\uBCF6\uC74C"],
    \uB5A1\uBCF6\uC774: ["\uB5A1\uBCF6\uC774", "\uBD84\uC2DD"],
    \uD280\uAE40: ["\uD280\uAE40", "\uC624\uC9D5\uC5B4\uD280\uAE40", "\uC0C8\uC6B0\uD280\uAE40"],
    \uC721\uAC1C\uC7A5: ["\uC721\uAC1C\uC7A5", "\uC5BC\uD070\uD55C\uAD6D\uBB3C"],
    \uC721\uAC1C\uC7A5\uCE7C\uAD6D\uC218: ["\uC721\uAC1C\uC7A5\uCE7C\uAD6D\uC218", "\uCE7C\uAD6D\uC218"],
    \uCE58\uC988\uB77C\uBA74: ["\uCE58\uC988\uB77C\uBA74", "\uB77C\uBA74"],
    \uB5A1\uB77C\uBA74: ["\uB5A1\uB77C\uBA74", "\uB77C\uBA74"],
    \uCAC4\uBA74: ["\uCAC4\uBA74", "\uBE44\uBE54\uBA74"],
    // 중식
    \uB524\uC12C: ["\uB524\uC12C", "\uC911\uC2DD\uB2F9", "\uB9CC\uB450"],
    \uC9DC\uC7A5\uBA74: ["\uC9DC\uC7A5\uBA74", "\uC911\uAD6D\uC9D1", "\uC911\uC2DD"],
    \uC9EC\uBF55: ["\uC9EC\uBF55", "\uC911\uAD6D\uC9D1", "\uC911\uC2DD"],
    \uD0D5\uC218\uC721: ["\uD0D5\uC218\uC721", "\uC911\uC2DD\uB2F9"],
    \uC0C8\uC6B0\uBCF6\uC74C\uBC25: ["\uC0C8\uC6B0\uBCF6\uC74C\uBC25", "\uBCF6\uC74C\uBC25", "\uC911\uC2DD"],
    \uB9C8\uD30C\uB450\uBD80: ["\uB9C8\uD30C\uB450\uBD80", "\uC911\uC2DD\uB2F9"],
    \uAD70\uB9CC\uB450: ["\uAD70\uB9CC\uB450", "\uC911\uC2DD\uB2F9"],
    \uAE50\uD48D\uAE30: ["\uAE50\uD48D\uAE30", "\uC911\uC2DD\uB2F9"],
    // 일식
    \uCD08\uBC25: ["\uCD08\uBC25", "\uC2A4\uC2DC", "\uC77C\uC2DD\uB2F9"],
    \uB77C\uBA58: ["\uB77C\uBA58", "\uC77C\uBCF8\uB77C\uBA74", "\uC77C\uC2DD"],
    \uC624\uB2C8\uAE30\uB9AC: ["\uC624\uB2C8\uAE30\uB9AC", "\uC8FC\uBA39\uBC25", "\uC77C\uC2DD"],
    \uC6B0\uB3D9: ["\uC6B0\uB3D9", "\uC77C\uC2DD\uB2F9"],
    \uC18C\uBC14: ["\uC18C\uBC14", "\uBA54\uBC00\uAD6D\uC218", "\uC77C\uC2DD"],
    \uADDC\uB3D9: ["\uADDC\uB3D9", "\uC18C\uACE0\uAE30\uB36E\uBC25", "\uC77C\uC2DD"],
    \uAC00\uCE20\uB3D9: ["\uAC00\uCE20\uB3D9", "\uB3C8\uAE4C\uC2A4\uB36E\uBC25", "\uC77C\uC2DD"],
    \uC624\uBBC0\uB77C\uC774\uC2A4: ["\uC624\uBBC0\uB77C\uC774\uC2A4", "\uC77C\uC2DD\uB2F9"],
    \uAD50\uC790: ["\uAD50\uC790", "\uAD70\uB9CC\uB450", "\uC77C\uC2DD"],
    // 양식
    \uD53C\uC790: ["\uD53C\uC790", "\uD53C\uC790\uD5DB", "\uB3C4\uBBF8\uB178\uD53C\uC790"],
    \uD584\uBC84\uAC70: ["\uD584\uBC84\uAC70", "\uBC84\uAC70\uD0B9", "\uB9E5\uB3C4\uB0A0\uB4DC"],
    \uD30C\uC2A4\uD0C0: ["\uD30C\uC2A4\uD0C0", "\uC2A4\uD30C\uAC8C\uD2F0", "\uC774\uD0C8\uB9AC\uC548"],
    \uC0CC\uB4DC\uC704\uCE58: ["\uC0CC\uB4DC\uC704\uCE58", "\uC11C\uBE0C\uC6E8\uC774", "\uD1A0\uC2A4\uD2B8"],
    \uC2A4\uD14C\uC774\uD06C: ["\uC2A4\uD14C\uC774\uD06C", "\uC591\uC2DD\uB2F9", "\uACE0\uAE30"],
    \uCE58\uD0A8: ["\uCE58\uD0A8", "\uD6C4\uB77C\uC774\uB4DC\uCE58\uD0A8", "\uC591\uB150\uCE58\uD0A8"],
    \uD1A0\uC2A4\uD2B8: ["\uD1A0\uC2A4\uD2B8", "\uC0CC\uB4DC\uC704\uCE58"],
    // 기타
    \uD0C0\uCF54: ["\uD0C0\uCF54", "\uBA55\uC2DC\uCE78", "\uBE0C\uB9AC\uB610"],
    \uBE0C\uB9AC\uB610: ["\uBE0C\uB9AC\uB610", "\uBA55\uC2DC\uCE78", "\uD0C0\uCF54"],
    \uCE74\uB808: ["\uCE74\uB808", "\uC778\uB3C4\uCE74\uB808", "\uC77C\uBCF8\uCE74\uB808"],
    \uCF00\uBC25: ["\uCF00\uBC25", "\uD130\uD0A4\uC74C\uC2DD"],
    \uC300\uAD6D\uC218: ["\uC300\uAD6D\uC218", "\uBCA0\uD2B8\uB0A8\uC74C\uC2DD", "\uD3EC"],
    \uD31F\uD0C0\uC774: ["\uD31F\uD0C0\uC774", "\uD0DC\uAD6D\uC74C\uC2DD"],
    \uD1B0\uC58C\uAFCD: ["\uD1B0\uC58C\uAFCD", "\uD0DC\uAD6D\uC74C\uC2DD"],
    \uD558\uC774\uB77C\uC774\uC2A4: ["\uD558\uC774\uB77C\uC774\uC2A4", "\uCE74\uB808\uB77C\uC774\uC2A4"],
    \uC0D0\uB7EC\uB4DC: ["\uC0D0\uB7EC\uB4DC", "\uC0D0\uB7EC\uB4DC\uBC14"],
    \uD3EC\uCF00\uBCFC: ["\uD3EC\uCF00\uBCFC", "\uD558\uC640\uC774\uC548"]
  };
  const keywords = keywordMap[foodName];
  if (keywords) {
    return keywords;
  }
  return [foodName, `${foodName} \uB9DB\uC9D1`, "\uC74C\uC2DD\uC810"];
}
__name(generateSearchKeywords, "generateSearchKeywords");
async function handleNaverLocalSearch(request, env, corsHeaders) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const naverUrl = new URL("https://openapi.naver.com/v1/search/local.json");
  for (const [key, value] of searchParams) {
    naverUrl.searchParams.set(key, value);
  }
  const response = await fetch(naverUrl.toString(), {
    headers: {
      "X-Naver-Client-Id": env.VITE_NAVER_CLIENT_ID,
      "X-Naver-Client-Secret": env.VITE_NAVER_CLIENT_SECRET,
      "User-Agent": "Mozilla/5.0 (compatible; LunchHunt/1.0)"
    }
  });
  const data = await response.json();
  return new Response(JSON.stringify(data), {
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}
__name(handleNaverLocalSearch, "handleNaverLocalSearch");
async function handleNaverImageSearch(request, env, corsHeaders) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const naverUrl = new URL("https://openapi.naver.com/v1/search/image");
  for (const [key, value] of searchParams) {
    naverUrl.searchParams.set(key, value);
  }
  const response = await fetch(naverUrl.toString(), {
    headers: {
      "X-Naver-Client-Id": env.VITE_NAVER_CLIENT_ID,
      "X-Naver-Client-Secret": env.VITE_NAVER_CLIENT_SECRET,
      "User-Agent": "Mozilla/5.0 (compatible; LunchHunt/1.0)"
    }
  });
  const data = await response.json();
  return new Response(JSON.stringify(data), {
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}
__name(handleNaverImageSearch, "handleNaverImageSearch");
async function handleNaverReverseGeocode(request, env, corsHeaders) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;
  const naverUrl = new URL(
    "https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc"
  );
  for (const [key, value] of searchParams) {
    naverUrl.searchParams.set(key, value);
  }
  const response = await fetch(naverUrl.toString(), {
    headers: {
      "X-Naver-Client-Id": env.VITE_NAVER_CLIENT_ID,
      "X-Naver-Client-Secret": env.VITE_NAVER_CLIENT_SECRET,
      "User-Agent": "Mozilla/5.0 (compatible; LunchHunt/1.0)"
    }
  });
  const data = await response.json();
  return new Response(JSON.stringify(data), {
    headers: { ...corsHeaders, "Content-Type": "application/json" }
  });
}
__name(handleNaverReverseGeocode, "handleNaverReverseGeocode");
async function serveStaticFile(filename, contentType, corsHeaders, env) {
  if (env.ASSETS) {
    try {
      const asset = await env.ASSETS.fetch(
        new Request(`http://placeholder/${filename}`)
      );
      if (asset.status === 200) {
        const content2 = await asset.text();
        return new Response(content2, {
          headers: { ...corsHeaders, "Content-Type": contentType }
        });
      }
    } catch (error) {
      console.error(`Error serving ${filename}:`, error);
    }
  }
  let content = "";
  switch (filename) {
    case "style.css":
      return new Response("CSS file not found", {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "text/css" }
      });
    case "script.js":
      return new Response("JavaScript file not found", {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/javascript" }
      });
    case "index.html":
      content = `<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>\uC624\uB298 \uBB50 \uBA39\uC9C0? \u{1F37D}\uFE0F \uD1A0\uB108\uBA3C\uD2B8</title>
    <link rel="stylesheet" href="style.css" />
    <link
      href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&display=swap"
      rel="stylesheet" />
  </head>
  <body>
    <div class="container">
      <header class="header">
        <h1>\u{1F37D}\uFE0F \uC624\uB298 \uBB50 \uBA39\uC9C0?</h1>
        <p class="subtitle">\uD1A0\uB108\uBA3C\uD2B8\uB85C \uACB0\uC815\uD574\uBCF4\uC138\uC694!</p>
      </header>

      <div class="game-container">
        <!-- \uC2DC\uC791 \uD654\uBA74 -->
        <div id="start-screen" class="screen active">
          <div class="start-content">
            <div class="game-info">
              <h2>\uAC8C\uC784 \uBC29\uBC95</h2>
              <ul>
                <li>\uB450 \uAC1C\uC758 \uC74C\uC2DD \uC911 \uD558\uB098\uB97C \uC120\uD0DD\uD558\uC138\uC694</li>
                <li>\uCD1D 20\uBC88\uC758 \uC120\uD0DD\uC744 \uD1B5\uD574 \uCD5C\uC885 \uC74C\uC2DD\uC744 \uACB0\uC815\uD569\uB2C8\uB2E4</li>
                <li>\uB2F9\uC2E0\uC758 \uCDE8\uD5A5\uC5D0 \uB9DE\uB294 \uC74C\uC2DD\uC744 \uCC3E\uC544\uBCF4\uC138\uC694!</li>
              </ul>
            </div>
            <button id="start-btn" class="start-button">\uAC8C\uC784 \uC2DC\uC791 \u{1F3AE}</button>
          </div>
        </div>

        <!-- \uAC8C\uC784 \uD654\uBA74 -->
        <div id="game-screen" class="screen">
          <div class="progress-container">
            <div class="progress-bar">
              <div id="progress" class="progress-fill"></div>
            </div>
            <span id="round-counter" class="round-text">1 / 20</span>
          </div>

          <div class="vs-container">
            <div class="food-option" id="option1">
              <div class="food-emoji" id="emoji1">\u{1F355}</div>
              <h3 id="name1" class="food-name">\uD53C\uC790</h3>
              <p id="desc1" class="food-desc">\uCE58\uC988\uAC00 \uB4EC\uBFCD \uB4E4\uC5B4\uAC04 \uB9DB\uC788\uB294 \uD53C\uC790</p>
            </div>

            <div class="vs-divider">
              <span class="vs-text">VS</span>
            </div>

            <div class="food-option" id="option2">
              <div class="food-emoji" id="emoji2">\u{1F35C}</div>
              <h3 id="name2" class="food-name">\uB77C\uBA74</h3>
              <p id="desc2" class="food-desc">\uB530\uB73B\uD558\uACE0 \uC5BC\uD070\uD55C \uB77C\uBA74</p>
            </div>
          </div>
        </div>

        <!-- \uACB0\uACFC \uD654\uBA74 -->
        <div id="result-screen" class="screen">
          <div class="result-content">
            <h2>\u{1F389} \uACB0\uC815\uB418\uC5C8\uC2B5\uB2C8\uB2E4!</h2>
            <div class="final-food">
              <div id="final-emoji" class="final-emoji">\u{1F355}</div>
              <h3 id="final-name" class="final-name">\uD53C\uC790</h3>
              <p id="final-desc" class="final-desc">\uC624\uB298\uC740 \uC774\uAC78\uB85C \uACB0\uC815!</p>
            </div>
            
            <!-- \uADFC\uCC98 \uC74C\uC2DD\uC810 \uCC3E\uAE30 \uC139\uC158 -->
            <div class="nearby-section">
              <button id="find-nearby-btn" class="find-nearby-button">
                \u{1F4CD} \uB0B4 \uADFC\uCC98 \uC74C\uC2DD\uC810 \uCC3E\uAE30
              </button>
              <div id="location-status" class="location-status"></div>
              <div id="restaurants-container" class="restaurants-container hidden">
                <h3 class="restaurants-title">\uADFC\uCC98 \uC74C\uC2DD\uC810 (1.5km \uC774\uB0B4)</h3>
                <div id="restaurants-list" class="restaurants-list"></div>
              </div>
            </div>
            
            <button id="restart-btn" class="restart-button">
              \uB2E4\uC2DC \uD558\uAE30 \u{1F504}
            </button>
          </div>
        </div>
      </div>
    </div>

    <script src="script.js"><\/script>
  </body>
</html>`;
      break;
    default:
      return new Response("File not found", {
        status: 404,
        headers: corsHeaders
      });
  }
  return new Response(content, {
    headers: { ...corsHeaders, "Content-Type": contentType }
  });
}
__name(serveStaticFile, "serveStaticFile");

// ../../../../.nvm/versions/node/v22.16.0/lib/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// ../../../../.nvm/versions/node/v22.16.0/lib/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-4WHswG/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = api_default;

// ../../../../.nvm/versions/node/v22.16.0/lib/node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-4WHswG/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=api.js.map
