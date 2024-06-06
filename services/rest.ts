import axios from "axios";

export const rest = axios.create({
  baseURL: "/api/push",
});
