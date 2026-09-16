import { useEffect, useState } from 'react';
import { MessageSquare } from 'lucide-react';
import PageHeader from '../../components/shared/PageHeader';
import Spinner from '../../components/shared/Spinner';
import EmptyState from '../../components/shared/EmptyState';
import StatusBadge from '../../components/ui/StatusBadge';
import * as contactService from '../../services/contactService';
import type { ContactMessage } from '../../types';
import { formatDate } from '../../utils/format';

function statusTone(status: ContactMessage['status']) {
  if (status === 'new') return 'progress' as const;
  if (status === 'responded') return 'success' as const;
  return 'neutral' as const;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[] | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    contactService.listMessages().then(setMessages);
  }, []);

  async function handleExpand(m: ContactMessage) {
    setExpanded(expanded === m.id ? null : m.id);
    if (m.status === 'new') {
      await contactService.updateMessageStatus(m.id, 'read');
      const all = await contactService.listMessages();
      setMessages(all);
    }
  }

  async function markResponded(id: string) {
    await contactService.updateMessageStatus(id, 'responded');
    const all = await contactService.listMessages();
    setMessages(all);
  }

  return (
    <div className="p-6 lg:p-10">
      <PageHeader title="Contact messages" description="Enquiries submitted through the public website contact form." />

      {!messages ? (
        <Spinner label="Loading messages" />
      ) : messages.length === 0 ? (
        <EmptyState icon={<MessageSquare size={20} />} title="No messages yet" description="Contact form submissions will appear here." />
      ) : (
        <div className="overflow-hidden rounded-sm border border-line bg-white">
          <ul className="divide-y divide-line">
            {messages.map((m) => (
              <li key={m.id}>
                <button onClick={() => handleExpand(m)} className="flex w-full flex-wrap items-center justify-between gap-3 px-5 py-4 text-left hover:bg-paper-dim/40">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2.5">
                      <p className="text-[15px] font-medium text-ink">{m.subject}</p>
                      <StatusBadge label={m.status} tone={statusTone(m.status)} />
                    </div>
                    <p className="text-sm text-ink-mid">
                      {m.name} · {m.email}
                      {m.company ? ` · ${m.company}` : ''}
                    </p>
                  </div>
                  <p className="text-xs text-ink-mid">{formatDate(m.createdAt)}</p>
                </button>
                {expanded === m.id && (
                  <div className="border-t border-line bg-paper-dim/40 px-5 py-4">
                    <p className="text-[15px] text-ink-mid">{m.message}</p>
                    {m.phone && <p className="mt-2 text-xs text-ink-mid">Phone: {m.phone}</p>}
                    {m.status !== 'responded' && (
                      <button
                        onClick={() => markResponded(m.id)}
                        className="mt-3 rounded-sm border border-line px-3 py-1.5 text-xs font-medium text-ink hover:border-ink"
                      >
                        Mark as responded
                      </button>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
