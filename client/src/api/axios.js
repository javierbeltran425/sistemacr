import axios from "axios";
import { cleanEnv, url } from "envalid";

const serverUrl = cleanEnv(process.env, {
  REACT_APP_SERVER_URL: url(),
}).REACT_APP_SERVER_URL;

export default axios.create({
  baseURL: serverUrl,
});

export const axiosPrivate = axios.create({
  baseURL: serverUrl,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
