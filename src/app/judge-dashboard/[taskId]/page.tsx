"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { Task } from '@/types/Task'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { NewListingDetail } from '@/components/judge/NewListingDetail'
import { OngoingCaseDetail } from '@/components/judge/OngoingCaseDetail'
import { HistoryDetail } from '@/components/judge/HistoryDetail'

export default function TaskDetailPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [task, setTask] = useState<Task | null>(null)

  useEffect(() => {
    // In a real application, you would fetch the task details from an API
    // For now, we'll use mock data
    const mockTask: Task = {
      id: params.taskId as string,
      contractAddress: '0x123456789abcdef',
      freelancer: '0xabcdef123456789',
      client: '0x987654321fedcba',
      amount: '0.05 ETH',
      terms: 'Design a logo for a startup',
      deadline: '10/1/2023, 12:00:00 PM',
      state: searchParams.get('state') as 'Disputed' | 'InProgress' | 'Completed' || 'InProgress',
    }
    setTask(mockTask)
  }, [params.taskId, searchParams])

  const handleBack = () => {
    router.back()
  }

  if (!task) {
    return <div>Loading...</div>
  }

  const getStageText = (state: string) => {
    switch (state) {
      case 'Disputed': return 'New Listing';
      case 'InProgress': return 'Ongoing Cases';
      case 'Completed': return 'History';
      default: return 'Unknown Stage';
    }
  }

  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/judge-dashboard">Dashboard</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/judge-dashboard?tab=${task.state === 'Completed' ? 'history' : task.state === 'InProgress' ? 'ongoing' : 'new'}`}>
              {getStageText(task.state)}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{task.terms}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {task.state === 'Disputed' && <NewListingDetail task={task} onBack={handleBack} />}
      {task.state === 'InProgress' && <OngoingCaseDetail task={task} onBack={handleBack} />}
      {task.state === 'Completed' && <HistoryDetail task={task} onBack={handleBack} />}
    </>
  )
}
