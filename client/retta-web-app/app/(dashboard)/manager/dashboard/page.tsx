"use client";

import { useQuery } from "@tanstack/react-query";
import { mockGetDashboardData } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import {
  DashboardStatsGrid,
  SalesTrendChart,
  FuelVolumeChart,
  QuickActions,
} from "@/components/manager-dashboard";

export default function ManagerDashboard() {
  const { user } = useAuth();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard", "manager", user?.branchId],
    queryFn: () => mockGetDashboardData("manager", user?.branchId),
  });

  if (isLoading || !stats) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="mt-4 flex gap-4 flex-wrap items-center">
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
            <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Petrol:
            </span>
            <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
              UGX {stats.currentFuelPrices.gasoline.toLocaleString()}/L
            </span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
            <span className="text-sm font-medium text-green-900 dark:text-green-100">
              Diesel:
            </span>
            <span className="text-lg font-bold text-green-600 dark:text-green-400">
              UGX {stats.currentFuelPrices.diesel.toLocaleString()}/L
            </span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800">
            <span className="text-sm font-medium text-amber-900 dark:text-amber-100">
              Kerosene:
            </span>
            <span className="text-lg font-bold text-amber-600 dark:text-amber-400">
              UGX {stats.currentFuelPrices.kerosene.toLocaleString()}/L
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <DashboardStatsGrid stats={stats} />

      {/* Charts */}

      <SalesTrendChart data={stats.dailySales} />
      <FuelVolumeChart fuelVolumeSold={stats.fuelVolumeSold} />

      {/* Quick Actions */}
      <QuickActions />
    </div>
  );
}
