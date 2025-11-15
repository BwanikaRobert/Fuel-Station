"use client";

import { useQuery } from "@tanstack/react-query";
import {
  mockGetPumps,
  mockGetShiftBalances,
  mockGetDashboardData,
} from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { DailyDipping } from "@/lib/types";
import {
  RecordShiftBalanceForm,
  RecordDailyDippingForm,
  ShiftBalanceHistory,
  DailyDippingHistory,
} from "@/components/manager/shift-balance";

export default function ShiftBalancingPage() {
  const { user } = useAuth();

  const { data: pumps, isLoading: pumpsLoading } = useQuery({
    queryKey: ["pumps", user?.branchId],
    queryFn: () => mockGetPumps(user?.branchId),
  });

  const { data: shiftBalances } = useQuery({
    queryKey: ["shift-balances", user?.branchId],
    queryFn: () => mockGetShiftBalances(user?.branchId),
  });

  const { data: dashboardData } = useQuery({
    queryKey: ["dashboard", "manager", user?.branchId],
    queryFn: () => mockGetDashboardData("manager", user?.branchId),
  });

  // Mock daily dippings data - replace with actual query
  const dailyDippings: DailyDipping[] = [];

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
        <h1 className="text-3xl font-bold tracking-tight">
          Shift Balancing & Stock
        </h1>
        <p className="text-muted-foreground">
          Record shift balances and daily tank measurements
        </p>
      </div>

      {/* Daily Dipping Form */}
      <RecordDailyDippingForm userId={user!.id} branchId={user!.branchId!} />

      {/* Shift Balance Form */}
      <RecordShiftBalanceForm
        pumps={pumps || []}
        userId={user!.id}
        branchId={user!.branchId!}
        fuelPrices={dashboardData?.currentFuelPrices}
      />

      {/* History Tables Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Shift Balance History */}
        <ShiftBalanceHistory shiftBalances={shiftBalances || []} />

        {/* Daily Dipping History */}
        <DailyDippingHistory dippings={dailyDippings} />
      </div>
    </div>
  );
}
