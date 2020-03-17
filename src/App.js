import React, { useState, useEffect, useRef, useCallback } from "react";
import { CURRENCIES } from "./data/currencies";
import { fetchRates } from "./api";

import "./App.css";

const currencies = Object.entries(CURRENCIES);

const renderCurrencyOption = ([code, label]) => {
  return (
    <option value={code} key={code}>
      {label}
    </option>
  );
};

function App() {
  const [currency, setCurrency] = useState({
    from: "USD",
    to: "EUR"
  });
  const [fromAmount, setFromAmount] = useState("");
  const [result, setResult] = useState(0);
  const inputRef = useRef(null);
  const rates = useRef({});

  const formatCurrency = useCallback((rawAmount, to) => {
    return Intl.NumberFormat("en-US", {
      style: "currency",
      currency: to
    }).format(rawAmount);
  }, []);
  const convert = useCallback(
    async (amount, from, to) => {
      if (!rates.current[from]) {
        console.log(`no rate is available for ${from}. Fetching...`);
        const newBaseRate = await fetchRates(from);
        rates.current[from] = newBaseRate;
      }

      const conversionAmount = amount * rates.current[from].rates[to];
      return formatCurrency(conversionAmount, to);
    },
    [formatCurrency, rates]
  );

  const fetchResult = useCallback(async () => {
    const { from, to } = currency;
    const result = await convert(fromAmount, from, to);
    setResult(result);
  }, [fromAmount, currency, convert]);

  function handleCurrencySelect(e) {
    const { name, value } = e.target;
    setCurrency({
      ...currency,
      [name]: value
    });
  }

  function handleAmountChange(e) {
    setFromAmount(e.target.value);
  }

  useEffect(() => {
    const { from, to } = currency;
    fetchResult();
    document.title = `Currency Converter (${from} - ${to})`;
  }, [currency, fetchResult]);

  return (
    <div className="p-2 mx-auto mt-5 max-w-xl">
      <h1 className="text-2xl text-center mb-3">Currency Converter</h1>
      <form
        onSubmit={async e => {
          e.preventDefault();
        }}
      >
        <div className="mb-3">
          <label className="cursor-pointer mb-1 block" htmlFor="convertAmount">
            Amount
          </label>
          <input
            id="convertAmount"
            ref={inputRef}
            value={fromAmount}
            onChange={handleAmountChange}
            placeholder={`Enter ${currency.from} value`}
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
                name="from"
                value={currency.from}
                onChange={handleCurrencySelect}
                className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              >
                {currencies.map(renderCurrencyOption)}
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
                name="to"
                value={currency.to}
                onChange={handleCurrencySelect}
                className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              >
                {currencies.map(renderCurrencyOption)}
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

        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={() => {
              setFromAmount("");
              setCurrency({
                from: "USD",
                to: "EUR"
              });

              inputRef.current.focus();
            }}
            className="bg-red-500 hover:bg-red-400 text-white font-bold py-1 px-4 rounded"
          >
            Reset
          </button>
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
