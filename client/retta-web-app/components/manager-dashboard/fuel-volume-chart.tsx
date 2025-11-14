"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from "recharts";

interface FuelVolumeChartProps {
  fuelVolumeSold: {
    gasoline: number;
    diesel: number;
    kerosene: number;
  };
}

export function FuelVolumeChart({ fuelVolumeSold }: FuelVolumeChartProps) {
  // Assuming tank capacity is 10,000L per fuel type
  // Calculate remaining volume = capacity - volume sold
  const TANK_CAPACITY = 10000;

  const chartData = [
    {
      name: "Petrol",
      volume: TANK_CAPACITY - fuelVolumeSold.gasoline,
      color: "hsl(217, 91%, 60%)",
    },
    {
      name: "Diesel",
      volume: TANK_CAPACITY - fuelVolumeSold.diesel,
      color: "hsl(142, 76%, 36%)",
    },
    {
      name: "Kerosene",
      volume: TANK_CAPACITY - fuelVolumeSold.kerosene,
      color: "hsl(38, 92%, 50%)",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Remaining Fuel Volume in Tanks</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            volume: {
              label: "Remaining Volume",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-[300px] w-full"
        >
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis
              tickFormatter={(value: number) => `${(value / 1000).toFixed(1)}K`}
            />
            <ChartTooltip
              content={<ChartTooltipContent />}
              formatter={(value: number) => `${value.toLocaleString()} L`}
            />
            <Bar dataKey="volume" radius={[8, 8, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
