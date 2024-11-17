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
    const fetchTask = async () => {
      try {
        const response = await fetch(`/api/tasks/${params.taskId}`); // Fetch task from API
        const data: Task = await response.json();
        setTask(data);
      } catch (error) {
        console.error('Error fetching task:', error);
      }
    };

    fetchTask();
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
            <BreadcrumbLink href={`/judge-dashboard?tab=${task.state === 'Completed' ? 'history' : task.state === 'Disputed' ? 'new' : 'ongoing'}`}>
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
      {task.state === 'Completed' && <HistoryDetail task={task} onBack={handleBack} />}
    </>
  )
}
