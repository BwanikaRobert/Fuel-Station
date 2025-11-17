"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingDown, AlertCircle } from "lucide-react";

interface ExpenseSummaryCardsProps {
  todayExpenses: number;
  totalExpenses: number;
  unverifiedExpenses: number;
}

export function ExpenseSummaryCards({
  todayExpenses,
  totalExpenses,
  unverifiedExpenses,
}: ExpenseSummaryCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Today&apos;s Expenses
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            UGX {todayExpenses.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            Expenses recorded today
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            This Month&apos;s Expenses
          </CardTitle>
          <TrendingDown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            UGX {totalExpenses.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">All recorded expenses</p>
        </CardContent>
      </Card>

      <Card
        className={
          unverifiedExpenses > 0
            ? "border-orange-200 dark:border-orange-800"
            : ""
        }
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Unverified Expenses
          </CardTitle>
          <AlertCircle
            className={`h-4 w-4 ${
              unverifiedExpenses > 0
                ? "text-orange-600 dark:text-orange-400"
                : "text-muted-foreground"
            }`}
          />
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-bold ${
              unverifiedExpenses > 0
                ? "text-orange-600 dark:text-orange-400"
                : ""
            }`}
          >
            UGX {unverifiedExpenses.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            Last 2 days - Pending verification
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
