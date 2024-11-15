import React from 'react'
import { Task } from '@/types/Task'

interface HistoryDetailProps {
  task: Task
  onBack: () => void
}

export const HistoryDetail: React.FC<HistoryDetailProps> = ({ task, onBack }) => {
  // Mock data for demonstration purposes
  const finalDecision = {
    attestationAmount: 70,
    reason: "After careful consideration, the majority of judges agreed that the freelancer completed most of the work satisfactorily, but there were some issues with the final delivery that justified a partial payment to the client."
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mt-4 mb-2">{task.terms}</h1>
      <div className="grid grid-cols-2 gap-4">
        <p><span className="font-medium">Contract:</span> {task.contractAddress}</p>
        <p><span className="font-medium">Amount:</span> {task.amount}</p>
        <p><span className="font-medium">Freelancer:</span> {task.freelancer}</p>
        <p><span className="font-medium">Client:</span> {task.client}</p>
        <p><span className="font-medium">Deadline:</span> {task.deadline}</p>
        <p><span className="font-medium">Status:</span> <span className="text-green-600">Completed</span></p>
      </div>
      
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Final Decision</h2>
        <p><span className="font-medium">Attestation Amount:</span> {finalDecision.attestationAmount}% in favor of client</p>
        <p><span className="font-medium">Reason:</span> {finalDecision.reason}</p>
      </div>
      
      <button 
        onClick={onBack}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
      >
        Back to History
      </button>
    </div>
  )
}
