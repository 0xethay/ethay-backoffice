export interface Task {
  id: string;
  productName: string;
  transactionHash: string;
  addressBuyer: string;
  addressSeller: string;
  amount: string;
  timestamp: string;
  state: 'Disputed' | 'Completed';
  terms?: string;
  contractAddress?: string;   
  deadline?: string;
  freelancer?: string;
  client?: string;
}
