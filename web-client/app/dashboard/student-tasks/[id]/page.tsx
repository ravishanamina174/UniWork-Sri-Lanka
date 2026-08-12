'use client';

import { useState, useEffect, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { useParams, useRouter } from 'next/navigation';
import { Send, ArrowLeft, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
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

export default function StudentTaskChatPage() {
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

    const ws = new WebSocket(`ws://127.0.0.1:8000/ws/${user.id}`);

    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (
          payload.type === 'NEW_MESSAGE' && 
          payload.data.application_id === applicationId
        ) {
          setMessages((prev) => {
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
    return (
      <div className="flex h-full min-h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin text-[#007bff] w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100dvh-5rem)] my-14 md:h-[calc(80dvh-6rem)] lg:h-[calc(95dvh-8rem)] bg-white rounded-[0.5rem] border border-gray-200 overflow-hidden mx-auto  md:max-w-4xl max-w-5xl w-full">
      
      {/* Header - Matches the UI of task cards */}
      <div className="flex items-center justify-between gap-3 p-4 md:px-6 border-b border-gray-100 bg-white shrink-0">
        <div className="flex items-center gap-3 md:gap-4">
          <Link 
            href="/dashboard/student-tasks" 
            className="p-2 md:p-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md transition-all text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={16} className="md:w-4 md:h-4" />
          </Link>
          <div className="flex flex-col">
            <h2 className="font-bold text-gray-900 text-md md:text-lg tracking-tight line-clamp-1">
              {application?.gig_title || 'Workspace'}
            </h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="flex items-center gap-1 text-[#2f96df] px-0.5 py-0.5 rounded-md text-xs font-semibold">
                <CheckCircle2 size={12} strokeWidth={3} />
                Task Approved
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-5 bg-[#f8f9fa]">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-3">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <AlertCircle size={24} className="text-gray-400" />
            </div>
            <p className="text-sm font-medium">No messages yet. Say hello to get started!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender_id === user?.id;
            return (
              <div key={msg.id} className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex flex-col max-w-[85%] md:max-w-[65%] lg:max-w-[55%] ${isMe ? 'items-end' : 'items-start'}`}>
                  <div 
                    className={`px-3.5 py-2 md:py-2 text-[14px] leading-relaxed ${
                      isMe 
                        ? 'bg-[#ffffff] border border-[#2f96df] text-gray-800 rounded-xl ' 
                        : 'bg-white border border-gray-200 text-gray-800 rounded-xl '
                    }`}
                  >
                    <p className="whitespace-pre-wrap word-break">{msg.text}</p>
                  </div>
                  <span className="text-[11px] font-medium text-gray-400 mt-1.5 px-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form - Pill shaped, mobile responsive padding */}
      <form onSubmit={sendMessage} className="p-3 md:p-3 border-t border-gray-200 bg-white shrink-0 pb-safe">
        <div className="flex items-end gap-2 md:gap-3 max-w-4xl mx-auto">
          <div className="flex-1 bg-white border border-gray-200 rounded-[0.5rem] overflow-hidden focus-within:ring-2 focus-within:ring-[#67b5ec3b] focus-within:border-[#2f96df8a] transition-all">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(e);
                }
              }}
              placeholder="Type your message..."
              className="w-full bg-transparent px-4 py-2 md:px-5 md:py-4 text-[14px] md:text-[14px] text-gray-800 focus:outline-none resize-none max-h-32 min-h-[48px] md:min-h-[52px]"
              rows={1}
            />
          </div>
          <button 
            type="submit"
            disabled={!inputText.trim()}
            className="bg-[#2f96df] text-white rounded-[0.5rem] p-3 mb-2 md:p-3.5 hover:bg-[#268ad1] transition-all disabled:opacity-80 disabled:hover:bg-[#0a67a9] flex-shrink-0 shadow-md shadow-blue-500/20 active:scale-95"
            aria-label="Send message"
          >
            <Send size={20} className="md:w-4 md:h-4 ml-0.5" />
          </button>
        </div>
      </form>
    </div>
  );
}