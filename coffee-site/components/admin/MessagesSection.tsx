'use client';

import { useState, useEffect } from 'react';
import { Mail, CheckCircle2, RefreshCw } from 'lucide-react';
import { createClient } from '@/lib/supabase';

interface Message {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  date: string;
  subject: string;
  message: string;
  isRead: boolean;
}

const MOCK_MESSAGES: Message[] = [
  { id: 'm1', name: 'James Wilson', email: 'james@eurolink.com', date: '2 hrs ago', subject: 'Inquiry regarding Harar Longberry', message: 'Hello, we are interested in ordering 50 Quintals (5,000 kg) of Harar Longberry. Do you have any stock from the current harvest available?', isRead: false },
  { id: 'm2', name: 'Maria Garcia', email: 'm.garcia@cafe-espana.es', date: '1 day ago', subject: 'Sample arrival', message: 'The Yirgacheffe sample arrived yesterday. We will cup it tomorrow and get back to you with our feedback.', isRead: true },
  { id: 'm3', name: 'Ahmed Al-Fayed', email: 'ahmed@gulfroasters.ae', date: '3 days ago', subject: 'Shipping terms', message: 'Could you clarify if you offer CIF terms to Dubai port for your Guji Natural?', isRead: true },
];

export default function MessagesSection() {
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchLiveMessages = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (data && data.length > 0 && !error) {
        const mapped: Message[] = data.map((m: any) => ({
          id: m.id,
          name: m.name || 'Inquirer',
          email: m.email || '',
          phone: m.phone || undefined,
          company: m.company || undefined,
          date: m.created_at ? new Date(m.created_at).toLocaleDateString() : 'Recent',
          subject: m.message ? (m.message.slice(0, 45) + '...') : 'Contact Inquiry',
          message: m.message || '',
          isRead: m.status !== 'new',
        }));
        setMessages(mapped);
      }
    } catch (e) {
      console.warn('Error fetching live messages:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveMessages();
  }, []);

  const toggleRead = async (id: string) => {
    const msg = messages.find((m) => m.id === id);
    const newStatus = msg?.isRead ? 'new' : 'read';

    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, isRead: !m.isRead } : m))
    );

    try {
      const supabase = createClient();
      await supabase.from('contact_submissions').update({ status: newStatus }).eq('id', id);
    } catch (e) {
      console.warn('Error updating message status in Supabase:', e);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-serif font-bold text-neutral-900 flex items-center gap-2">
            <span>Contact Messages</span>
            <button
              onClick={fetchLiveMessages}
              disabled={loading}
              title="Refresh messages"
              className="p-1 hover:bg-neutral-100 rounded-full transition"
            >
              <RefreshCw className={`h-4 w-4 text-neutral-400 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </h2>
          <p className="text-neutral-500 text-sm">
            {messages.filter((m) => !m.isRead).length} unread messages
          </p>
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
                onClick={() => {
                  setSelectedMessage(msg);
                  if (!msg.isRead) toggleRead(msg.id);
                }}
                className={`p-4 border-b border-neutral-100 cursor-pointer transition-colors hover:bg-amber-50 ${
                  selectedMessage?.id === msg.id
                    ? 'bg-amber-50'
                    : !msg.isRead
                    ? 'bg-white'
                    : 'bg-neutral-50/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 min-w-0">
                    {!msg.isRead && (
                      <span className="h-2 w-2 rounded-full bg-amber-600 flex-shrink-0" />
                    )}
                    <span
                      className={`text-sm truncate ${
                        !msg.isRead
                          ? 'font-bold text-neutral-900'
                          : 'font-medium text-neutral-700'
                      }`}
                    >
                      {msg.name}
                    </span>
                  </div>
                  <span className="text-xs text-neutral-400 whitespace-nowrap">{msg.date}</span>
                </div>
                <p className="text-xs text-neutral-600 truncate">{msg.subject}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Message preview */}
        <div className="hidden lg:flex flex-1 flex-col bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 overflow-y-auto">
          {selectedMessage ? (
            <div>
              <div className="flex items-start justify-between pb-6 border-b border-neutral-100 mb-6">
                <div>
                  <h3 className="text-lg font-serif font-bold text-neutral-900 mb-1">
                    {selectedMessage.subject}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-neutral-500">
                    <span>
                      From: <strong className="text-neutral-700">{selectedMessage.name}</strong> ({selectedMessage.email})
                    </span>
                    {selectedMessage.phone && <span>• Tel: {selectedMessage.phone}</span>}
                    {selectedMessage.company && <span>• Co: {selectedMessage.company}</span>}
                    <span>• {selectedMessage.date}</span>
                  </div>
                </div>
                <button
                  onClick={() => toggleRead(selectedMessage.id)}
                  className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-800 border border-neutral-200 rounded-lg px-3 py-1.5 hover:bg-neutral-50 transition-colors"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>{selectedMessage.isRead ? 'Mark as Unread' : 'Mark as Read'}</span>
                </button>
              </div>
              <div className="text-sm text-neutral-700 leading-relaxed whitespace-pre-wrap">
                {selectedMessage.message}
              </div>
              <div className="mt-8 pt-6 border-t border-neutral-100">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}
                  className="inline-flex items-center gap-2 bg-primary-700 hover:bg-primary-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  Reply via Email
                </a>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-neutral-400">
              <Mail className="h-12 w-12 stroke-1 mb-3" />
              <p className="text-sm">Select a message from the list to view its contents.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
