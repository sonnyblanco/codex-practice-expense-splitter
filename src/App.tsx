import { useEffect, useMemo, useState } from "react";
import "./App.css";

type SavedData = { amount: number; tip: number; people: number };

const STORAGE_KEY = "expenseData";

function clampNumber(value: number, min: number) {
  return Number.isFinite(value) ? Math.max(min, value) : min;
}

export default function App() {
  const [amount, setAmount] = useState<number>(0);
  const [tip, setTip] = useState<number>(0);
  const [people, setPeople] = useState<number>(1);

  // Load
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    try {
      const parsed = JSON.parse(saved) as Partial<SavedData>;
      setAmount(clampNumber(Number(parsed.amount ?? 0), 0));
      setTip(clampNumber(Number(parsed.tip ?? 0), 0));
      setPeople(clampNumber(Number(parsed.people ?? 1), 1));
    } catch {
      // ignore invalid saved data
    }
  }, []);

  // Save
  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ amount, tip, people } satisfies SavedData)
    );
  }, [amount, tip, people]);

  const totalWithTip = useMemo(() => amount + (amount * tip) / 100, [amount, tip]);
  const perPerson = useMemo(() => (people > 0 ? totalWithTip / people : 0), [people, totalWithTip]);

  const reset = () => {
    setAmount(0);
    setTip(0);
    setPeople(1);
    localStorage.removeItem(STORAGE_KEY);
  };

  const tipPresets = [0, 5, 10, 15] as const;

  return (
    <div className="container">
      <div className="header">
        <h1>Expense Splitter (Feature Branch Test)</h1>
        <button className="btn secondary" onClick={reset} type="button">
          Reset
        </button>
      </div>

      <label>Bill Amount ($)</label>
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
        <p>Total with Tip: ${totalWithTip.toFixed(2)}</p>
        <p>Per Person: ${perPerson.toFixed(2)}</p>
      </div>
    </div>
  );
}
