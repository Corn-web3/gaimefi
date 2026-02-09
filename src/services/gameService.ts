import { request } from "./request";

export const getGameListApi = async (params: any) => {
  const response = await request.get(`/v1/game`, { params });
  return response;
};

export const createGame = async (params: any) => {
  const response = await request.post(`/v1/game/create`, params);
  return response;
};
export const newGame = async () => {
  const response = await request.get(`/v1/game/new`);
  return response;
};

export const getGameType = async () => {
  const response = await request.get(`/v1/game/type`);
  return response;
};

export const chatWithAiApiPost = async (params: any) => {
  const response = await request.post(`/v1/game/chat`, params);
  return response;
};

export const chatWithAiApi = async (params: any) => {
  const response = await request.post(`/v1/game/chat`, params);
  return response;
};

export const getChatHistoryApi = async (address: string) => {
  const response = await request.get(
    `/v1/game/chat/history?address=${address}`
  );
  return response;
};

// Clear chat history
export const clearChatHistory = async (gameId: string) => {
  const response = await request.post(`/v1/game/chat/history/clear`, {
    gameId,
  });
  return response;
};

// Get game details
export const getGameDetailByGameId = async (address: string) => {
  const response = await request.get(`/v1/game/${address}`);
  return response;
};

// Get game details by address
export const getGameDetailByAddress = async (address: string) => {
  const response = await request.get(`/v1/game/byAddress?address=${address}`);
  return response;
};

// Get game assets
export const getGameAssetsByAddress = async (params: any) => {
  const response = await request.get(`/v1/game/asset`, { params });
  return response;
};

// Create game asset
export const createGameAssetApi = async (params: any) => {
  const response = await request.post(`/v1/game/asset/create`, params);
  return response;
};

// Delete game asset
export const deleteGameAssetApi = async (assetId: string) => {
  const response = await request.delete(`/v1/game/asset/delete/${assetId}`);
  return response;
};

// Get almost jeet game
export const getAlmostGame = async () => {
  const response = await request.get(`/v1/game/almost`);
  return response;
};

// Publish game
export const publishGame = async (params: any) => {
  const response = await request.post(`/v1/game/publish`, params);
  return response;
};

// Get Kline chart
export const getKlineChart = async (address: string, params: any) => {
  const response = await request.get(`/v1/game/kline?address=${address}`, {
    params,
  });
  return response;
};

// bonding curve
export const getBondingCurve = async (address: string) => {
  const response = await request.get(`/v1/game/progress?address=${address}`);
  return response;
};

// Get game owners
export const getGameOwners = async (address: string) => {
  const response = await request.get(`/v1/game/owners?address=${address}`);
  return response;
};

// Get tokens created by self
export const getMyGameToken = async (params: any) => {
  const response = await request.get(`/v1/game/created`, { params });
  return response;
};

// Get tokens held by self
export const getMyGameHold = async (params: any) => {
  const response = await request.get(`/v1/game/held`, { params });
  return response;
};

// Add play record
export const addPlayRecord = async (params: any) => {
  const response = await request.post(`/v1/game/playRecord/create`, params);
  return response;
};

// Apply game code
export const applyGame = async (params: any) => {
  const response = await request.post(`/v1/game/apply`, params);
  return response;
};

// Get apply record
export const getApplyRecord = async (params: any) => {
  const response = await request.get(`/v1/game/applyRecord`, { params });
  return response;
};

// Create game code
export const rebuildGameCode = async (params: any) => {
  const response = await request.post(`/v1/game/createCode`, params);
  return response;
};

// Update game asset
export const updateGameAsset = async (assetId: string, params: any) => {
  const response = await request.put(
    `/v1/game/asset/update/${assetId}`,
    params
  );
  return response;
};

// Upload file
export const uploadFile = async (params: any) => {
  const response = await request.post(`/v1/file/upload`, params, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
};

// Get Kline chart
export const getReserve = async (address: string) => {
  // https://api.gaime.fun/syncer/api/v1/eth/addresses?wallet_address=
  // const response = await request.get(`/v1/game/reserve?address=${address}`);
  const response = await request.get(
    `/v1/eth/addresses?wallet_address=${address}`
  );
  return response;
};

// Get token price
export const getTokenPrice = async (address: string) => {
  const response = await request.get(
    `/v1/game/moralis/getTokenPrice?address=${address}`
  );
  return response;
};

// Get Awaken cost
export const getAwakenCost = async () => {
  const response = await request.get(`/v1/game/awakenCost`);
  return response;
};

// Get Awaken record
export const getAwakenRecord = async (address: any) => {
  const response = await request.get(
    `/v1/game/awakenRecord?address=${address}`
  );
  return response;
};

// Create Awaken record
export const createAwakenRecord = async (params: any) => {
  const response = await request.post(`/v1/game/awakenRecord/create`, params);
  return response;
};
