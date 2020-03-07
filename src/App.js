import React, { useState, useEffect } from "react";
import { CURRENCIES } from "./data/currencies";
import { fetchRates } from "./api";

import "./App.css";

const rates = {};
const currencies = Object.entries(CURRENCIES);

async function convert(amount, from, to) {
  if (!rates[from]) {
    console.log(`no rate is available for ${from}. Fetching...`);
    const newBaseRate = await fetchRates(from);
    rates[from] = newBaseRate;
  }

  return amount * rates[from].rates[to];
}

function formatCurrency(rawAmount, to) {
  return Intl.NumberFormat("en-US", { style: "currency", currency: to }).format(
    rawAmount
  );
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
      setResult(formatCurrency(result, toSelect));
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
