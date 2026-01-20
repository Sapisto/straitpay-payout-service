# straitpay-payout-service

A simplified payout processing service built with TypeScript, demonstrating core fintech backend concepts such as transaction safety, idempotency, audit logging, and retry-safe behavior.

This project uses an in-memory data store to simulate database operations for demonstration and testing purposes.

---

## Features

- **Atomic payout processing flow**
- **Idempotent request handling**
- **Wallet balance validation and debit**
- **Audit logging with before/after state**
- **Retry-safe execution**

---

## Assumptions

- In a real production system, PostgreSQL with ACID transactions would be used.
- In-memory `Map` structures are used here to simulate database tables.
- The focus is on correctness and system design, not infrastructure setup.

---

## Project Structure

```
src/
├── index.ts              
├── services/
│   └── payoutService.ts  
├── models/
│   ├── wallet.ts
│   ├── payout.ts
│   └── auditLog.ts
├── utils/
│   └── db.ts         
```

---

## How to Run

1. Install dependencies  
   ```bash
   npm install
   ```

2. Run the demo  
   ```bash
   npm start
   ```

---

## What Happens When You Run It

- A wallet is initialized with a balance
- A payout request is processed
- Wallet balance is debited once
- Audit logs are created for state changes
- Re-running with the same idempotencyKey returns the same result

---

## Sample Audit Logs

Each significant state change (wallet debit, payout creation, status update, etc.) generates an audit log entry. Example audit logs:


**Note:**  
The payout result and audit logs is printed to the console for demo purpose.
