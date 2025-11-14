"use client";

import { StatCard } from "@/components/stat-card";
import { DollarSign, TrendingUp, Fuel, Calendar } from "lucide-react";
import { DashboardStats } from "@/lib/types";

interface DashboardStatsGridProps {
  stats: DashboardStats;
}

export function DashboardStatsGrid({ stats }: DashboardStatsGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Today's Revenue"
        value={`UGX ${stats.totalRevenue.toLocaleString()}`}
        description="Sales for today"
        icon={DollarSign}
        trend={{ value: 8.2, isPositive: true }}
      />
      <StatCard
        title="Today's Expenses"
        value={`UGX ${stats.totalExpenses.toLocaleString()}`}
        description="Expenses recorded today"
        icon={TrendingUp}
      />
      <StatCard
        title="Fuel Sold Today"
        value={`${stats.fuelVolumeSold.total.toLocaleString()} L`}
        description="All fuel types"
        icon={Fuel}
      />
      <StatCard
        title="Date"
        value={new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        })}
        description={new Date().toLocaleDateString("en-US", {
          weekday: "long",
        })}
        icon={Calendar}
      />
    </div>
  );
}
