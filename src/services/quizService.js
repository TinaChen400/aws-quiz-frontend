import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:8000";

export const getQuestion = async () => {
  const res = await axios.get(`${API_BASE}/quiz/start`);
  return res.data;
};
