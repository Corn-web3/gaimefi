import { useStore } from "@/stores";
import { request } from "./request";

// /api/v1/user/auth/challenge
// /api/v1/user/auth/login

// Get login challenge token
export const getChallenge = async (params: any) => {
  const response = await request.get(`/v1/user/auth/challenge`, {
    params,
  });
  return response;
};

export const userLogin = async (params: any) => {
  const response = await request.post("/v1/user/login", params);
  const { setToken } = useStore.getState();
  setToken(response);
  return response;
};

export const getUserInfo = async () => {
  const response = await request.get("/v1/user/current");
  const { setUser } = useStore.getState();
  setUser(response);
  return response;
};
export const userLogout = async () => {
  const response = await request.put("/v1/user/logout");
  const { setUser, setToken } = useStore.getState();
  setUser(null);
  setToken(null);
  return response;
};
