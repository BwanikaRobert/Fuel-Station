'use client';

import { useQuery } from '@tanstack/react-query';
import { mockGetPumps, mockGetShiftBalances } from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import {
  RecordShiftBalanceForm,
  RecentShiftBalances,
  ShiftBalanceHistory,
} from '@/components/shift-balance';

export default function ShiftBalancingPage() {
  const { user } = useAuth();

  const { data: pumps, isLoading: pumpsLoading } = useQuery({
    queryKey: ['pumps', user?.branchId],
    queryFn: () => mockGetPumps(user?.branchId),
  });

  const { data: shiftBalances } = useQuery({
    queryKey: ['shift-balances', user?.branchId],
    queryFn: () => mockGetShiftBalances(user?.branchId),
  });

  if (pumpsLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Shift Balancing</h1>
        <p className="text-muted-foreground">
          Record closing meter readings and calculate daily sales
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Record Form */}
        <RecordShiftBalanceForm
          pumps={pumps || []}
          userId={user!.id}
          branchId={user!.branchId!}
        />

        {/* Recent Balances */}
        <RecentShiftBalances shiftBalances={shiftBalances || []} />
      </div>

      {/* History Table */}
      <ShiftBalanceHistory shiftBalances={shiftBalances || []} />
    </div>
  );
}
