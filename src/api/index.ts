import axios from "axios";

const customAxios = axios.create({
  baseURL: "http://server.aismartexhibits.com/",
});

export default customAxios;
