export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  walletId: string;
  avatar?: string;
  createdAt: Date;
}

export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  pin: string;
  isLocked: boolean;
  createdAt: Date;
}

export type TransactionType = 'credit' | 'debit';
export type TransactionStatus = 'success' | 'pending' | 'failed';
export type TransactionMethod = 'send' | 'receive' | 'add' | 'pay';

export interface Transaction {
  id: string;
  walletId: string;
  type: TransactionType;
  method: TransactionMethod;
  amount: number;
  currency: string;
  status: TransactionStatus;
  description: string;
  counterparty?: string;
  counterpartyId?: string;
  createdAt: Date;
  reference: string;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank' | 'upi';
  name: string;
  last4?: string;
  bankName?: string;
  isDefault: boolean;
}

export interface AppState {
  isAuthenticated: boolean;
  hasWallet: boolean;
  user: User | null;
  wallet: Wallet | null;
  transactions: Transaction[];
  paymentMethods: PaymentMethod[];
}
