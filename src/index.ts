import { wallets, auditLogs } from './utils/db';
import { PayoutService } from './services/payoutService';

wallets.set('merchant1_NGN', {
  id: 'w1',
  merchantId: 'merchant1',
  currency: 'NGN',
  balance: 1000,
  createdAt: new Date(),
  updatedAt: new Date(),
});

const service = new PayoutService();

(async () => {
  const result1 = await service.processPayout({
    merchantId: 'merchant1',
    amount: 200,
    currency: 'NGN',
    idempotencyKey: 'abc123',
  });

  // const result2 = await service.processPayout({
  //   merchantId: 'merchant1',
  //   amount: 200,
  //   currency: 'NGN',
  //   idempotencyKey: 'abc123',
  // });

  console.log('\x1b[36m%s\x1b[0m', 'Payout Results:'); 
  console.log('\x1b[32m%s\x1b[0m', JSON.stringify([result1,], null, 2)); 

  console.log('\x1b[36m%s\x1b[0m', '\nAudit Logs:'); 
  console.log('\x1b[33m%s\x1b[0m', JSON.stringify(auditLogs, null, 2)); 
})();
