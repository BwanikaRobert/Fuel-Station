"use client";

import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Droplet,
  Fuel,
  Flame,
} from "lucide-react";
import { DashboardStats } from "@/lib/types";

interface AdminStatsGridProps {
  stats: DashboardStats;
}

export function AdminStatsGrid({ stats }: AdminStatsGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Revenue"
        value={`UGX ${stats.totalRevenue.toLocaleString()}`}
        description="All-time revenue"
        icon={DollarSign}
        trend={{ value: 12.5, isPositive: true }}
      />
      <StatCard
        title="Total Expenses"
        value={`UGX ${stats.totalExpenses.toLocaleString()}`}
        description="All-time expenses"
        icon={TrendingDown}
        trend={{ value: 4.3, isPositive: false }}
      />
      <StatCard
        title="Net Profit"
        value={`UGX ${stats.netProfit.toLocaleString()}`}
        description="Revenue - Expenses"
        icon={TrendingUp}
        trend={{ value: 18.2, isPositive: true }}
        className="border-green-200 dark:border-green-900"
      />

      {/* Fuel Volume Card with Individual Products */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Total Fuel Sold</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Droplet className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-xs text-muted-foreground">Petrol</span>
            </div>
            <span className="text-sm font-semibold">
              {stats.fuelVolumeSold.gasoline.toLocaleString()} L
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Fuel className="h-4 w-4 text-green-600 dark:text-green-400" />
              <span className="text-xs text-muted-foreground">Diesel</span>
            </div>
            <span className="text-sm font-semibold">
              {stats.fuelVolumeSold.diesel.toLocaleString()} L
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <span className="text-xs text-muted-foreground">Kerosene</span>
            </div>
            <span className="text-sm font-semibold">
              {stats.fuelVolumeSold.kerosene.toLocaleString()} L
            </span>
          </div>
          <div className="pt-2 mt-2 border-t">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">Total</span>
              <span className="text-base font-bold">
                {stats.fuelVolumeSold.total.toLocaleString()} L
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
