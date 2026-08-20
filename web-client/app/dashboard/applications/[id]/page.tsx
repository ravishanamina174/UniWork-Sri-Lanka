'use client';

import { useParams } from 'next/navigation';
import ChatInterface from './chatinterface';

export default function PosterApplicationChatPage() {
  const params = useParams();
  const applicationId = params.id as string;

  return (
    <div className="w-full min-h-screen flex flex-col">
      {/* 
        This is your main page wrapper. You can add extra components 
        like headers, sidebars, or task details panes here in the future. 
      */}
      
      {/* <ChatInterface applicationId={applicationId} /> */}
      
    </div>
  );
}