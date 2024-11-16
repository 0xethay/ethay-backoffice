export interface Task {
  id: string;
  productName: string;
  transactionHash: string;
  addressBuyer: string;
  addressSeller: string;
  amount: string;
  timestamp: string;
  state: 'Disputed' | 'Completed';
}
