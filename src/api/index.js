import axios from "axios";

async function fetchRates(base = "USD") {
  const corsEndpoint = "https://cors-anywhere.herokuapp.com";
  const endpoint = `${corsEndpoint}/https://api.exchangeratesapi.io/latest`;
  const response = await axios.get(`${endpoint}?base=${base}`);
  const { data } = response;
  return data;
}

export { fetchRates };
