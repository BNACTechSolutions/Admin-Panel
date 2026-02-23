import axios from "axios";

const customAxios = axios.create({
  baseURL: "https://server.aismartexhibits.com/",
});

export default customAxios;