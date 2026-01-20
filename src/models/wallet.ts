export type Wallet = {
  id: string; 
  merchantId: string;
  currency: 'NGN' | 'USD';
  balance: number;
  createdAt: Date;
  updatedAt: Date;
};
