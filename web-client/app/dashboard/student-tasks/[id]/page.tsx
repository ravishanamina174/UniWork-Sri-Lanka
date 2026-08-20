'use client';

import { useParams } from 'next/navigation';
// import ChatInterface from './chatinterface';

export default function StudentTaskChatPage() {
  const params = useParams();
  const applicationId = params.id as string;

  return (
    <div className="w-full min-h-screen flex flex-col">
      {/* 
        Future components can be added here easily.
        For example: <TopStatsBanner /> or <ActionButtons /> 
      */}
      
      {/* <ChatInterface applicationId={applicationId} /> */}
      
      {/* Or added below */}
    </div>
  );
}