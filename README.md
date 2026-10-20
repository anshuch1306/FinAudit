# FinAudit — Transaction Validation Dashboard

FinAudit is a React-based dashboard that validates financial transaction data uploaded through CSV files. It helps identify common data-quality issues and provides a downloadable report of flagged transactions.

## Features

- **CSV Upload:** Upload transaction data using a CSV file.
- **Data Validation:** Detect missing fields, invalid amounts, and duplicate records.
- **Audit Summary:** View total, valid, and flagged transaction counts.
- **Flagged Report Export:** Download flagged transactions and their associated issues as a CSV report.

## Tech Stack

- React
- JavaScript
- CSS
- Vite

## CSV Format

The uploaded CSV file should contain these columns:

| Date | Description | Amount |
|---|---|---:|
| 2026-10-01 | Salary | 50000 |
| 2026-10-02 | Groceries | -1500 |

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/anshuch1306/FinAudit.git
   ```

2. Navigate to the project folder:

   ```bash
   cd FinAudit/frontend
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

## Purpose

This project demonstrates frontend development, CSV file handling, data validation, error reporting, and downloadable report generation.

## Future Improvements

- Add transaction filtering and search.
- Support more validation rules.
- Add charts for transaction summaries.
