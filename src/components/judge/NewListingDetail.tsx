import React, { useState } from 'react'
import { Task } from '@/types/Task'
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/Button"

interface NewListingDetailProps {
  task: Task
  onBack: () => void
}

export const NewListingDetail: React.FC<NewListingDetailProps> = ({ task, onBack }) => {
  const [attestationAmount, setAttestationAmount] = useState([50])
  const [reason, setReason] = useState('')

  const handleSubmit = () => {
    console.log('Submitted:', { attestationAmount: attestationAmount[0], reason })
    // Here you would typically send this data to your backend
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
        <p><span className="font-medium">Status:</span> <span className="text-red-600">Disputed</span></p>
      </div>
      
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Dispute Resolution</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Distribute Attestation Amount</label>
          <Slider
            value={attestationAmount}
            onValueChange={setAttestationAmount}
            max={100}
            step={1}
            className="mt-2"
          />
          <div className="flex justify-between text-sm mt-1">
            <span>In Favor of Client: {attestationAmount[0]}%</span>
            <span>In Favor of Freelancer: {100 - attestationAmount[0]}%</span>
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Provide Reason For Your Decision</label>
          <Input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="After reviewing the case, I believe..."
            className="mt-2"
          />
        </div>
        <Button onClick={handleSubmit} className="w-full">Submit Decision</Button>
      </div>
      
      <button 
        onClick={onBack}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
      >
        Back to New Listings
      </button>
    </div>
  )
}
