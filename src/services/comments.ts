import { request } from "./request";

export const getComments = (params: any) => {
  return request.get("/v1/game/comment", { params });
};

export const createComment = (params: any) => {
  return request.post("/v1/game/comment/create", params);
};
