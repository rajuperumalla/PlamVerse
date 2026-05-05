import axios from "axios";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";

const baseURL =
  (Constants.expoConfig?.extra?.apiBaseUrl as string) ??
  "https://api.palmverse.example.com";

export const api = axios.create({ baseURL, timeout: 20000 });

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("jwt").catch(() => null);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err.response?.status === 401) {
      SecureStore.deleteItemAsync("jwt").catch(() => {});
    }
    return Promise.reject(err);
  }
);

export async function createOrder(payload: {
  category: string;
  amount: number;
  currency: string;
}) {
  const { data } = await api.post("/orders", payload);
  return data as { orderId: string; razorpayOrderId?: string; clientSecret?: string };
}

export async function submitReading(payload: {
  orderId: string;
  profile: unknown;
  hand: string;
  imageUrls: string[];
}) {
  const { data } = await api.post("/readings", payload);
  return data as { reportId: string };
}

export async function getReportStatus(reportId: string) {
  const { data } = await api.get(`/readings/${reportId}`);
  return data;
}
