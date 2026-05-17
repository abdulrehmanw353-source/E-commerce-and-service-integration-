/**
 * StatusBadge — Compact colored pill for order/booking status
 */
const STATUS_MAP = {
  // Orders
  pending:              { label: 'Pending',              bg: 'bg-yellow-500/15', text: 'text-yellow-400' },
  pending_verification: { label: 'Pending Verification', bg: 'bg-orange-500/15', text: 'text-orange-400' },
  processing:           { label: 'Processing',           bg: 'bg-blue-500/15',   text: 'text-blue-300' },
  paid:                 { label: 'Paid',                 bg: 'bg-emerald-500/15',text: 'text-emerald-300' },
  shipped:              { label: 'Shipped',              bg: 'bg-indigo-500/15', text: 'text-indigo-400' },
  delivered:            { label: 'Delivered',            bg: 'bg-green-500/15',  text: 'text-green-400'  },
  cancelled:            { label: 'Cancelled',            bg: 'bg-red-500/15',    text: 'text-red-400'    },
  failed:               { label: 'Failed',               bg: 'bg-red-500/15',    text: 'text-red-400' },
  refunded:             { label: 'Refunded',             bg: 'bg-purple-500/15', text: 'text-purple-300' },
  cod:                  { label: 'COD',                  bg: 'bg-cyan-500/15',   text: 'text-cyan-300' },
  // Bookings
  approved:   { label: 'Approved',   bg: 'bg-green-500/15',  text: 'text-green-400'  },
  rejected:   { label: 'Rejected',   bg: 'bg-red-500/15',    text: 'text-red-400'    },
  assigned:   { label: 'Assigned',   bg: 'bg-purple-500/15', text: 'text-purple-300' },
  'in-progress': { label: 'In Progress', bg: 'bg-blue-500/15', text: 'text-blue-300' },
  in_progress:{ label: 'In Progress',bg: 'bg-blue-500/15',   text: 'text-blue-300'   },
  completed:  { label: 'Completed',  bg: 'bg-green-500/15',  text: 'text-green-400'  },
  // Generic
  active:     { label: 'Active',     bg: 'bg-green-500/15',  text: 'text-green-400'  },
  inactive:   { label: 'Inactive',   bg: 'bg-white/10',      text: 'text-white/50'   },
  admin:      { label: 'Admin',      bg: 'bg-blue-500/15',   text: 'text-blue-400'   },
  customer:   { label: 'Customer',   bg: 'bg-white/10',      text: 'text-white/50'   },
};

export default function StatusBadge({ status }) {
  const key = status?.toLowerCase().replace(/ /g, '_');
  const cfg = STATUS_MAP[key] || { label: status || '—', bg: 'bg-white/10', text: 'text-white/50' };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider ${cfg.bg} ${cfg.text}`}>
      {cfg.label}
    </span>
  );
}
