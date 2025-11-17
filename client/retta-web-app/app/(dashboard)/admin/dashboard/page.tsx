"use client";

import { useQuery } from "@tanstack/react-query";
import { mockGetDashboardData } from "@/lib/api";
import {
  AdminStatsGrid,
  DailySalesChart,
  RevenueByFuelChart,
  BranchesSalesChart,
} from "@/components/admin-dashboard";

export default function AdminDashboard() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard", "admin"],
    queryFn: () => mockGetDashboardData("admin"),
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
      {/* Stats Grid */}
      <AdminStatsGrid stats={stats} />

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        <RevenueByFuelChart revenueByFuelType={stats.revenueByFuelType} />
        <BranchesSalesChart branches={stats.topPerformingBranches} />
      </div>

      {/* Daily Sales Chart */}
      <DailySalesChart branches={stats.topPerformingBranches} />
    </div>
  );
}
