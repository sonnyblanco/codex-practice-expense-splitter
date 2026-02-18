import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [amount, setAmount] = useState<number>(0);
  const [tip, setTip] = useState<number>(0);
  const [people, setPeople] = useState<number>(1);

  const totalWithTip = amount + (amount * tip) / 100;
  const perPerson = people > 0 ? totalWithTip / people : 0;

  useEffect(() => {
    const saved = localStorage.getItem("expenseData");
    if (saved) {
      const parsed = JSON.parse(saved);
      setAmount(parsed.amount);
      setTip(parsed.tip);
      setPeople(parsed.people);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "expenseData",
      JSON.stringify({ amount, tip, people })
    );
  }, [amount, tip, people]);

  return (
    <div className="container">
      <h1>Expense Splitter</h1>

      <label>Bill Amount ($)</label>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
      />

      <label>Tip (%)</label>
      <input
        type="number"
        value={tip}
        onChange={(e) => setTip(Number(e.target.value))}
      />

      <label>Number of People</label>
      <input
        type="number"
        min="1"
        value={people}
        onChange={(e) => setPeople(Number(e.target.value))}
      />

      <div className="result">
        <p>Total with Tip: ${totalWithTip.toFixed(2)}</p>
        <p>Per Person: ${perPerson.toFixed(2)}</p>
      </div>
    </div>
  );
}

export default App;
