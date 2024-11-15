import React from 'react'
import { Task } from '@/types/Task'

interface OngoingCaseDetailProps {
  task: Task
  onBack: () => void
}

export const OngoingCaseDetail: React.FC<OngoingCaseDetailProps> = ({ task, onBack }) => {
  // Mock data for demonstration purposes
  const totalJudges = 3
  const judgesVoted = 2
  const yourDecision = {
    attestationAmount: 60,
    reason: "The freelancer has completed most of the work, but there were some delays and quality issues."
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
        <p><span className="font-medium">Status:</span> <span className="text-yellow-600">In Progress</span></p>
      </div>
      
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Case Progress</h2>
        <p>Waiting for other judges to submit their decisions.</p>
        <p className="mt-2">Judges voted: {judgesVoted} / {totalJudges}</p>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Your Decision</h2>
        <p><span className="font-medium">Attestation Amount:</span> {yourDecision.attestationAmount}% in favor of client</p>
        <p><span className="font-medium">Your Reason:</span> {yourDecision.reason}</p>
      </div>
      
      <button 
        onClick={onBack}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
      >
        Back to Ongoing Cases
      </button>
    </div>
  )
}
