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
  const [fromAmount, setFromAmount] = useState("");
  const [result, setResult] = useState("");

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
    <div className="p-2 mx-auto mt-5 max-w-xl">
      <h1 className="text-2xl mb-3">Currency Converter</h1>
      <form
        onSubmit={async e => {
          e.preventDefault();
          await convert(100, "USD", "CAD");
        }}
      >
        <div className="mb-3">
          <label className="cursor-pointer mb-1 block" htmlFor="convertAmount">
            Amount
          </label>
          <input
            id="convertAmount"
            value={fromAmount}
            onChange={handleAmountChange}
            placeholder={`Enter ${fromSelect} value`}
            className="bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-lg py-2 px-4 block w-full appearance-none leading-normal"
            type="number"
          />
        </div>

        <div className="flex items-center">
          <div className="flex-grow mr-2">
            <label htmlFor="from" className="cursor-pointer mb-1 block">
              From
            </label>
            <div className="relative">
              <select
                id="from"
                defaultValue={fromSelect}
                onChange={handleFromSelect}
                className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              >
                {currencies.map(([code, label]) => {
                  return (
                    <option value={code} key={code}>
                      {label}
                    </option>
                  );
                })}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="flex-grow">
            <label htmlFor="to" className="cursor-pointer mb-1 block">
              To:
            </label>
            <div className="relative">
              <select
                id="to"
                defaultValue={toSelect}
                onChange={handleToSelect}
                className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              >
                {currencies.map(([code, label]) => {
                  return (
                    <option value={code} key={code}>
                      {label}
                    </option>
                  );
                })}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 py-5 border-t border-gray-300">
          <p>
            <strong>Result:</strong> {result}
          </p>
        </div>
      </form>
    </div>
  );
}

export default App;
