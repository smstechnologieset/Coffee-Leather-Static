import type { ReactNode } from 'react';

// Admin layout — will be auth-gated in Phase 6
// For now this is a plain wrapper so routes compile correctly
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <nav style={{ padding: '1rem', background: '#f5f5f5', marginBottom: '1rem' }}>
        <strong>Admin Panel</strong> — auth gating coming in Phase 6
      </nav>
      {children}
    </div>
  );
}
