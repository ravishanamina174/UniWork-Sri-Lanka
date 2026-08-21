'use client';

import { useParams } from 'next/navigation';
import ChatInterface from './chatinterface';
import TaskDetailsBoard from './task-details'; // Import the new component

export default function PosterApplicationChatPage() {
  const params = useParams();
  const applicationId = params.id as string;

  return (
    <div className="w-full min-h-screen flex flex-col bg-[#f8f9fa] pt-8 pb-14 px-4 md:px-8">
      <div className="w-full max-w-[1200px] mx-auto flex flex-col gap-8">
        
        {/* Top Section: Multi-optioned Card Bento Grid */}
        <TaskDetailsBoard applicationId={applicationId} />
        
        <ChatInterface applicationId={applicationId} />

      </div>
    </div>
  );
}