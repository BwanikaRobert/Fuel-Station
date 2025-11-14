"use client";

import { DashboardStats } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { CreditCard } from "lucide-react";

interface FuelPricesHeaderProps {
  prices: {
    gasoline: number;
    diesel: number;
    kerosene: number;
  };
  totalCreditsAvailable?: number;
}

export function FuelPricesHeader({
  prices,
  totalCreditsAvailable = 0,
}: FuelPricesHeaderProps) {
  return (
    <div className="flex gap-4 flex-wrap items-center">
      {/* Petrol Price */}
      <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
        <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
          Petrol:
        </span>
        <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
          UGX {prices.gasoline.toLocaleString()}/L
        </span>
      </div>

      {/* Diesel Price */}
      <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
        <span className="text-sm font-medium text-green-900 dark:text-green-100">
          Diesel:
        </span>
        <span className="text-lg font-bold text-green-600 dark:text-green-400">
          UGX {prices.diesel.toLocaleString()}/L
        </span>
      </div>

      {/* Kerosene Price */}
      <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800">
        <span className="text-sm font-medium text-amber-900 dark:text-amber-100">
          Kerosene:
        </span>
        <span className="text-lg font-bold text-amber-600 dark:text-amber-400">
          UGX {prices.kerosene.toLocaleString()}/L
        </span>
      </div>

      {/* Total Credits Badge */}
      {totalCreditsAvailable > 0 && (
        <div className="ml-auto flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800">
          <div className="flex flex-col">
            <span className="text-xs font-medium text-orange-900 dark:text-orange-100">
              Outstanding Credits
            </span>
            <span className="text-lg font-bold text-orange-600 dark:text-orange-400">
              UGX {totalCreditsAvailable.toLocaleString()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
