import React from 'react'
import { Task } from '@/types/Task'

interface OngoingCasesStageProps {
  tasks: Task[]
  onTaskClick: (task: Task) => void
}

export const OngoingCasesStage: React.FC<OngoingCasesStageProps> = ({ tasks, onTaskClick }) => {
  const ongoingTasks = tasks.filter(task => task.state === 'InProgress')

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Ongoing Cases</h2>
      {ongoingTasks.length === 0 ? (
        <p>No ongoing cases at the moment.</p>
      ) : (
        <ul className="space-y-4">
          {ongoingTasks.map(task => (
            <li key={task.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-lg mb-2">{task.terms}</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p><span className="font-medium">Contract:</span> {task.contractAddress.slice(0, 6)}...{task.contractAddress.slice(-4)}</p>
                <p><span className="font-medium">Amount:</span> {task.amount}</p>
                <p><span className="font-medium">Deadline:</span> {task.deadline}</p>
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
