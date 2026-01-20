export type PayoutAttempt = {
  id: string;
  payoutId: string;
  attemptNumber: number;
  status: 'SUCCESS' | 'FAILED' | 'TIMEOUT';
  error?: string;
  createdAt: Date;
};
