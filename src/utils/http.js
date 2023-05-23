import axios from "axios";
import { BearerTokenUserLP, BearerTokenCMS } from "../configs/api";
import ENV from "../configs/env";

export const httpCMS = axios.create({
  baseURL: ENV.hostCMS,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

httpCMS.interceptors.request.use(async config => {
  const token = BearerTokenCMS();
  config.headers.Authorization = token;
  return config;
}, error => {
  return Promise.reject(error);
});


export const httpLP = axios.create({
  baseURL: ENV.hostLP,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

httpLP.interceptors.request.use(async config => {
  const token = BearerTokenUserLP();
  config.headers.Authorization = token;
  return config;
}, error => {
  return Promise.reject(error);
});

