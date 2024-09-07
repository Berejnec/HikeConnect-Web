import axios, { AxiosError, AxiosResponse } from "axios";
import { Activity } from "../models/activity";
import { User, UserFormValues } from "../models/user";
import { toast } from "react-toastify";
import { store } from "../stores/store";

const sleep = (delay: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
};

axios.defaults.baseURL = "http://localhost:5000/api";

axios.interceptors.request.use((config) => {
  const token = store.commonStore.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axios.interceptors.response.use(
  async (response) => {
    await sleep(50);
    return response;
  },
  (error: AxiosError) => {
    const { data, status, config } = error.response!;
    const navigate = store.userStore.navigate;
    switch (status) {
      case 400:
        if (typeof data === "string") {
          toast.error(data);
        }
        if (config.method === "get" && (data as any).errors.hasOwnProperty("id")) {
          if (navigate) navigate("/not-found");
        }
        if ((data as any).errors) {
          const modalStateErrors = [];
          for (const key in (data as any).errors) {
            if ((data as any).errors[key]) {
              modalStateErrors.push((data as any).errors[key]);
            }
          }
          throw modalStateErrors.flat();
        }
        break;
      case 401:
        toast.error("Unauthorized");
        break;
      case 404:
        if (navigate) navigate("/not-found");
        break;
      case 500:
        store.commonStore.setServerError(data as any);
        if (navigate) navigate("/server-error");
        break;
      default:
        break;
    }

    return Promise.reject(error);
  }
);

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const requests = {
  get: <T>(url: string) => axios.get<T>(url).then(responseBody),
  post: <T>(url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
  put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
  delete: <T>(url: string) => axios.delete<T>(url).then(responseBody),
};

const Activities = {
  list: () => requests.get<Activity[]>("/activities"),
  details: (id: string) => requests.get<Activity | undefined>(`/activities/${id}`),
  create: (activity: Activity) => requests.post<void>("/activities", activity),
  update: (activity: Activity) => requests.put<void>(`/activities/${activity.id}`, activity),
  delete: (id: string) => requests.delete<void>(`/activities/${id}`),
};

const Account = {
  current: () => requests.get<User>("/account"),
  login: (user: UserFormValues) => requests.post<User>("account/login", user),
  register: (user: UserFormValues) => requests.post<User>("account/register", user),
};

const agent = {
  Activities,
  Account,
};

export default agent;
