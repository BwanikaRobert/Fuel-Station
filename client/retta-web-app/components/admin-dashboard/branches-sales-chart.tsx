"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Pie, PieChart } from "recharts";

interface BranchesSalesChartProps {
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
  "hsl(280, 65%, 60%)", // Purple
  "hsl(340, 82%, 52%)", // Pink
];

export function BranchesSalesChart({ branches }: BranchesSalesChartProps) {
  if (!branches || branches.length === 0) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Branch Sales This Month</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <div className="flex items-center justify-center h-[350px]">
            <p className="text-sm text-muted-foreground">
              No branch sales data available
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = branches.map((branch, index) => ({
    branchId: branch.branchId,
    name: branch.branchName,
    revenue: branch.revenue,
    fill: BRANCH_COLORS[index % BRANCH_COLORS.length],
  }));

  const total = chartData.reduce((sum, item) => sum + item.revenue, 0);

  // Create dynamic config with branch names
  const dynamicConfig = {
    revenue: { label: "Revenue" },
    ...Object.fromEntries(
      branches.map((branch, index) => [
        branch.branchName,
        {
          label: branch.branchName,
          color: BRANCH_COLORS[index % BRANCH_COLORS.length],
        },
      ])
    ),
  } satisfies ChartConfig;

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Branch Sales This Month</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={dynamicConfig}
          className="mx-auto aspect-square max-h-[350px]"
        >
          <PieChart>
            <Pie
              data={chartData}
              dataKey="revenue"
              nameKey="name"
              innerRadius={60}
              outerRadius={110}
              strokeWidth={5}
              label={({ name, value }) => {
                const percent = ((value / total) * 100).toFixed(1);
                // Show short name for labels
                const shortName = name.replace(" Station", "");
                return `${shortName}\n${percent}%`;
              }}
              labelLine={{
                stroke: "hsl(var(--foreground))",
                strokeWidth: 1,
              }}
            />
            <ChartTooltip
              content={<ChartTooltipContent hideLabel />}
              formatter={(value: number) => `UGX ${value.toLocaleString()}`}
            />
            <ChartLegend
              content={<ChartLegendContent nameKey="name" />}
              className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
