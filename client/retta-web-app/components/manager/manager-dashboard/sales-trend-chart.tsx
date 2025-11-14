"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Line, LineChart, CartesianGrid, XAxis, YAxis, Legend } from "recharts";

interface SalesTrendChartProps {
  data: Array<{
    date: string;
    petrol: number;
    diesel: number;
    kerosene: number;
  }>;
}

export function SalesTrendChart({ data }: SalesTrendChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Trend by Product (Last 7 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            petrol: {
              label: "Petrol",
              color: "hsl(217, 91%, 60%)",
            },
            diesel: {
              label: "Diesel",
              color: "hsl(142, 76%, 36%)",
            },
            kerosene: {
              label: "Kerosene",
              color: "hsl(38, 92%, 50%)",
            },
          }}
          className="h-[350px] w-full"
        >
          <LineChart
            data={data}
            margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
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
              tickFormatter={(value: number) =>
                `${(value / 1000000).toFixed(1)}M`
              }
            />
            <ChartTooltip
              content={<ChartTooltipContent />}
              formatter={(value: number) => `UGX ${value.toLocaleString()}`}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="petrol"
              stroke="hsl(217, 91%, 60%)"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "hsl(217, 91%, 60%)" }}
              activeDot={{ r: 6 }}
              name="Petrol"
            />
            <Line
              type="monotone"
              dataKey="diesel"
              stroke="hsl(142, 76%, 36%)"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "hsl(142, 76%, 36%)" }}
              activeDot={{ r: 6 }}
              name="Diesel"
            />
            <Line
              type="monotone"
              dataKey="kerosene"
              stroke="hsl(38, 92%, 50%)"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "hsl(38, 92%, 50%)" }}
              activeDot={{ r: 6 }}
              name="Kerosene"
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
