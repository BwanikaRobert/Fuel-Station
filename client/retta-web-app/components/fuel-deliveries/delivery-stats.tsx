"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FuelDelivery } from "@/lib/types";

interface DeliveryStatsProps {
  deliveries: FuelDelivery[];
}

export function DeliveryStats({ deliveries }: DeliveryStatsProps) {
  const totalCost = deliveries.reduce((sum, d) => sum + d.totalCost, 0);
  const totalLiters = deliveries.reduce((sum, d) => sum + d.quantityLiters, 0);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">
            Total Fuel Ordered
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalLiters.toLocaleString()} L
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Across all deliveries
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">
            Total Investment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            UGX {totalCost.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Total purchasing cost
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
