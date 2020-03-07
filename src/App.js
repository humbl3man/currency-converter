import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const CURRENCIES = {
  USD: "United States Dollar",
  AUD: "Australian Dollar",
  BGN: "Bulgarian Lev",
  BRL: "Brazilian Real",
  CAD: "Canadian Dollar",
  CHF: "Swiss Franc",
  CNY: "Chinese Yuan",
  CZK: "Czech Republic Koruna",
  DKK: "Danish Krone",
  GBP: "British Pound Sterling",
  HKD: "Hong Kong Dollar",
  HRK: "Croatian Kuna",
  HUF: "Hungarian Forint",
  IDR: "Indonesian Rupiah",
  ILS: "Israeli New Sheqel",
  INR: "Indian Rupee",
  JPY: "Japanese Yen",
  KRW: "South Korean Won",
  MXN: "Mexican Peso",
  MYR: "Malaysian Ringgit",
  NOK: "Norwegian Krone",
  NZD: "New Zealand Dollar",
  PHP: "Philippine Peso",
  PLN: "Polish Zloty",
  RON: "Romanian Leu",
  RUB: "Russian Ruble",
  SEK: "Swedish Krona",
  SGD: "Singapore Dollar",
  THB: "Thai Baht",
  TRY: "Turkish Lira",
  ZAR: "South African Rand",
  EUR: "Euro"
};

const rates = {};
const currencies = Object.entries(CURRENCIES);

async function fetchRates(base = "USD") {
  const corsEndpoint = "https://cors-anywhere.herokuapp.com";
  const endpoint = `${corsEndpoint}/https://api.exchangeratesapi.io/latest`;
  const response = await axios.get(`${endpoint}?base=${base}`);
  const { data } = response;
  return data;
}

async function convert(amount, from, to) {
  if (!rates[from]) {
    console.log(`no rate is available for ${from}. Fetching...`);
    const newBaseRate = await fetchRates(from);
    rates[from] = newBaseRate;
  }

  return amount * rates[from].rates[to];
}

function App() {
  const [fromSelect, setFromSelect] = useState("USD");
  const [toSelect, setToSelect] = useState("EUR");
  const [fromAmount, setFromAmount] = useState(0);
  const [result, setResult] = useState(0);

  function handleFromSelect(e) {
    setFromSelect(e.target.value);
  }
  function handleToSelect(e) {
    setToSelect(e.target.value);
  }
  function handleAmountChange(e) {
    setFromAmount(e.target.value);
  }

  useEffect(() => {
    convert(fromAmount, fromSelect, toSelect).then(result => {
      setResult(result);
    });
  }, [fromSelect, toSelect, fromAmount]);

  return (
    <div className="container bg-black">
      <h1>Currency Converter (USD)</h1>
      <form
        onSubmit={async e => {
          e.preventDefault();
          await convert(100, "USD", "CAD");
        }}
      >
        <input
          value={fromAmount}
          onChange={handleAmountChange}
          placeholder={`Enter ${fromSelect} value`}
          type="text"
        />
        <label>From</label>
        <select defaultValue={fromSelect} onChange={handleFromSelect}>
          {currencies.map(([code, label]) => {
            return (
              <option value={code} key={code}>
                {label}
              </option>
            );
          })}
        </select>
        <label>To</label>
        <select defaultValue={toSelect} onChange={handleToSelect}>
          {currencies.map(([code, label]) => {
            return (
              <option value={code} key={code}>
                {label}
              </option>
            );
          })}
        </select>
        <p>Result: {result}</p>
      </form>
    </div>
  );
}

export default App;
