import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"

interface JudgeNavigationProps {
  activeTab: 'new' | 'ongoing' | 'history'
  setActiveTab: (tab: 'new' | 'ongoing' | 'history') => void
}

export const JudgeNavigation: React.FC<JudgeNavigationProps> = ({ activeTab, setActiveTab }) => {
  const router = useRouter()

  const handleTabClick = (tab: 'new' | 'ongoing' | 'history') => {
    setActiveTab(tab)
    router.push(`/judge-dashboard?tab=${tab}`)
  }

  return (
    <nav className="flex justify-center mb-4">
      <div className="flex">
        <button
          className={`mx-2 px-4 py-2 rounded ${activeTab === 'new' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => handleTabClick('new')}
        >
          New Listing
        </button>
        <button
          className={`mx-2 px-4 py-2 rounded ${activeTab === 'ongoing' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => handleTabClick('ongoing')}
        >
          Ongoing Cases
        </button>
        <button
          className={`mx-2 px-4 py-2 rounded ${activeTab === 'history' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => handleTabClick('history')}
        >
          History
        </button>
      </div>
    </nav>
  )
}
