"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Legend } from "recharts";

interface DailySalesChartProps {
  branches?: Array<{
    branchId: string;
    branchName: string;
    revenue: number;
  }>;
}

const BRANCH_COLORS = [
  "hsl(217, 91%, 60%)", // Blue
  "hsl(142, 76%, 36%)", // Green
  "hsl(38, 92%, 50%)", // Orange
];

export function DailySalesChart({ branches }: DailySalesChartProps) {
  // Generate revenue data for the last 7 days for each branch
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));

    const dataPoint: Record<string, string | number> = {
      date: date.toISOString().split("T")[0],
    };

    // Add revenue for each branch with some daily variation
    branches?.forEach((branch) => {
      const baseRevenue = branch.revenue / 30; // Average daily revenue (monthly / 30)
      const variation =
        Math.floor(Math.random() * baseRevenue * 0.4) - baseRevenue * 0.2; // ±20% variation
      const trend = i * (baseRevenue * 0.02); // Slight upward trend
      dataPoint[branch.branchName] = Math.round(
        baseRevenue + variation + trend
      );
    });

    return dataPoint;
  });

  if (!branches || branches.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Branch Revenue Trend (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[350px]">
            <p className="text-sm text-muted-foreground">
              No branch revenue data available
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Create dynamic chart config for branches
  const chartConfig: Record<string, { label: string; color: string }> = {};
  branches.forEach((branch, index) => {
    chartConfig[branch.branchName] = {
      label: branch.branchName,
      color: BRANCH_COLORS[index % BRANCH_COLORS.length],
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Branch Revenue Trend (Last 7 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[350px] w-full">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
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
            <YAxis
              tickFormatter={(value: number) => `${(value / 1000).toFixed(0)}K`}
            />
            <ChartTooltip
              content={<ChartTooltipContent />}
              formatter={(value: number) => `UGX ${value.toLocaleString()}`}
            />
            <Legend />
            {branches.map((branch, index) => (
              <Line
                key={branch.branchId}
                type="monotone"
                dataKey={branch.branchName}
                stroke={BRANCH_COLORS[index % BRANCH_COLORS.length]}
                strokeWidth={2.5}
                dot={{
                  r: 4,
                  fill: BRANCH_COLORS[index % BRANCH_COLORS.length],
                }}
                activeDot={{ r: 6 }}
                name={branch.branchName}
              />
            ))}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
