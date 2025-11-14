"use client";

import { useQuery } from "@tanstack/react-query";
import { mockGetDashboardData } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import {
  DashboardStatsGrid,
  SalesTrendChart,
  FuelVolumeChart,
  QuickActions,
  FuelPricesHeader,
} from "@/components/manager/manager-dashboard";

export default function ManagerDashboard() {
  const { user } = useAuth();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard", "manager", user?.branchId],
    queryFn: () => mockGetDashboardData("manager", user?.branchId),
  });

  // Mock credit data - replace with actual query
  const { data: creditsData } = useQuery({
    queryKey: ["credits", "summary", user?.branchId],
    queryFn: async () => {
      // This would be a real API call
      // For now, return mock data matching what we have in credits page
      return {
        totalOutstanding: 689000, // John (275k) + Sarah (320k) + Mary (94k)
      };
    },
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
        <div className="mt-4">
          <FuelPricesHeader
            prices={stats.currentFuelPrices}
            totalCreditsAvailable={creditsData?.totalOutstanding || 0}
          />
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
