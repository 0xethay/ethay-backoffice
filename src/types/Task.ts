export interface Task {
  id: string;
  contractAddress: string;
  freelancer: string;
  client: string;
  amount: string;
  terms: string;
  deadline: string;
  state: 'Disputed' | 'InProgress' | 'Completed';
}
