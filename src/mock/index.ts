import { MOCK_GAMES, MOCK_ALMOST_GAME } from "./data/games";
import {
  MOCK_GAME_DETAIL,
  MOCK_KLINE_DATA,
  MOCK_COMMENTS,
  MOCK_PROPOSALS,
  MOCK_BONDING_CURVE,
  MOCK_HOLDERS,
} from "./data/coin";

export const mockRequest = async (config: any) => {
  const { url, method, params } = config;

  console.log(`[Mock] Intercepted ${method?.toUpperCase()} ${url}`, params);

  await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate latency

  // --- Home Page ---

  if (url === "/v1/game" && method === "get") {
    return {
      status: 1,
      data: MOCK_GAMES,
      extra: {
        total: MOCK_GAMES.length,
        page: params?.page || 1,
        pageSize: params?.pageSize || 10,
      },
    };
  }

  if (url === "/v1/game/almost" && method === "get") {
    return {
      status: 1,
      data: [MOCK_ALMOST_GAME],
    };
  }

  if (url.includes("/v1/game/moralis/getTokenPrice") && method === "get") {
    return {
      status: 1,
      data: {
        usdPrice: 0.0000123,
      },
    };
  }

  // --- Coin Inner Page ---

  // Game Detail by Address
  if (url.includes("/v1/game/byAddress") && method === "get") {
    return {
      status: 1,
      data: MOCK_GAME_DETAIL,
    };
  }

  // Kline Chart
  if (url.includes("/v1/game/kline") && method === "get") {
    return {
      status: 1,
      data: MOCK_KLINE_DATA,
    };
  }

  // Comments
  if (url === "/v1/game/comment" && method === "get") {
    return {
      status: 1,
      data: MOCK_COMMENTS,
      extra: {
        total: MOCK_COMMENTS.length,
        page: params?.page || 1,
        pageSize: params?.pageSize || 10,
      },
    };
  }

  // Proposals
  if (url === "/v1/game/proposal" && method === "get") {
    return {
      status: 1,
      data: MOCK_PROPOSALS,
      extra: {
        total: MOCK_PROPOSALS.length,
        page: params?.page || 1,
        pageSize: params?.pageSize || 10,
        votedProposalIds: [],
      },
    };
  }

  // Bonding Curve Progress
  if (url.includes("/v1/game/progress") && method === "get") {
    return {
      status: 1,
      data: MOCK_BONDING_CURVE,
    };
  }

  // Holders / Owners
  if (url.includes("/v1/game/owners") && method === "get") {
    return {
      status: 1,
      data: MOCK_HOLDERS,
    };
  }

  // --- Create Game & Awaken ---

  // Game Type
  if (url === "/v1/game/type" && method === "get") {
    return {
      status: 1,
      data: [
        { name: "2D", id: 1 },
        { name: "3D", id: 2 },
        { name: "Pixel", id: 3 },
        { name: "Text", id: 4 },
      ],
    };
  }

  // Create Game
  if (url === "/v1/game/create" && method === "post") {
    return {
      status: 1,
      data: {
        id: "mock-game-id-" + Date.now(),
        ...config.data,
      },
      msg: "Game created successfully (Mock)",
    };
  }

  // Awaken Cost
  if (url === "/v1/game/awakenCost" && method === "get") {
    return {
      status: 1,
      data: "10000000000000000", // 0.01 ETH
    };
  }

  // Create Awaken Record
  if (url === "/v1/game/awakenRecord/create" && method === "post") {
    return {
      status: 1,
      data: {
        id: "mock-awaken-record-" + Date.now(),
      },
      msg: "Awaken record created (Mock)",
    };
  }

  // Chat History (Optional)
  if (url.includes("/v1/game/chat/history") && method === "get") {
    return {
      status: 1,
      data: [], // Empty history for now
    };
  }

  // Default fallback if no mock found (or we can throw error)
  console.warn(`[Mock] No mock handler for ${url}`);
  return { status: 0, msg: "Mock endpoint not found" };
};
