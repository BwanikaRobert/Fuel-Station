"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface SalesSummaryCardProps {
  totalRevenue: number;
  totalVolume: number;
}

export function SalesSummaryCard({
  totalRevenue,
  totalVolume,
}: SalesSummaryCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatVolume = (volume: number) => {
    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 2,
    }).format(volume);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Summary</CardTitle>
        <CardDescription>Total revenue and volume</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">Total Revenue</p>
          <div className="text-2xl font-bold">
            {formatCurrency(totalRevenue)}
          </div>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Total Volume</p>
          <div className="text-2xl font-bold">
            {formatVolume(totalVolume)} L
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
