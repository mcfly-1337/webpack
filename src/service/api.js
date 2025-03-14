import axios from "axios";

const API_URL = "https://791c32bb2902a4cd.mokky.dev/users";

const api = axios.create({
  baseURL: API_URL,
});

export default api;
