import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AppState, User, Wallet, Transaction, PaymentMethod } from '../models';

const mockTransactions: Transaction[] = [
  {
    id: 't1',
    walletId: 'w1',
    type: 'credit',
    method: 'receive',
    amount: 1500,
    currency: 'USD',
    status: 'success',
    description: 'Payment from Alex Johnson',
    counterparty: 'Alex Johnson',
    counterpartyId: '+1-555-0101',
    createdAt: new Date(Date.now() - 3600000),
    reference: 'TXN2024001',
  },
  {
    id: 't2',
    walletId: 'w1',
    type: 'debit',
    method: 'send',
    amount: 250,
    currency: 'USD',
    status: 'success',
    description: 'Sent to Maria Garcia',
    counterparty: 'Maria Garcia',
    counterpartyId: '+1-555-0102',
    createdAt: new Date(Date.now() - 86400000),
    reference: 'TXN2024002',
  },
  {
    id: 't3',
    walletId: 'w1',
    type: 'credit',
    method: 'add',
    amount: 5000,
    currency: 'USD',
    status: 'success',
    description: 'Added via Visa card',
    createdAt: new Date(Date.now() - 172800000),
    reference: 'TXN2024003',
  },
  {
    id: 't4',
    walletId: 'w1',
    type: 'debit',
    method: 'pay',
    amount: 89.99,
    currency: 'USD',
    status: 'success',
    description: 'Scan & Pay - Coffee Shop',
    counterparty: 'Blue Bottle Coffee',
    createdAt: new Date(Date.now() - 259200000),
    reference: 'TXN2024004',
  },
  {
    id: 't5',
    walletId: 'w1',
    type: 'debit',
    method: 'send',
    amount: 320,
    currency: 'USD',
    status: 'pending',
    description: 'Sent to James Wilson',
    counterparty: 'James Wilson',
    counterpartyId: '+1-555-0103',
    createdAt: new Date(Date.now() - 345600000),
    reference: 'TXN2024005',
  },
];

const mockPaymentMethods: PaymentMethod[] = [
  { id: 'pm1', type: 'card', name: 'Visa Debit', last4: '4242', isDefault: true },
  { id: 'pm2', type: 'card', name: 'Mastercard', last4: '8899', isDefault: false },
  { id: 'pm3', type: 'bank', name: 'Chase Bank', bankName: 'Chase', isDefault: false },
];

interface AppContextType extends AppState {
  login: (phone: string) => void;
  logout: () => void;
  createWallet: (pin: string) => void;
  addMoney: (amount: number, methodId: string) => void;
  sendMoney: (recipientId: string, amount: number, pin: string) => boolean;
  getTransactions: () => Transaction[];
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    isAuthenticated: false,
    hasWallet: false,
    user: null,
    wallet: null,
    transactions: mockTransactions,
    paymentMethods: mockPaymentMethods,
  });

  const login = (phone: string) => {
    const user: User = {
      id: 'u1',
      name: 'Jordan Mitchell',
      email: 'jordan@example.com',
      phone,
      walletId: 'w1',
      createdAt: new Date(),
    };
    setState(prev => ({ ...prev, isAuthenticated: true, user }));
  };

  const logout = () => {
    setState({
      isAuthenticated: false,
      hasWallet: false,
      user: null,
      wallet: null,
      transactions: mockTransactions,
      paymentMethods: mockPaymentMethods,
    });
  };

  const createWallet = (pin: string) => {
    const wallet: Wallet = {
      id: 'w1',
      userId: state.user?.id || 'u1',
      balance: 6410.01,
      currency: 'USD',
      pin,
      isLocked: false,
      createdAt: new Date(),
    };
    setState(prev => ({ ...prev, hasWallet: true, wallet }));
  };

  const addMoney = (amount: number, methodId: string) => {
    const method = state.paymentMethods.find(m => m.id === methodId);
    const newTx: Transaction = {
      id: `t${Date.now()}`,
      walletId: 'w1',
      type: 'credit',
      method: 'add',
      amount,
      currency: 'USD',
      status: 'success',
      description: `Added via ${method?.name || 'Payment Method'}`,
      createdAt: new Date(),
      reference: `TXN${Date.now()}`,
    };
    setState(prev => ({
      ...prev,
      wallet: prev.wallet ? { ...prev.wallet, balance: prev.wallet.balance + amount } : null,
      transactions: [newTx, ...prev.transactions],
    }));
  };

  const sendMoney = (recipientId: string, amount: number, pin: string): boolean => {
    if (pin !== state.wallet?.pin) return false;
    if ((state.wallet?.balance || 0) < amount) return false;
    const newTx: Transaction = {
      id: `t${Date.now()}`,
      walletId: 'w1',
      type: 'debit',
      method: 'send',
      amount,
      currency: 'USD',
      status: 'success',
      description: `Sent to ${recipientId}`,
      counterparty: recipientId,
      counterpartyId: recipientId,
      createdAt: new Date(),
      reference: `TXN${Date.now()}`,
    };
    setState(prev => ({
      ...prev,
      wallet: prev.wallet ? { ...prev.wallet, balance: prev.wallet.balance - amount } : null,
      transactions: [newTx, ...prev.transactions],
    }));
    return true;
  };

  const getTransactions = () => state.transactions;

  return (
    <AppContext.Provider value={{ ...state, login, logout, createWallet, addMoney, sendMoney, getTransactions }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
