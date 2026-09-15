import { FlaskConical, FileText, MessageSquare, Package, TrendingUp, TrendingDown } from 'lucide-react';

interface Stats {
  products: number;
  sampleRequests: number;
  pendingSampleRequests: number;
  contractRequests: number;
  pendingContractRequests: number;
  messages: number;
  unreadMessages: number;
}

type Section = 'overview' | 'products' | 'sample-requests' | 'contract-requests' | 'messages' | 'top-products';

const CARDS = (stats: Stats) => [
  { label: 'Total Products', value: stats.products, icon: Package, color: 'bg-amber-100 text-amber-700', section: 'products' as Section },
  { label: 'Sample Requests', value: stats.sampleRequests, icon: FlaskConical, color: 'bg-blue-100 text-blue-700', badge: stats.pendingSampleRequests, badgeLabel: 'pending', section: 'sample-requests' as Section },
  { label: 'Contract Requests', value: stats.contractRequests, icon: FileText, color: 'bg-green-100 text-green-700', badge: stats.pendingContractRequests, badgeLabel: 'pending', section: 'contract-requests' as Section },
  { label: 'Messages', value: stats.messages, icon: MessageSquare, color: 'bg-red-100 text-red-700', badge: stats.unreadMessages, badgeLabel: 'unread', section: 'messages' as Section },
];

const RECENT_ACTIVITY = [
  { time: '2 hrs ago', text: 'New sample request for Yirgacheffe Grade 1', type: 'sample' },
  { time: '4 hrs ago', text: 'Contract initiated for 5 MT Guji Natural', type: 'contract' },
  { time: '6 hrs ago', text: 'New message from buyer@euroimports.com', type: 'message' },
  { time: '1 day ago', text: 'Price updated: Harar Longberry → $4,600/MT', type: 'product' },
  { time: '2 days ago', text: 'New sample request for Sidamo Natural G1', type: 'sample' },
];

export default function OverviewSection({ stats, onNavigate }: { stats: Stats; onNavigate: (s: Section) => void }) {
  const cards = CARDS(stats);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-neutral-900">Dashboard Overview</h1>
          <p className="text-neutral-500 text-sm mt-1">Highland Roots Coffee Trading — Admin View</p>
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {cards.map(({ label, value, icon: Icon, color, badge, badgeLabel, section }) => (
          <div
            key={label}
            onClick={() => onNavigate(section)}
            className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-5 cursor-pointer hover:shadow-brand group transition-all duration-200 hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-4">
              <div className={`h-12 w-12 rounded-xl ${color} flex items-center justify-center group-hover:rotate-12 transition-transform duration-500`}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm text-neutral-500">{label}</p>
                <p className="text-2xl font-bold text-neutral-900">{value}</p>
                {badge && badge > 0 ? (
                  <p className="text-xs text-amber-600 font-semibold">{badge} {badgeLabel}</p>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent activity */}
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
        <h2 className="font-serif font-bold text-neutral-900 text-lg mb-5">Recent Activity</h2>
        <ul className="divide-y divide-neutral-50">
          {RECENT_ACTIVITY.map((item, i) => (
            <li key={i} className="py-3 flex items-start gap-4">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                item.type === 'sample' ? 'bg-blue-100 text-blue-700'
                  : item.type === 'contract' ? 'bg-green-100 text-green-700'
                  : item.type === 'message' ? 'bg-red-100 text-red-700'
                  : 'bg-amber-100 text-amber-700'
              }`}>
                {item.type === 'sample' ? 'S' : item.type === 'contract' ? 'C' : item.type === 'message' ? 'M' : 'P'}
              </div>
              <div className="flex-1">
                <p className="text-sm text-neutral-800">{item.text}</p>
                <p className="text-xs text-neutral-400 mt-0.5">{item.time}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
