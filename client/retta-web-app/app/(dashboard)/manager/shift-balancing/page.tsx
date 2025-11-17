"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  mockGetPumps,
  mockGetShiftBalances,
  mockGetDashboardData,
} from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { DailyDipping } from "@/lib/types";
import {
  RecordShiftBalanceForm,
  RecordDailyDippingModal,
  ShiftBalanceHistory,
  DailyDippingHistory,
} from "@/components/manager/shift-balance";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function ShiftBalancingPage() {
  const { user } = useAuth();
  const [showShiftBalanceForm, setShowShiftBalanceForm] = useState(false);

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
  const dailyDippings: DailyDipping[] = useMemo(
    () => [
      {
        id: "dipping-1",
        branchId: user?.branchId || "branch-1",
        branchName: "Downtown Station",
        date: "2025-11-14",
        gasolineLiters: 8000,
        dieselLiters: 7500,
        keroseneLiters: 3000,
        recordedBy: user?.id || "2",
        recordedByName: user?.name || "Sarah Manager",
        createdAt: "2025-11-14T08:00:00Z",
      },
      {
        id: "dipping-2",
        branchId: user?.branchId || "branch-1",
        branchName: "Downtown Station",
        date: "2025-11-15",
        gasolineLiters: 7200,
        dieselLiters: 6800,
        keroseneLiters: 2700,
        recordedBy: user?.id || "2",
        recordedByName: user?.name || "Sarah Manager",
        createdAt: "2025-11-15T08:00:00Z",
      },
      {
        id: "dipping-3",
        branchId: user?.branchId || "branch-1",
        branchName: "Downtown Station",
        date: "2025-11-16",
        gasolineLiters: 6350,
        dieselLiters: 6100,
        keroseneLiters: 2450,
        recordedBy: user?.id || "2",
        recordedByName: user?.name || "Sarah Manager",
        createdAt: "2025-11-16T08:00:00Z",
      },
      {
        id: "dipping-4",
        branchId: user?.branchId || "branch-1",
        branchName: "Downtown Station",
        date: "2025-11-17",
        gasolineLiters: 5600,
        dieselLiters: 5300,
        keroseneLiters: 2150,
        recordedBy: user?.id || "2",
        recordedByName: user?.name || "Sarah Manager",
        createdAt: "2025-11-17T08:00:00Z",
      },
    ],
    [user?.branchId, user?.id, user?.name]
  );

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Shift Balancing & Stock
          </h1>
          <p className="text-muted-foreground">
            Record shift balances and daily tank measurements
          </p>
        </div>
        <RecordDailyDippingModal userId={user!.id} branchId={user!.branchId!} />
      </div>

      {/* Tank Gains/Losses */}
      <DailyDippingHistory
        dippings={dailyDippings}
        shiftBalances={shiftBalances}
      />

      {/* Shift Balance Form Toggle */}
      <div className="flex justify-center">
        <Button
          variant="outline"
          size="lg"
          onClick={() => setShowShiftBalanceForm(!showShiftBalanceForm)}
          className="gap-2"
        >
          {showShiftBalanceForm ? (
            <>
              <ChevronUp className="h-4 w-4" />
              Hide Shift Balance Form
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4" />
              Show Shift Balance Form
            </>
          )}
        </Button>
      </div>

      {/* Shift Balance Form */}
      {showShiftBalanceForm && (
        <RecordShiftBalanceForm
          pumps={pumps || []}
          userId={user!.id}
          branchId={user!.branchId!}
          fuelPrices={dashboardData?.currentFuelPrices}
        />
      )}

      {/* Shift Balance History */}
      <ShiftBalanceHistory shiftBalances={shiftBalances || []} />
    </div>
  );
}
