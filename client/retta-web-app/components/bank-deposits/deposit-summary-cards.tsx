"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp } from "lucide-react";

interface BankDepositSummaryCardsProps {
  todayDeposits: number;
  totalDeposits: number;
}

export function BankDepositSummaryCards({
  todayDeposits,
  totalDeposits,
}: BankDepositSummaryCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Today&apos;s Deposits
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            UGX {todayDeposits.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">Deposits made today</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Deposits</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            UGX {totalDeposits.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">All recorded deposits</p>
        </CardContent>
      </Card>
    </div>
  );
}
