"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface CreditsSummaryCardProps {
  totalCredits: number;
  totalOutstanding: number;
}

export function CreditsSummaryCard({
  totalCredits,
  totalOutstanding,
}: CreditsSummaryCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Credits Summary</CardTitle>
        <CardDescription>Total credits and outstanding</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">Total Credits</p>
          <div className="text-2xl font-bold">
            {formatCurrency(totalCredits)}
          </div>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Outstanding</p>
          <div className="text-2xl font-bold text-amber-600">
            {formatCurrency(totalOutstanding)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
