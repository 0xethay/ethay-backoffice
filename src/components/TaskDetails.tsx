import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Task } from '@/types/Task'

interface TaskDetailsProps {
  task: Task;
  onSubmitAttestation: (amount: number, reason: string) => void;
}

export function TaskDetails({ task, onSubmitAttestation }: TaskDetailsProps) {
  const [attestationAmount, setAttestationAmount] = useState([70])
  const [reason, setReason] = useState('')

  const handleSubmit = () => {
    onSubmitAttestation(attestationAmount[0], reason)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-100 p-8"
    >
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Freelance Contract Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div><strong>Contract Address:</strong> {task.contractAddress}</div>
          <div><strong>Freelancer:</strong> {task.freelancer}</div>
          <div><strong>Client:</strong> {task.client}</div>
          <div><strong>Amount:</strong> {task.amount}</div>
          <div><strong>Terms:</strong> {task.terms}</div>
          <div><strong>Deadline:</strong> {task.deadline}</div>
          <div><strong>State:</strong> {task.state}</div>
          <div>
            <strong>Distribute Attestation Amount</strong>
            <Slider
              value={attestationAmount}
              onValueChange={(value: number[]) => setAttestationAmount(value)}
              max={100}
              step={1}
            />
            <div className="flex justify-between text-sm">
              <span>In Favor of Client: {attestationAmount[0]}%</span>
              <span>In Favor of Freelancer: {100 - attestationAmount[0]}%</span>
            </div>
          </div>
          <div>
            <strong>Provide Reason For your decision</strong>
            <Input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="After reviewing the code I feel..."
              className="mt-2"
            />
          </div>
          <Button onClick={handleSubmit} className="w-full">
            Submit Attestation
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}
