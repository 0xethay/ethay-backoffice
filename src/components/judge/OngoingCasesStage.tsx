import React from 'react'
import { Task } from '@/types/Task'

interface OngoingCasesStageProps {
  tasks: any[]
  onTaskClick: (task: any) => void
}

export const OngoingCasesStage: React.FC<OngoingCasesStageProps> = ({ tasks, onTaskClick }) => {
  const ongoingTasks = tasks.filter((task) => task.isDisputed === true)

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Ongoing Cases</h2>
      {ongoingTasks.length === 0 ? (
        <p>No ongoing cases at the moment.</p>
      ) : (
        <ul className="space-y-4">
          {ongoingTasks.map(task => (
            <li key={task.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-lg mb-2">{task.product.name + ' - ' + task.product.id}</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                 <p><span className="font-medium">Purchase ID:</span> {task.id}</p>
                <p><span className="font-medium">Amount:</span> {Number(task.totalPrice) / 10**18} USDT</p>
                <p><span className="font-medium">PurchaseTime:</span> {new Date(Number(task.purchaseTime) * 1000).toLocaleString()}</p>
                <p><span className="font-medium">Buyer :</span> <a href={`https://base-sepolia.blockscout.com/address/${task.buyer.id}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{`${task.buyer.id.slice(0,6)}...${task.buyer.id.slice(-4)}`}</a></p>
                <p><span className="font-medium">Seller :</span> <a href={`https://base-sepolia.blockscout.com/address/${task.product.seller.id}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{`${task.product.seller.id.slice(0,6)}...${task.product.seller.id.slice(-4)}`}</a></p>
                <p><span className="font-medium">Tx :</span> <a href={`https://base-sepolia.blockscout.com/tx/${task.transactions[0].id}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{`${task.transactions[0].id.slice(0,6)}...${task.transactions[0].id.slice(-4)}`}</a></p>
                <p><span className="font-medium">Status:</span> <span className="text-yellow-600">In Progress</span></p>
              </div>
              <button 
                onClick={() => onTaskClick(task)}
                className="mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                View Details
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
