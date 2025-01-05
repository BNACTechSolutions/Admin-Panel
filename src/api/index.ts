import axios from "axios";

const customAxios = axios.create({
  baseURL: "https://ai-exhibit-display.onrender.com/",
});

export default customAxios;
