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

interface RevenueByFuelChartProps {
  revenueByFuelType: {
    gasoline: number;
    diesel: number;
    kerosene: number;
  };
}

const chartConfig = {
  revenue: {
    label: "Revenue",
  },
  Petrol: {
    label: "Petrol",
    color: "hsl(217, 91%, 60%)",
  },
  Diesel: {
    label: "Diesel",
    color: "hsl(142, 76%, 36%)",
  },
  Kerosene: {
    label: "Kerosene",
    color: "hsl(38, 92%, 50%)",
  },
} satisfies ChartConfig;

export function RevenueByFuelChart({
  revenueByFuelType,
}: RevenueByFuelChartProps) {
  const chartData = [
    {
      name: "Petrol",
      revenue: revenueByFuelType.gasoline,
      fill: "hsl(217, 91%, 60%)",
    },
    {
      name: "Diesel",
      revenue: revenueByFuelType.diesel,
      fill: "hsl(142, 76%, 36%)",
    },
    {
      name: "Kerosene",
      revenue: revenueByFuelType.kerosene,
      fill: "hsl(38, 92%, 50%)",
    },
  ];

  const total = chartData.reduce((sum, item) => sum + item.revenue, 0);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Revenue by Fuel Type</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
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
                return `${name} ${percent}%`;
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
