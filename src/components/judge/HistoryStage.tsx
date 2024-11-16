import React from 'react'
import { Task } from '@/types/Task'

interface HistoryStageProps {
  tasks: any[]
  onTaskClick: (task: any) => void
}

export const HistoryStage: React.FC<HistoryStageProps> = ({ tasks, onTaskClick }) => {
   const completedTasks = tasks.filter((task) => task.isDisputed === false)

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">History</h2>
      {completedTasks.length === 0 ? (
        <p>No completed cases in the history.</p>
      ) : (
      <ul className="space-y-4">
          {completedTasks.map(task => (
            <li key={task.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-lg mb-2">{task.product.name + ' - ' + task.product.id}</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p><span className="font-medium">Purchase ID:</span> {task.id}</p>
                <p><span className="font-medium">Amount:</span> {Number(task.totalPrice) / 10**18} USDT</p>
                <p><span className="font-medium">PurchaseTime:</span> {new Date(Number(task.purchaseTime) * 1000).toLocaleString()}</p>
                <p><span className="font-medium">Buyer :</span> <a href={`https://base-sepolia.blockscout.com/address/${task.buyer.id}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{`${task.buyer.id.slice(0,6)}...${task.buyer.id.slice(-4)}`}</a></p>
                <p><span className="font-medium">Seller :</span> <a href={`https://base-sepolia.blockscout.com/address/${task.product.seller.id}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{`${task.product.seller.id.slice(0,6)}...${task.product.seller.id.slice(-4)}`}</a></p>
                <p><span className="font-medium">Tx :</span> <a href={`https://base-sepolia.blockscout.com/tx/${task.transactions[0].id}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{`${task.transactions[0].id.slice(0,6)}...${task.transactions[0].id.slice(-4)}`}</a></p>
                <p><span className="font-medium">Status:</span> <span className="text-green-600">Completed</span></p>
              </div>
              {/* <button 
                onClick={() => onTaskClick(task)}
                className="mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                View Details
              </button> */}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
