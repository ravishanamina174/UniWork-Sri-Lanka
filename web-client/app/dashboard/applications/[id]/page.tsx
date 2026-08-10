'use client';

import { useState, useEffect, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { useParams, useRouter } from 'next/navigation';
import { Send, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface Message {
  id: string;
  sender_id: string;
  text: string;
  timestamp: string;
}

interface ApplicationData {
  id: string;
  gig_title: string;
  application_confirm: string;
}

export default function PosterApplicationChatPage() {
  const { user } = useUser();
  const params = useParams();
  const router = useRouter();
  const applicationId = params.id as string;

  const [application, setApplication] = useState<ApplicationData | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 1. Initial Load: Application Details + Historical Messages
  useEffect(() => {
    const loadData = async () => {
      if (!applicationId) return;
      try {
        const appRes = await fetch(`http://127.0.0.1:8000/api/v1/applications/${applicationId}`);
        if (appRes.ok) {
          const appData = await appRes.json();
          setApplication(appData);
          
          if (appData.application_confirm !== 'approve') {
            router.push('/dashboard/applications');
            return;
          }
        }

        const msgRes = await fetch(`http://127.0.0.1:8000/api/v1/messages/${applicationId}`);
        if (msgRes.ok) {
          const msgData = await msgRes.json();
          setMessages(msgData);
        }
      } catch (err) {
        console.error("Failed to load workspace data", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [applicationId, router]);

  // 2. Real-Time WebSocket Connection
  useEffect(() => {
    if (!user?.id) return;

    // Connect to backend WebSocket endpoint
    const ws = new WebSocket(`ws://127.0.0.1:8000/ws/${user.id}`);

    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        
        // Listen for incoming messages targeting this specific task
        if (
          payload.type === 'NEW_MESSAGE' && 
          payload.data.application_id === applicationId
        ) {
          setMessages((prev) => {
            // Avoid adding duplicate messages if the sender already added it locally
            if (prev.some((msg) => msg.id === payload.data.id)) return prev;
            return [...prev, payload.data];
          });
        }
      } catch (err) {
        console.error("WebSocket message parse error:", err);
      }
    };

    return () => {
      ws.close();
    };
  }, [user?.id, applicationId]);

  // 3. Send Message Function
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !user || !applicationId) return;

    const textToSend = inputText;
    setInputText('');

    try {
      const res = await fetch('http://127.0.0.1:8000/api/v1/messages/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          application_id: applicationId,
          sender_id: user.id,
          text: textToSend
        })
      });

      if (res.ok) {
        const newMessage = await res.json();
        setMessages((prev) => {
          if (prev.some((msg) => msg.id === newMessage.id)) return prev;
          return [...prev, newMessage];
        });
      }
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  if (loading) {
    return <div className="flex h-full items-center justify-center"><Loader2 className="animate-spin text-blue-600" /></div>;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] md:h-[calc(100vh-2rem)] bg-white rounded-lg border border-[#ededed] overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-[#ededed] bg-[#fbfbfa] shrink-0">
        <Link href="/dashboard/applications" className="p-2 hover:bg-[#efefef] rounded-md transition-colors text-[#787774]">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="font-semibold text-[#37352f] text-[16px]">{application?.gig_title || 'Ongoing Task'}</h2>
          <span className="text-[12px] text-green-600 font-medium">✓ Task Approved</span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30">
        {messages.length === 0 ? (
          <div className="text-center text-[#787774] text-sm mt-10">
            No messages yet. Send a message to get started!
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender_id === user?.id;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] md:max-w-[60%] rounded-2xl px-4 py-2.5 text-[14px] leading-relaxed shadow-sm ${
                  isMe 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-white border border-[#ededed] text-[#37352f] rounded-bl-none'
                }`}>
                  <p>{msg.text}</p>
                  <span className={`text-[10px] mt-1.5 block font-medium ${isMe ? 'text-blue-200' : 'text-[#787774]'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={sendMessage} className="p-3 md:p-4 border-t border-[#ededed] bg-white shrink-0 pb-safe">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Message..."
            className="flex-1 rounded-full border border-[#ededed] bg-[#fbfbfa] px-4 py-2 text-[14px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-shadow"
          />
          <button 
            type="submit"
            disabled={!inputText.trim()}
            className="bg-blue-600 text-white rounded-full p-2.5 hover:bg-blue-700 transition-colors disabled:opacity-50 flex-shrink-0"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  );
}