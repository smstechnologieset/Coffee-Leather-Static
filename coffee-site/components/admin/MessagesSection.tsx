'use client';

import { useState } from 'react';
import { Mail, CheckCircle2 } from 'lucide-react';

const MOCK_MESSAGES = [
  { id: 'm1', name: 'James Wilson', email: 'james@eurolink.com', date: '2 hrs ago', subject: 'Inquiry regarding Harar Longberry', message: 'Hello, we are interested in ordering 5 MT of Harar Longberry. Do you have any stock from the current harvest available?', isRead: false },
  { id: 'm2', name: 'Maria Garcia', email: 'm.garcia@cafe-espana.es', date: '1 day ago', subject: 'Sample arrival', message: 'The Yirgacheffe sample arrived yesterday. We will cup it tomorrow and get back to you with our feedback.', isRead: true },
  { id: 'm3', name: 'Ahmed Al-Fayed', email: 'ahmed@gulfroasters.ae', date: '3 days ago', subject: 'Shipping terms', message: 'Could you clarify if you offer CIF terms to Dubai port for your Guji Natural?', isRead: true },
];

export default function MessagesSection() {
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [selectedMessage, setSelectedMessage] = useState<typeof MOCK_MESSAGES[0] | null>(null);

  const toggleRead = (id: string) => {
    setMessages((prev) => prev.map((m) => m.id === id ? { ...m, isRead: !m.isRead } : m));
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-serif font-bold text-neutral-900">Contact Messages</h2>
          <p className="text-neutral-500 text-sm">{messages.filter(m => !m.isRead).length} unread messages</p>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Message list */}
        <div className="w-full lg:w-1/3 flex flex-col bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-neutral-100 bg-neutral-50">
            <h3 className="font-bold text-neutral-900 text-sm">Inbox</h3>
          </div>
          <div className="flex-1 overflow-y-auto">
            {messages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => { setSelectedMessage(msg); if (!msg.isRead) toggleRead(msg.id); }}
                className={`p-4 border-b border-neutral-100 cursor-pointer transition-colors hover:bg-amber-50 ${selectedMessage?.id === msg.id ? 'bg-amber-50' : !msg.isRead ? 'bg-white' : 'bg-neutral-50/50'}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className={`text-sm ${!msg.isRead ? 'font-bold text-neutral-900' : 'font-medium text-neutral-700'}`}>{msg.name}</span>
                  <span className="text-xs text-neutral-400">{msg.date}</span>
                </div>
                <p className={`text-sm truncate mb-1 ${!msg.isRead ? 'font-semibold text-neutral-800' : 'text-neutral-600'}`}>{msg.subject}</p>
                <p className="text-xs text-neutral-500 line-clamp-1">{msg.message}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Message detail */}
        <div className="hidden lg:flex flex-col flex-1 bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
          {selectedMessage ? (
            <>
              <div className="p-6 border-b border-neutral-100 flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold text-neutral-900 mb-2">{selectedMessage.subject}</h2>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold">
                      {selectedMessage.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-neutral-900">{selectedMessage.name}</p>
                      <p className="text-xs text-neutral-500">{selectedMessage.email}</p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => toggleRead(selectedMessage.id)}
                  className="flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-primary-600 transition-colors"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Mark as {selectedMessage.isRead ? 'unread' : 'read'}
                </button>
              </div>
              <div className="p-6 flex-1 overflow-y-auto">
                <p className="text-sm text-neutral-700 whitespace-pre-wrap leading-relaxed">{selectedMessage.message}</p>
              </div>
              <div className="p-4 border-t border-neutral-100 bg-neutral-50">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                  className="inline-flex items-center gap-2 bg-primary-700 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-primary-800 transition-colors"
                >
                  <Mail className="h-4 w-4" /> Reply via Email
                </a>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-neutral-400">
              <Mail className="h-12 w-12 mb-4 text-neutral-200" />
              <p>Select a message to read</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
