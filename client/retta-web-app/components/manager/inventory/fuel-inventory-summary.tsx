"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, CheckCircle2 } from "lucide-react";

interface FuelInventorySummaryProps {
  pendingCount: number;
  acknowledgedCount: number;
}

export function FuelInventorySummary({
  pendingCount,
  acknowledgedCount,
}: FuelInventorySummaryProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Pending Deliveries
          </CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingCount}</div>
          <p className="text-xs text-muted-foreground">
            Awaiting acknowledgment
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Acknowledged Deliveries
          </CardTitle>
          <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{acknowledgedCount}</div>
          <p className="text-xs text-muted-foreground">Successfully received</p>
        </CardContent>
      </Card>
    </div>
  );
}
