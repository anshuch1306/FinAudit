
import { useState } from "react";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");

  function handleFileUpload(event) {
    const uploadedFile = event.target.files[0];

    if (!uploadedFile) return;

    setFile(uploadedFile);
    setTransactions([]);
    setError("");

    const reader = new FileReader();

    reader.onload = (e) => {
      const text = e.target.result;

      if (!text.trim()) {
        setError("The uploaded CSV file is empty.");
        return;
      }

      const lines = text.trim().split(/\r?\n/);

      if (lines.length < 2) {
        setError("CSV must contain a header and at least one transaction.");
        return;
      }

      const headers = lines[0]
        .split(",")
        .map((header) => header.trim().toLowerCase());

      const dateIndex = headers.indexOf("date");
      const descriptionIndex = headers.indexOf("description");
      const amountIndex = headers.indexOf("amount");

      if (
        dateIndex === -1 ||
        descriptionIndex === -1 ||
        amountIndex === -1
      ) {
        setError("CSV must contain Date, Description, and Amount columns.");
        return;
      }

      const seen = new Set();

      const rows = lines.slice(1).map((line, index) => {
        const columns = line.split(",").map((value) => value.trim());

        const date = columns[dateIndex] || "";
        const description = columns[descriptionIndex] || "";
        const amountText = columns[amountIndex] || "";
        const amount = Number(amountText);

        const key = line.trim().toLowerCase();
        const duplicate = seen.has(key);

        seen.add(key);

        const issues = [];

        if (!date || !description || !amountText) {
          issues.push("Missing field");
        }

        if (amountText && !Number.isFinite(amount)) {
          issues.push("Invalid amount");
        }

        if (duplicate) {
          issues.push("Duplicate row");
        }

        return {
          id: index + 1,
          date,
          description,
          amount: amountText,
          issues,
        };
      });

      setTransactions(rows);
    };

    reader.onerror = () => {
      setError("Unable to read this file. Please try another CSV.");
    };

    reader.readAsText(uploadedFile);
  }

  const flagged = transactions.filter(
    (transaction) => transaction.issues.length > 0
  );


  function downloadReport() {
    if (flagged.length === 0) {
      alert("No flagged transactions to download.");
      return;
    }

    const header = ["Row", "Date", "Description", "Amount", "Issues"];

    const escapeCSV = (value) =>
      `"${String(value).replace(/"/g, '""')}"`;

    const rows = flagged.map((transaction) => [
      transaction.id,
      transaction.date,
      transaction.description,
      transaction.amount,
      transaction.issues.join("; "),
    ]);

    const csv = [header, ...rows]
      .map((row) => row.map(escapeCSV).join(","))
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "finaudit-flagged-transactions.csv";
    link.click();

    URL.revokeObjectURL(url);
  }


  return (
    <main className="container">
      <header>
        <p className="eyebrow">FINANCIAL DATA VALIDATION</p>
        <h1>FinAudit</h1>
        <p>Find transaction errors before they become bigger problems.</p>
      </header>

      <section className="upload-card">
        <h2>Upload Transactions</h2>
        <p>Upload a CSV file containing Date, Description, and Amount.</p>

        <input
          type="file"
          accept=".csv,text/csv"
          onChange={handleFileUpload}
        />

        {file && <p>Selected file: {file.name}</p>}

        {error && <p className="error-message">{error}</p>}
      </section>

      {transactions.length > 0 && (
        <>
          <section className="stats">
            <article>
              <span>Total Transactions</span>
              <strong>{transactions.length}</strong>
            </article>

            <article>
              <span>Valid Transactions</span>
              <strong>{transactions.length - flagged.length}</strong>
            </article>

            <article>
              <span>Flagged Transactions</span>
              <strong>{flagged.length}</strong>
            </article>
          </section>

          <section className="table-card">
            <h2>Audit Results</h2>
            <button onClick={downloadReport}>
              Download Flagged Report
            </button>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Row</th>
                    <th>Date</th>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td>{transaction.id}</td>
                      <td>{transaction.date || "—"}</td>
                      <td>{transaction.description || "—"}</td>
                      <td>{transaction.amount || "—"}</td>
                      <td>
                        {transaction.issues.length === 0
                          ? "Valid"
                          : transaction.issues.join(", ")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </main>
  );
}

export default App;
