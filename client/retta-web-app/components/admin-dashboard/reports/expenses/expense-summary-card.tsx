"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

interface ExpenseSummaryCardProps {
  totalExpenses: number;
}

export function ExpenseSummaryCard({ totalExpenses }: ExpenseSummaryCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Expenses</CardTitle>
        <CardDescription>Sum of filtered expenses</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">
          {formatCurrency(totalExpenses)}
        </div>
      </CardContent>
    </Card>
  );
}
