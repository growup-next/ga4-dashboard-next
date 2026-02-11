// workspace/ga4-dashboard-next/src/app/page.tsx
'use client';

import Dashboard from '@/components/Dashboard';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Dashboard />
    </main>
  );
}
