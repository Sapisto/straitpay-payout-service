import { Wallet } from "../models/wallet";
import { Payout } from "../models/payout";
import { AuditLog } from "../models/auditLog";

export const wallets: Map<string, Wallet> = new Map();
export const payouts: Map<string, Payout> = new Map();
export const auditLogs: AuditLog[] = [];



