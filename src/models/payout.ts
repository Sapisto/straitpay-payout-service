export type Payout = {
  id: string; 
  merchantId: string;
  amount: number;
  currency: 'NGN' | 'USD';
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  idempotencyKey: string;
  failureReason?: string;
  createdAt: Date;
  updatedAt: Date;
};
