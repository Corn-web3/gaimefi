import { delay } from "@/utils/delay";

const X_Api_Key = process.env.REACT_APP_FLEEK_API_KEY || "";
const PROJECT_ID = process.env.REACT_APP_FLEEK_PROJECT_ID;

const post = async (url: string, data: any = {}) => {
  const response = await fetch("https://api.fleek.xyz/api" + url, {
    method: "POST", // Or "POST" depending on API requirements
    headers: {
      "Content-Type": "application/json",
      // If authorization token is needed, add:
      // "Authorization": "Bearer YOUR_ACCESS_TOKEN"
      "X-Api-Key": X_Api_Key,
    },
    body: data ? JSON.stringify(data) : null,
  });
  try {
    const res = await response?.json();
    return res;
  } catch (error) {
    return null;
  }
};

const get = async (url: string) => {
  const response = await fetch("https://api.fleek.xyz/api" + url, {
    method: "GET", // Or "POST" depending on API requirements
    headers: {
      "Content-Type": "application/json",
      // If authorization token is needed, add:
      // "Authorization": "Bearer YOUR_ACCESS_TOKEN"
      "X-Api-Key": X_Api_Key,
    },
  });
  try {
    const res = await response?.json();
    return res;
  } catch (error) {
    return null;
  }
};

export const Delete = async (url: string) => {
  const response = await fetch("https://api.fleek.xyz/api" + url, {
    method: "DELETE", // Or "POST" depending on API requirements
    headers: {
      "Content-Type": "application/json",
      // If authorization token is needed, add:
      // "Authorization": "Bearer YOUR_ACCESS_TOKEN"
      "X-Api-Key": X_Api_Key,
    },
  });
  try {
    const res = await response?.json();
    return res;
  } catch (error) {
    return null;
  }
};

export const createEliza = async (data: any) => {
  const res = (await post("/v2/ai-agents", {
    name: data.name,
    config: JSON.stringify(data),
    projectId: PROJECT_ID,
  })) as any;

  await delay(6000);
  const startRes = (await post(`/v1/ai-agents/${res.id}/publish`)) as any;
  const statusRes = (await get(`/v1/ai-agents/${res.id}/status`)) as any;
  // const res = (await request.post(
  //   "/eliza/v2/ai-agents",
  //   { name: data1.name, config: JSON.stringify(data1), projectId: PROJECT_ID },
  //   {
  //     headers: {
  //       "X-Api-Key": X_Api_Key,
  //     },
  //   }
  // )) as any;
  return res;
};
