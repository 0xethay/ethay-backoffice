import React from 'react'
import { Task } from '@/types/Task'

interface HistoryStageProps {
  tasks: Task[]
  onTaskClick: (task: Task) => void
}

export const HistoryStage: React.FC<HistoryStageProps> = ({ tasks, onTaskClick }) => {
  const completedTasks = tasks.filter(task => task.state === 'Completed')

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">History</h2>
      {completedTasks.length === 0 ? (
        <p>No completed cases in the history.</p>
      ) : (
        <ul className="space-y-4">
          {completedTasks.map(task => (
            <li key={task.id} className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-lg mb-2">{task.terms}</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <p><span className="font-medium">Contract:</span> {task.contractAddress.slice(0, 6)}...{task.contractAddress.slice(-4)}</p>
                <p><span className="font-medium">Amount:</span> {task.amount}</p>
                <p><span className="font-medium">Deadline:</span> {task.deadline}</p>
                <p><span className="font-medium">Status:</span> <span className="text-green-600">Completed</span></p>
              </div>
              <button 
                onClick={() => onTaskClick(task)}
                className="mt-3 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
              >
                View Full Details
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
