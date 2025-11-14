"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";

interface SalesTrendChartProps {
  data: Array<{
    date: string;
    amount: number;
  }>;
}

export function SalesTrendChart({ data }: SalesTrendChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Trend (Last 7 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            amount: {
              label: "Sales",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[300px]"
        >
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(value) =>
                new Date(value).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
            />
            <YAxis />
            <ChartTooltip
              content={<ChartTooltipContent />}
              formatter={(value: number) => `UGX ${value.toLocaleString()}`}
            />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="hsl(var(--chart-1))"
              strokeWidth={2}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
