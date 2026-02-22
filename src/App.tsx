import { useEffect, useMemo, useState } from "react";
import "./App.css";

type CurrencyCode = "AUD" | "USD" | "PHP";
type SavedData = { amount: number; tip: number; people: number; currency: CurrencyCode };

const STORAGE_KEY = "expenseData";

function clampNumber(value: number, min: number) {
  return Number.isFinite(value) ? Math.max(min, value) : min;
}

function formatMoney(value: number, currency: CurrencyCode) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    currencyDisplay: "symbol",
    maximumFractionDigits: 2,
  }).format(value);
}

export default function App() {
  const [amount, setAmount] = useState<number>(0);
  const [tip, setTip] = useState<number>(0);
  const [people, setPeople] = useState<number>(1);
  const [currency, setCurrency] = useState<CurrencyCode>("AUD");

  // Load
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved) as Partial<SavedData>;
      setAmount(clampNumber(Number(parsed.amount ?? 0), 0));
      setTip(clampNumber(Number(parsed.tip ?? 0), 0));
      setPeople(clampNumber(Number(parsed.people ?? 1), 1));
      setCurrency((parsed.currency as CurrencyCode) ?? "AUD");
    } catch {
      // ignore invalid saved data
    }
  }, []);

  // Save
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ amount, tip, people, currency } satisfies SavedData)
    );
  }, [amount, tip, people, currency]);

  const totalWithTip = useMemo(() => amount + (amount * tip) / 100, [amount, tip]);
  const perPerson = useMemo(() => (people > 0 ? totalWithTip / people : 0), [people, totalWithTip]);

  const reset = () => {
    setAmount(0);
    setTip(0);
    setPeople(1);
    setCurrency("AUD");
    localStorage.removeItem(STORAGE_KEY);
  };

  const tipPresets = [0, 5, 10, 15] as const;

  return (
    <div className="container">
      <div className="header">
        <h1>Expense Splitter</h1>
        <button className="btn secondary" onClick={reset} type="button">
          Reset
        </button>
      </div>

      <label>Currency</label>
      <select
        className="select"
        value={currency}
        onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
      >
        <option value="AUD">AUD</option>
        <option value="USD">USD</option>
        <option value="PHP">PHP</option>
      </select>

      <label>Bill Amount</label>
      <input
        type="number"
        min="0"
        step="0.01"
        value={amount}
        onChange={(e) => setAmount(clampNumber(Number(e.target.value), 0))}
      />

      <div className="row">
        <div style={{ flex: 1 }}>
          <label>Tip (%)</label>
          <input
            type="number"
            min="0"
            step="0.1"
            value={tip}
            onChange={(e) => setTip(clampNumber(Number(e.target.value), 0))}
          />
        </div>

        <div className="presetCol">
          <div className="presetLabel">Quick Tip</div>
          <div className="presetBtns">
            {tipPresets.map((p) => (
              <button key={p} className="btn" type="button" onClick={() => setTip(p)}>
                {p}%
              </button>
            ))}
          </div>
        </div>
      </div>

      <label>Number of People</label>
      <input
        type="number"
        min="1"
        step="1"
        value={people}
        onChange={(e) => setPeople(clampNumber(Number(e.target.value), 1))}
      />

      <div className="result">
        <p>Total with Tip: {formatMoney(totalWithTip, currency)}</p>
        <p>Per Person: {formatMoney(perPerson, currency)}</p>
      </div>
    </div>
  );
}