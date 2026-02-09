import { toast } from "@/components/Toast";
import { useStore } from "@/stores";
import { imEvent } from "@/utils/ImEvent";
import axios, { AxiosResponse, AxiosRequestConfig } from "axios";

const httpUrl = process.env.REACT_APP_API_URL;
const axioBackEnd = axios.create({
  baseURL: httpUrl,
  headers: {
    "Content-Type": "application/json",
  },
});
axioBackEnd.interceptors.request.use((config) => {
  // const key = localStorage.getItem("Authorization-token");
  const { token } = useStore.getState();
  config.headers["sid"] = token;
  return config;
});

axioBackEnd.interceptors.response.use((response) => {
  // const key = localStorage.getItem("Authorization-token");
  const { data } = response;
  if (data.status === 0) {
    toast.error(data.msg);
    return Promise.reject(new Error(data.msg || "Error"));
  }
  return response;
});

const handleError = (errorMsg: any) => {
  const { setToken, setUser } = useStore.getState();
  if (errorMsg.status === 401) {
    setToken(null);
    setUser(null);
    imEvent.trigger("logout", false);
    imEvent.trigger("login");
  }
  return new Promise((resolve, reject) => {});
};

const get = async (url: string, options?: any): Promise<any> => {
  return await axioBackEnd
    .get(url, options)
    .then((response) => {
      if (Object.keys(response.data?.extra ?? {}).length > 0) {
        return response.data;
      }
      return response.data.data;
    })
    .catch(handleError);
};

const post = async (
  url: string,
  data: object = {},
  options?: any
): Promise<any> => {
  return await axioBackEnd
    .post(url, wrapData(data), options)
    .then((response) => {
      return response.data.data;
    })
    .catch(handleError);
};

const put = async (
  url: string,
  data: object = {},
  options?: any
): Promise<any> => {
  return await axioBackEnd
    .put(url, wrapData(data), options)
    .then((response) => response.data.data)
    .catch(handleError);
};

const funcDelete = async (url: string, options?: any): Promise<any> => {
  return await axioBackEnd
    .delete(url, options)
    .then((response) => response.data.data)
    .catch(handleError);
};

const stream = async (
  url: string,
  data: object,
  onMessage: (chunk: string) => void,
  options: AxiosRequestConfig = {},
  onComplete: () => void
): Promise<void> => {
  try {
    const response = await axioBackEnd.post(url, wrapData(data), {
      ...options,
      responseType: "stream",
      headers: {
        ...options.headers,
        Accept: "text/event-stream",
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
      onDownloadProgress: (progressEvent) => {
        const chunk = progressEvent.event.target.response;
        if (chunk) {
          onMessage(chunk);
        }
      },
    });
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  } finally {
    // Handle end event here
    onComplete();
  }
};

// remove object property that value is null
export const wrapData = (data: any) => {
  Object.keys(data).forEach((key) => {
    if (data[key] === null) {
      delete data[key];
    }
  });
  return data;
};

export function wrapQueryParams(baseUrl: string, params: object) {
  // If params is empty or undefined, return baseUrl directly
  if (!params || Object.keys(params).length === 0) {
    return baseUrl;
  }

  const queryParams = new URLSearchParams();

  // Only add params that are not null
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      queryParams.append(key, value.toString());
    }
  });

  // If no valid params after filtering nulls, return baseUrl
  if (queryParams.toString() === "") {
    return baseUrl;
  }

  return `${baseUrl}?${queryParams.toString()}`;
}

const { defaults } = axioBackEnd;

export const request = {
  defaults,
  get,
  post,
  put,
  wrapQueryParams,
  wrapData,
  stream,
  delete: funcDelete,
};
