import axios from "axios";

const API_URL = "http://localhost:5000/api/auth"; // backend sau này

export const login = async (data) => {
  const response = await axios.post(`${API_URL}/login`, data);
  return response.data;
};