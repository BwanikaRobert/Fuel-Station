"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

interface ExpensesByCategoryChartProps {
  data: Array<{
    category: string;
    amount: number;
  }>;
}

export function ExpensesByCategoryChart({
  data,
}: ExpensesByCategoryChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Expenses by Category</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            amount: {
              label: "Amount",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-[350px] w-full"
        >
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis
              tickFormatter={(value: number) => `${(value / 1000).toFixed(0)}K`}
            />
            <ChartTooltip
              content={<ChartTooltipContent />}
              formatter={(value: number) => `UGX ${value.toLocaleString()}`}
            />
            <Bar
              dataKey="amount"
              fill="hsl(var(--chart-2))"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
