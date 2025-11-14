"use client";

import { StatCard } from "@/components/stat-card";
import { DollarSign, Droplet, Fuel, Flame } from "lucide-react";
import { DashboardStats } from "@/lib/types";

interface DashboardStatsGridProps {
  stats: DashboardStats;
}

export function DashboardStatsGrid({ stats }: DashboardStatsGridProps) {
  // Calculate total sales from all fuel types
  const totalNetSales =
    stats.revenueByFuelType.gasoline +
    stats.revenueByFuelType.diesel +
    stats.revenueByFuelType.kerosene;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Net Sales"
        value={`UGX ${totalNetSales.toLocaleString()}`}
        description="Last shift sales"
        icon={DollarSign}
        trend={{ value: 8.2, isPositive: true }}
      />
      <StatCard
        title="Petrol Sales"
        value={`UGX ${stats.revenueByFuelType.gasoline.toLocaleString()}`}
        description={`${stats.fuelVolumeSold.gasoline.toLocaleString()} L sold`}
        icon={Droplet}
        iconColor="text-blue-600 dark:text-blue-400"
      />
      <StatCard
        title="Diesel Sales"
        value={`UGX ${stats.revenueByFuelType.diesel.toLocaleString()}`}
        description={`${stats.fuelVolumeSold.diesel.toLocaleString()} L sold`}
        icon={Fuel}
        iconColor="text-green-600 dark:text-green-400"
      />
      <StatCard
        title="Kerosene Sales"
        value={`UGX ${stats.revenueByFuelType.kerosene.toLocaleString()}`}
        description={`${stats.fuelVolumeSold.kerosene.toLocaleString()} L sold`}
        icon={Flame}
        iconColor="text-amber-600 dark:text-amber-400"
      />
    </div>
  );
}
