import axios from "axios";

const customAxios = axios.create({
  baseURL: "https://backend.aismartexhibits.com/",
});

export default customAxios;