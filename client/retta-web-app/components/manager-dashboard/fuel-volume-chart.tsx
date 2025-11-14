'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

interface FuelVolumeChartProps {
  fuelVolumeSold: {
    gasoline: number;
    diesel: number;
    kerosene: number;
  };
}

export function FuelVolumeChart({ fuelVolumeSold }: FuelVolumeChartProps) {
  const chartData = [
    { name: 'Gasoline', volume: fuelVolumeSold.gasoline },
    { name: 'Diesel', volume: fuelVolumeSold.diesel },
    { name: 'Kerosene', volume: fuelVolumeSold.kerosene },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fuel Volume Sold</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            volume: {
              label: 'Volume',
              color: 'hsl(var(--chart-2))',
            },
          }}
          className="h-[300px]"
        >
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <ChartTooltip
              content={<ChartTooltipContent />}
              formatter={(value: number) => `${value.toLocaleString()} L`}
            />
            <Bar dataKey="volume" fill="hsl(var(--chart-2))" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
