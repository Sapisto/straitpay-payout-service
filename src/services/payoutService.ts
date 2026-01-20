import { Wallet } from "../models/wallet";
import { Payout } from "../models/payout";
import { AuditLog } from "../models/auditLog";
import { wallets, payouts, auditLogs } from "../utils/db";
import { v4 as uuidv4 } from "uuid";

type PayoutRequest = {
  merchantId: string;
  amount: number;
  currency: "NGN" | "USD";
  idempotencyKey: string;
};

type PayoutResult = {
  payoutId: string;
  status: "SUCCESS" | "FAILED" | "PENDING";
  reason?: string | undefined;
};

export class PayoutService {
  async processPayout(request: PayoutRequest): Promise<PayoutResult> {
    const { merchantId, amount, currency, idempotencyKey } = request;

    for (const payout of payouts.values()) {
      if (
        payout.merchantId === merchantId &&
        payout.idempotencyKey === idempotencyKey
      ) {

        console.log(
          `Idempotency hit: merchant=${merchantId}, key=${idempotencyKey}`,
        );

        auditLogs.push({
          id: uuidv4(),
          entityType: "PAYOUT",
          entityId: payout.id,
          action: "IDEMPOTENCY_HIT",
          old_state: { status: payout.status },
          new_state: {
            status: payout.status,
            note: "Duplicate request prevented",
          },
          createdAt: new Date(),
        });
        
        return {
          payoutId: payout.id,
          status: payout.status,
          reason: payout.failureReason,
        };
      }
    }

    const walletKey = `${merchantId}_${currency}`;
    const wallet = wallets.get(walletKey);
    if (!wallet) throw new Error("Wallet not found");
    if (wallet.balance < amount)
      return { payoutId: "", status: "FAILED", reason: "Insufficient balance" };

    const oldBalance = wallet.balance;
    wallet.balance -= amount;
    wallet.updatedAt = new Date();

    auditLogs.push({
      id: uuidv4(),
      entityType: "WALLET",
      entityId: wallet.id,
      action: "DEBIT",
      old_state: { balance: oldBalance },
      new_state: { balance: wallet.balance },
      createdAt: new Date(),
    });

    const payoutId = uuidv4();
    const payout: Payout = {
      id: payoutId,
      merchantId,
      amount,
      currency,
      status: "PENDING",
      idempotencyKey,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    payouts.set(payoutId, payout);

    auditLogs.push({
      id: uuidv4(),
      entityType: "PAYOUT",
      entityId: payoutId,
      action: "CREATED",
      old_state: {},
      new_state: payout,
      createdAt: new Date(),
    });

    try {
      const success = await this.callBankAPI(payout);
      payout.status = success ? "SUCCESS" : "FAILED";
      payout.updatedAt = new Date();

      console.log(`Payout ${payoutId} completed: ${payout.status}`);

      auditLogs.push({
        id: uuidv4(),
        entityType: "PAYOUT",
        entityId: payoutId,
        action: payout.status,
        old_state: { status: "PENDING" },
        new_state: { status: payout.status },
        createdAt: new Date(),
      });
    } catch (err: any) {
      payout.status = "PENDING";
      payout.updatedAt = new Date();

      console.log(`Payout ${payoutId} pending due to: ${err.message}`);

      auditLogs.push({
        id: uuidv4(),
        entityType: "PAYOUT",
        entityId: payoutId,
        action: "PENDING",
        old_state: { status: "PENDING" },
        new_state: { status: "PENDING", error: err.message },
        createdAt: new Date(),
      });
    }
    return { payoutId, status: payout.status, reason: payout.failureReason };
  }

  private async callBankAPI(payout: Payout): Promise<boolean> {
    // Simulate 80% success rate
    if (Math.random() < 0.8) return true;
    throw new Error("Bank API timeout");
  }
}
