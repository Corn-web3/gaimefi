import { request } from "./request";

export const getProposal = (params: any) => {
  return request.get("/v1/game/proposal", { params });
};

export const createProposal = (params: any) => {
  return request.post("/v1/game/proposal/create", params);
};

// Delete proposal
export const deleteProposal = async (proposalId: string) => {
  const response = await request.delete(
    `/v1/game/proposal/delete/${proposalId}`
  );
  return response;
};

export const voteProposal = (params: any) => {
  return request.post("/v1/game/proposal/vote", params);
};
