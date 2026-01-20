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
   npx ts-node src/index.ts
   ```

---

## What Happens When You Run It

- A wallet is initialized with a balance
- A payout request is processed
- Wallet balance is debited once
- Audit logs are created for state changes
- Re-running with the same idempotencyKey returns the same result

---

## Sample Payout Result

When a payout request is processed, the response will look like:

```json
{
  "payoutId": "e2b2ecfb-f205-4d5d-bca9-674f8cebc0fc",
  "status": "SUCCESS"
}
```

- `payoutId`: The unique identifier for the payout.
- `status`: The result of the payout (`SUCCESS`, `FAILED`, or `PENDING`).

---

## Sample Audit Logs

Each significant state change (wallet debit, payout creation, status update, etc.) generates an audit log entry. Example audit logs:

```json
[
  {
    "id": "0fd3d3a7-2637-47d3-bb3b-2e5f6c34f471",
    "entityType": "WALLET",
    "entityId": "w1",
    "action": "DEBIT",
    "old_state": {
      "balance": 1000
    },
    "new_state": {
      "balance": 800
    },
    "createdAt": "2026-01-20T14:20:34.837Z"
  },
  {
    "id": "fc131791-e752-419c-8cdc-189ce821b872",
    "entityType": "PAYOUT",
    "entityId": "e2b2ecfb-f205-4d5d-bca9-674f8cebc0fc",
    "action": "CREATED",
    "old_state": {},
    "new_state": {
      "id": "e2b2ecfb-f205-4d5d-bca9-674f8cebc0fc",
      "merchantId": "merchant1",
      "amount": 200,
      "currency": "NGN",
      "status": "SUCCESS",
      "idempotencyKey": "abc123",
      "createdAt": "2026-01-20T14:20:34.837Z",
      "updatedAt": "2026-01-20T14:20:34.837Z"
    },
    "createdAt": "2026-01-20T14:20:34.837Z"
  },
  {
    "id": "1971bbb8-add3-48ee-af87-d489ed210820",
    "entityType": "PAYOUT",
    "entityId": "e2b2ecfb-f205-4d5d-bca9-674f8cebc0fc",
    "action": "SUCCESS",
    "old_state": {
      "status": "PENDING"
    },
    "new_state": {
      "status": "SUCCESS"
    },
    "createdAt": "2026-01-20T14:20:34.837Z"
  }
]
```

MIT