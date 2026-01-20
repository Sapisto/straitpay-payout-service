export type AuditLog = {
  id: string; 
  entityType: 'WALLET' | 'PAYOUT';
  entityId: string;
  action: string;
  old_state: Record<string, any>;
  new_state: Record<string, any>;
  createdAt: Date;
};
