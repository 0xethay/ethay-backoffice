import React, { useContext } from 'react'
import { Task } from '@/types/Task'
import { useState } from 'react'
import { ContractContext } from '@/context/ContratContext'
import { ethers } from 'ethers'

interface OngoingCasesStageProps {
  tasks: any[]
  onTaskClick: (task: any) => void
}

export const OngoingCasesStage: React.FC<OngoingCasesStageProps> = ({ tasks, onTaskClick }) => {
  const ongoingTasks = tasks.filter((task) => task.isDisputed === true)
  const {sendTxResolveDispute} = useContext(ContractContext)
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Ongoing Cases</h2>
      {ongoingTasks.length === 0 ? (
        <p>No ongoing cases at the moment.</p>
      ) : (
        <ul className="space-y-4">
          {ongoingTasks.map(task => {
            const [sliderValue, setSliderValue] = useState(50);
            const totalAmount = Number(task.totalPrice) / 10**18;
            const sellerAmount = (totalAmount * sliderValue / 100).toFixed(2);
            const buyerAmount = (totalAmount * (100 - sliderValue) / 100).toFixed(2);

            return (
              <li
                key={task.id}
                className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold text-lg mb-2">
                  {task.product.name + ' - ' + task.product.id}
                </h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p>
                    <span className="font-medium">Purchase ID:</span> {task.id}
                  </p>
                  <p>
                    <span className="font-medium">Amount:</span>{' '}
                    {Number(task.totalPrice) / 10 ** 18} USDT
                  </p>
                  <p>
                    <span className="font-medium">PurchaseTime:</span>{' '}
                    {new Date(
                      Number(task.purchaseTime) * 1000
                    ).toLocaleString()}
                  </p>
                  <p>
                    <span className="font-medium">Buyer :</span>{' '}
                    <a
                      href={`https://base-sepolia.blockscout.com/address/${task.buyer.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >{`${task.buyer.id.slice(0, 6)}...${task.buyer.id.slice(
                      -4
                    )}`}</a>
                  </p>
                  <p>
                    <span className="font-medium">Seller :</span>{' '}
                    <a
                      href={`https://base-sepolia.blockscout.com/address/${task.product.seller.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >{`${task.product.seller.id.slice(
                      0,
                      6
                    )}...${task.product.seller.id.slice(-4)}`}</a>
                  </p>
                  <p>
                    <span className="font-medium">Tx :</span>{' '}
                    <a
                      href={`https://base-sepolia.blockscout.com/tx/${task.transactions[0].id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >{`${task.transactions[0].id.slice(
                      0,
                      6
                    )}...${task.transactions[0].id.slice(-4)}`}</a>
                  </p>
                  <p>
                    <span className="font-medium">Status:</span>{' '}
                    <span className="text-yellow-600">In Progress</span>
                  </p>
                </div>

                <div className="mt-4">
                  <p className="font-medium mb-2">Fund Distribution</p>
                  <div className="relative pt-1">
                    <div className="flex justify-between text-xs">
                      <span>Buyer Refund</span>
                      <span>Seller Refund</span>
                    </div>
                    <input
                      type="range"
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      min="0"
                      max="100"
                      value={sliderValue}
                      onChange={(e) => setSliderValue(Number(e.target.value))}
                    />
                    <div className="flex justify-between text-xs mt-1">
                      <span>{buyerAmount} USDT</span>
                      <span>{sellerAmount} USDT</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const [taskId, purchaseId] = task.id.split('-');
                    const buyerAmount = (totalAmount * (100 - sliderValue) / 100).toFixed(2);
                    sendTxResolveDispute(taskId, purchaseId, ethers.parseUnits(buyerAmount, 18).toString())
                  }}
                  className="mt-3 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                  Resolve Dispute
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
